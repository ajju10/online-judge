"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { signInUserAction } from "@/lib/action";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ZodErrors from "@/components/zoderrors";
import ApiErrors from "@/components/apierrors";

const INITIAL_STATE = {
  data: null,
};

export default function SignInForm() {
  const [formState, formAction] = useFormState(signInUserAction, INITIAL_STATE);
  return (
    <section className="bg-gradient-to-r from-primary to-primary-foreground py-24 text-primary-foreground">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md space-y-6">
          <h1 className="text-4xl font-bold sm:text-5xl">Sign In</h1>
          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                className="text-black bg-white"
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                required
              />
              <ZodErrors error={formState?.zodErrors?.username} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                className="text-black bg-white"
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
              />
              <ZodErrors error={formState?.zodErrors?.password} />
            </div>
            {/*<div className="flex items-center justify-between">*/}
            {/*  <div className="flex items-center">*/}
            {/*    <Checkbox id="remember" />*/}
            {/*    <Label htmlFor="remember" className="ml-2">*/}
            {/*      Remember me*/}
            {/*    </Label>*/}
            {/*  </div>*/}
            {/*  <Link*/}
            {/*    href="#"*/}
            {/*    className="text-sm font-medium text-primary-foreground hover:underline"*/}
            {/*    prefetch={false}*/}
            {/*  >*/}
            {/*    Forgot password?*/}
            {/*  </Link>*/}
            {/*</div>*/}
            <Button type="submit" className="w-full">
              Sign In
            </Button>
            <div className="text-center">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-sm font-medium text-primary-foreground hover:underline"
                prefetch={false}
              >
                Sign Up
              </Link>
            </div>
            <div className="space-y-2">
              <ApiErrors error={formState?.apiErrors} />
              <ApiErrors error={formState?.message} />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
