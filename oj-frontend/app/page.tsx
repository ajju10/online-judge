import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="bg-gradient-to-r from-primary to-primary-foreground py-24 text-primary-foreground">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold sm:text-5xl">Online Judge</h1>
            <p className="mt-4 text-lg">A powerful platform for practicing programming.</p>
            <div className="mt-8 flex justify-center space-x-4">
              <Link href="/problemset" className={buttonVariants({ variant: "default" })}>
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold">Key Features</h2>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-muted p-6 shadow-sm">
                <h3 className="text-xl font-bold">Submit Code</h3>
                <p className="mt-2 text-muted-foreground">
                  Upload your code and test it against our test cases.
                </p>
              </div>
              <div className="rounded-lg bg-muted p-6 shadow-sm">
                <h3 className="text-xl font-bold">View Problems</h3>
                <p className="mt-2 text-muted-foreground">
                  Browse through a wide range of problem statements and improve your coding skills.
                </p>
              </div>
              <div className="rounded-lg bg-muted p-6 shadow-sm">
                <h3 className="text-xl font-bold">Track Submissions</h3>
                <p className="mt-2 text-muted-foreground">
                  Monitor your submission history and track your progress.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
