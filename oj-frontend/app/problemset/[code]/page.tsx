import { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProblemDescTab from "@/components/problem-desc";
import SubmissionTab from "@/components/submission";
import CodeEditor from "@/components/editor";
import { fetchProblemDetails, fetchSubmissions } from "@/lib/data";
import { isUserLoggedIn } from "@/lib/serverUtils";

export const metadata: Metadata = {
  title: "Problem",
};

export default async function Problem({ params }: { params: { code: string } }) {
  const problemDetails = await fetchProblemDetails(params.code);
  const submissions = await fetchSubmissions(params.code);
  const isLoggedIn = await isUserLoggedIn();
  return (
    <section className="py-4">
      <div className="container mx-auto max-w-fit px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Tabs defaultValue="question" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="question">Question</TabsTrigger>
                <TabsTrigger value="submissions">Submissions</TabsTrigger>
              </TabsList>
              <TabsContent value="question">
                <ProblemDescTab problemDetails={problemDetails!} />
              </TabsContent>
              <TabsContent value="submissions">
                <SubmissionTab submissions={submissions} />
              </TabsContent>
            </Tabs>
          </div>
          <CodeEditor isLoggedIn={isLoggedIn} code={params.code} />
        </div>
      </div>
    </section>
  );
}
