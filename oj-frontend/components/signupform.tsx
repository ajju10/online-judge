"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signupUserAction } from "@/lib/action";
import ZodErrors from "@/components/zoderrors";
import ApiErrors from "@/components/apierrors";

const INITIAL_STATE = {
  data: null,
};

export default function SignUpForm() {
  const [formState, formAction] = useFormState(signupUserAction, INITIAL_STATE);
  return (
    <section className="bg-gradient-to-r from-primary to-primary-foreground py-24 text-primary-foreground">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md space-y-6">
          <h1 className="text-4xl font-bold sm:text-5xl">Sign Up</h1>
          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                className="text-black bg-white"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                required
              />
              <ZodErrors error={formState?.zodErrors?.email} />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                className="text-black bg-white"
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
                required
              />
              <ZodErrors error={formState?.zodErrors?.username} />
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                className="text-black bg-white"
                id="name"
                type="text"
                name="name"
                placeholder="Enter your name"
                required
              />
              <ZodErrors error={formState?.zodErrors?.name} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                className="text-black bg-white"
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                required
              />
              <ZodErrors error={formState?.zodErrors?.password} />
            </div>
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
            <div className="text-center">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-sm font-medium text-primary-foreground hover:underline"
                prefetch={false}
              >
                Sign in
              </Link>
            </div>
            <div className="space-y-2">
              <ApiErrors error={formState?.apiErrors} />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
