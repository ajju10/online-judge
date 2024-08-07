import { Elysia, t } from "elysia";
import { cookie } from "@elysiajs/cookie";
import jwt from "@elysiajs/jwt";
import { swagger } from "@elysiajs/swagger";
import { prisma } from "~libs/prisma";
import { comparePassword, hashPassword } from "~utils/bcrypt";
import { isAuthenticated } from "./auth";
import cors from "@elysiajs/cors";
import { logger } from "@chneau/elysia-logger";
import { pollTaskStatus } from "~utils/utils";
import { Verdict } from "@prisma/client";

const app = new Elysia()
  .use(cookie())
  .use(swagger())
  .use(cors())
  .use(logger())
  .use(
    jwt({
      name: "jwt",
      secret: Bun.env.JWT_SECRET!,
      exp: "7d",
    })
      .get("/", () => "Hello from Online Judge API")
      .post(
        "/api/v1/auth/signup",
        async ({ body, set }) => {
          const { email, username, name, password } = body;
          // check duplicate email address
          const emailExists = await prisma.user.findUnique({
            where: {
              email,
            },
            select: {
              id: true,
            },
          });
          if (emailExists) {
            set.status = 400;
            return {
              success: false,
              data: null,
              message: "Email address already in use, please try another one.",
            };
          }

          // check duplicate username
          const usernameExists = await prisma.user.findUnique({
            where: {
              username,
            },
            select: {
              id: true,
            },
          });
          if (usernameExists) {
            set.status = 400;
            return {
              success: false,
              data: null,
              message: "Username already in use, please try another one.",
            };
          }

          const { passwordHash, salt } = await hashPassword(password);
          const newUser = await prisma.user.create({
            data: {
              email,
              username,
              name,
              passwordHash,
              salt,
            },
          });

          return {
            success: true,
            data: {
              user: newUser,
            },
            message: "User account created successfully.",
          };
        },
        {
          body: t.Object({
            email: t.String(),
            username: t.String(),
            name: t.String(),
            password: t.String(),
          }),
        }
      )
      .post(
        "/api/v1/auth/login",
        async ({ body, set, jwt, cookie: { auth } }) => {
          const { username, password } = body;
          // verify username
          const user = await prisma.user.findUnique({
            where: {
              username,
            },
            select: {
              id: true,
              passwordHash: true,
              salt: true,
            },
          });
          if (!user) {
            set.status = 400;
            return {
              success: false,
              data: null,
              message: "Invalid credentials.",
            };
          }

          // verify password
          const isPasswordMatched = await comparePassword(password, user.salt, user.passwordHash);
          if (!isPasswordMatched) {
            set.status = 403;
            return {
              success: false,
              data: null,
              message: "Password is incorrect, could not authenticate",
            };
          }

          // generate JWT token
          const jwtToken = await jwt.sign({
            username,
            userId: user.id,
          });

          // set cookie
          auth.set({
            value: jwtToken,
            httpOnly: true,
            maxAge: 7 * 86400,
          });

          set.status = 200;
          return {
            success: true,
            data: jwtToken,
            message: "Login successful, access token generated",
          };
        },
        {
          body: t.Object({
            username: t.String(),
            password: t.String(),
          }),
        }
      )
      .get("/api/v1/problemset", async ({ set }) => {
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
      .get("/api/v1/problemset/:code", async ({ params: { code }, set }) => {
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
      .post(
        "/api/v1/problemset/:code/run",
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
                message: "Some error occured, please try again.",
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
        "/api/v1/problemset/:code/submit",
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
                  userId: user!.id,
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
      )
      .get("/api/v1/user/me", async ({ user, set }) => {
        if (!user) {
          set.status = 401;
          return {
            success: false,
            data: null,
            message: "Unauthenticated user",
          };
        }

        return {
          success: true,
          data: user,
          message: "Fetched authenticated user details",
        };
      })
      .get("/api/v1/problemset/:code/submission", async ({ params: { code }, user, set }) => {
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
                  userId: user.id,
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
  )
  .listen(8000);

console.log(
  `🦊 Online Judge backend server is running at ${app.server?.hostname}:${app.server?.port}`
);
