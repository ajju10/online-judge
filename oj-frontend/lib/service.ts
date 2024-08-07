import { unstable_noStore as noStore } from "next/cache";
import { getBaseURL } from "@/lib/utils";
import { RunRequestPayload, SubmitRequestPayload } from "@/lib/definitions";

interface SignupUserProps {
  username: string;
  name: string;
  email: string;
  password: string;
}

interface LoginUserProps {
  username: string;
  password: string;
}

const baseUrl = getBaseURL();

export async function signupUser(userData: SignupUserProps) {
  noStore();
  const url = new URL("/api/v1/auth/signup", baseUrl);
  try {
    return await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...userData }),
    });
  } catch (error) {
    console.error("Signup service error", error);
    throw error;
  }
}

export async function signInUser(userData: LoginUserProps) {
  noStore();
  const url = new URL("/api/v1/auth/login", baseUrl);
  try {
    return await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...userData }),
    });
  } catch (error) {
    console.error("Login Service error", error);
    throw error;
  }
}
