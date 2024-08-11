import {
  Table,
  TableCaption,
  TableRow,
  TableHeader,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { Submission } from "@/lib/definitions";

export default function SubmissionTab({ submissions }: { submissions: Submission[] }) {
  if (submissions.length === 0) return <h1 className="text-xl">No submission yet</h1>;

  return (
    <Table>
      <TableCaption>A list of your submissions.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Language</TableHead>
          <TableHead>Verdict</TableHead>
          <TableHead>Submitted At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions.map((submission, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{submission.language}</TableCell>
            <TableCell>{submission.verdict}</TableCell>
            <TableCell>{new Date(submission.submittedAt).toString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total Submissions</TableCell>
          <TableCell className="text-right">{submissions.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
