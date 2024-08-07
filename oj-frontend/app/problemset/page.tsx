import Link from "next/link";
import { Metadata } from "next";
import { fetchProblems } from "@/lib/data";
import { removeLeadingZeroes } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Problem Set",
};

export default async function ProblemSet() {
  const problems = await fetchProblems();
  return (
    <section className="py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold">Problems</h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-muted text-muted-foreground">
                  <th className="px-4 py-3 text-left">No.</th>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-right">Submissions</th>
                  <th className="px-4 py-3 text-right">Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {problems?.map((problem) => (
                  <tr
                    key={problem.id}
                    className="border-b border-muted/20 hover:bg-muted/10 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">{removeLeadingZeroes(problem.id)}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/problemset/${problem.id}`}
                        className="text-primary hover:underline"
                        prefetch={false}
                      >
                        {problem.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right">{problem.totalSubmissions}</td>
                    <td className="px-4 py-3 text-right">{problem.difficulty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
