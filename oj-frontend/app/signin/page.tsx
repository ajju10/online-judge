import { Metadata } from "next";
import SignInForm from "@/components/signinform";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function SignIn() {
  return <SignInForm />;
}
