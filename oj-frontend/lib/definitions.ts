type Example = {
  input: string;
  output: string;
  explanation: string | null;
};

type TestCase = {
  srno: number;
  input: string;
  expectedOutput: string;
};

export type Submission = {
  language: string;
  sourceCode: string;
  verdict: string;
  submittedAt: string;
};

export type Problem = {
  id: string;
  title: string;
  totalSubmissions: number;
  difficulty: "Easy" | "Medium" | "Hard";
};

export type ProblemDetails = {
  title: string;
  code: string;
  description: string;
  difficulty: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  examples: Example[];
  testCases: TestCase[];
  submissions: Submission[];
};

export type RunRequestPayload = {
  lang: string;
  source_code: string;
  stdin: string;
};

export type SubmitRequestPayload = {
  lang: string;
  source_code: string;
};
