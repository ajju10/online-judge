import { Elysia, t } from "elysia";
import { prisma } from "@libs/prisma";
import { isAuthenticated } from "@middlewares/auth";
import { pollTaskStatus } from "@utils/utils";
import { Verdict } from "@prisma/client";

export const problemController = new Elysia({ prefix: "/problemset" })
  .get("/", async ({ set }) => {
    let problems = await prisma.problem.findMany({
      select: {
        title: true,
        code: true,
        difficulty: true,
        submissions: true,
      },
    });
    if (!problems) {
      set.status = 404;
      return {
        success: false,
        data: null,
        message: "No problems found, please try again",
      };
    }

    set.status = 200;
    return {
      success: true,
      data: problems,
      message: "Problems fetched successfully",
    };
  })
  .get("/:code", async ({ params: { code }, set }) => {
    let problem = await prisma.problem.findUnique({
      where: {
        code,
      },
      select: {
        title: true,
        code: true,
        description: true,
        difficulty: true,
        inputFormat: true,
        outputFormat: true,
        constraints: true,
        examples: true,
        testCases: true,
      },
    });
    if (!problem) {
      set.status = 400;
      return {
        success: false,
        data: null,
        message: "Could not fetch problem details, please try again.",
      };
    }

    set.status = 200;
    return {
      success: true,
      data: problem,
      message: "Problem details fetched successfully.",
    };
  })
  .use(isAuthenticated)
  .get("/:code/submission", async ({ params: { code }, user, set }) => {
    if (!user) {
      set.status = 401;
      return {
        success: false,
        data: null,
        message: "Unauthenticated user, please login again.",
      };
    }

    const problem = await prisma.problem.findFirst({
      where: {
        code,
      },
      select: {
        id: true,
      },
    });
    if (!problem) {
      set.status = 404;
      return {
        success: false,
        data: null,
        message: "No problem with the code found.",
      };
    } else {
      let submissions = await prisma.submission.findMany({
        where: {
          AND: [
            {
              userId: user.userId.toString(),
            },
            {
              problemId: problem.id,
            },
          ],
        },
        select: {
          language: true,
          sourceCode: true,
          verdict: true,
          submittedAt: true,
        },
      });
      if (!submissions) {
        set.status = 404;
        return {
          success: false,
          data: null,
          message: "No submissions found.",
        };
      }
      return {
        success: true,
        data: submissions,
        message: "Submissions fetched successfully.",
      };
    }
  })
  .post(
    "/:code/run",
    async ({ body, params: { code }, user, set }) => {
      if (!user) {
        set.status = 401;
        return {
          success: false,
          data: null,
          message: "Unauthenticated user, please login again.",
        };
      }

      const url = Bun.env.CODE_ENGINE_SERVER! + "/test-run";
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        if (!response.ok) {
          set.status = response.status;
          return {
            success: false,
            data: null,
            message: "Some error occurred, please try again.",
          };
        }

        let resBody = await response.json();
        set.status = 200;
        return {
          success: true,
          data: resBody,
          message: "Code run successfully.",
        };
      } catch (error: any) {
        set.status = 400;
        return {
          success: false,
          data: null,
          message: error.toString(),
        };
      }
    },
    {
      body: t.Object({
        lang: t.String(),
        source_code: t.String(),
        stdin: t.String(),
      }),
    }
  )
  .post(
    "/:code/submit",
    async ({ body, params: { code }, user, set }) => {
      if (!user) {
        set.status = 401;
        return {
          success: false,
          data: null,
          message: "Unauthenticated user, please login again.",
        };
      }

      const url = Bun.env.CODE_ENGINE_SERVER! + "/execute";
      const { lang, source_code } = body;
      const problem = await prisma.problem.findUnique({
        where: {
          code,
        },
      });
      if (!problem) {
        set.status = 404;
        return {
          success: false,
          data: null,
          message: "Could not find problem",
        };
      }

      const testCases = problem.testCases;
      const payloadTestCases = testCases.map((testCase) => {
        return {
          srno: testCase.srno,
          input: testCase.input,
          expected_output: testCase.expectedOutput,
        };
      });
      const data = {
        lang,
        source_code,
        test_cases: payloadTestCases,
      };
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          set.status = response.status;
          return {
            success: false,
            data: null,
            message: "Could not take the submission.",
          };
        }

        const resBody = await response.json();
        const taskId = resBody.task_id;
        try {
          const pollRes = await pollTaskStatus(taskId);
          console.log("Poll result:", pollRes);
          const results = pollRes.test_case_result;
          let verdict: Verdict = Verdict.INITIAL;
          if (pollRes.compiler_error_msg !== "") {
            verdict = Verdict.COMPILATION_ERROR;
          } else {
            for (let i = 0; i < results.length; i++) {
              if (results[i].status === "Error") {
                verdict = Verdict.RUNTIME_ERROR;
                break;
              } else if (results[i].status === "Failed") {
                verdict = Verdict.WRONG_ANSWER;
                break;
              }
            }
            if (verdict === Verdict.INITIAL) {
              verdict = Verdict.ACCEPTED;
            }
          }
          let submission = await prisma.submission.create({
            data: {
              problemId: problem.id,
              userId: user.userId.toString(),
              language: lang,
              sourceCode: source_code,
              verdict,
            },
          });

          set.status = 200;
          return {
            success: true,
            data: {
              verdict: submission.verdict,
              pollRes,
            },
            message: "Solution submitted successfully",
          };
        } catch (error: any) {
          set.status = 400;
          return {
            success: false,
            data: null,
            message: error.toString(),
          };
        }
      } catch (error: any) {
        set.status = 400;
        return {
          success: false,
          data: null,
          message: error.toString(),
        };
      }
    },
    {
      body: t.Object({
        lang: t.String(),
        source_code: t.String(),
      }),
    }
  );
