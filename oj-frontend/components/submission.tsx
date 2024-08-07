import { Submission } from "@/lib/definitions";

export default function SubmissionTab({ submissions }: { submissions: Submission[] }) {
  if (submissions.length === 0) return <h1 className="text-xl">No submission yet</h1>;

  return (
    <div>
      <h1 className="text-xl">Submission details</h1>
      <ul>
        {submissions.map((submission, index) => (
          <li key={index}>
            Verdict: {submission.verdict} | Submitted At:{" "}
            {new Date(`${submission.submittedAt}`).toString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
