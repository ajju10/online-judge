import { Metadata } from "next";
import SignUpForm from "@/components/signupform";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function Signup() {
  return <SignUpForm />;
}
