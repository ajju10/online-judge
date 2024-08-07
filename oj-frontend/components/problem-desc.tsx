import ProblemConstraint from "@/components/problem-constraint";
import { ProblemDetails } from "@/lib/definitions";

export default function ProblemDescTab({ problemDetails }: { problemDetails: ProblemDetails }) {
  const constraints = problemDetails.constraints.split("\n");
  return (
    <>
      <h2 className="text-3xl font-bold">{problemDetails.title}</h2>
      <div className="mt-8 space-y-4">
        <div>
          <h3 className="text-xl font-bold">Problem Description</h3>
          <p className="text-muted-foreground">{problemDetails.description}</p>
        </div>
        <div>
          <h3 className="text-xl font-bold">Input Format</h3>
          <p className="text-muted-foreground">{problemDetails.inputFormat}</p>
        </div>
        <div>
          <h3 className="text-xl font-bold">Output Format</h3>
          <p className="text-muted-foreground">{problemDetails.outputFormat}</p>
        </div>
        <div>
          <h3 className="text-xl font-bold">Sample Input/Output</h3>
          <div className="grid gap-2">
            {problemDetails.examples.map((example, index) => (
              <div key={index} className="bg-muted p-4 rounded-md">
                <p>Input: {example.input}</p>
                <p>Output: {example.output}</p>
                {example.explanation && <p>Explanation: {example.explanation}</p>}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold">Constraints</h3>
          <ProblemConstraint constraints={constraints} />
        </div>
      </div>
    </>
  );
}
