"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { signInUser, signupUser } from "@/lib/service";
import { cookies } from "next/headers";
import { RunRequestPayload, SubmitRequestPayload } from "@/lib/definitions";
import { unstable_noStore as noStore } from "next/dist/server/web/spec-extension/unstable-no-store";
import { getBaseURL } from "@/lib/utils";
import { getAuthToken } from "@/lib/serverUtils";

const baseUrl = getBaseURL();

const loginSchema = z.object({
  username: z.string().min(5).max(10, {
    message: "Username must be between 5 and 10 characters",
  }),
  password: z.string().min(6).max(20, {
    message: "Password must be between 6 and 20 characters",
  }),
});

const signupSchema = z.object({
  username: z.string().min(5).max(10, {
    message: "Username must be between 5 and 10 characters",
  }),
  name: z.string(),
  email: z.string().email({
    message: "Please enter a valid email",
  }),
  password: z.string().min(6).max(20, {
    message: "Password must be between 6 and 20 characters",
  }),
});

const cookieConfig = {
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: "/",
  domain: process.env.HOST ?? "localhost",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

export async function signupUserAction(prevState: any, formData: FormData) {
  const validatedFields = signupSchema.safeParse({
    username: formData.get("username"),
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      apiErrors: null,
      message: "Please provide valid data",
    };
  }

  const response = await signupUser(validatedFields.data);
  if (!response.ok) {
    return {
      ...prevState,
      zodErrors: null,
      apiErrors: null,
      message: "Failed to register user, please try again.",
    };
  }

  const jsonData = await response.json();
  if (jsonData.data === null) {
    return {
      ...prevState,
      zodErrors: null,
      apiErrors: jsonData.message,
      message: "Failed to register user, please try again.",
    };
  }

  cookies().set("authcookie", jsonData.data, cookieConfig);
  redirect("/");
}

export async function signInUserAction(prevState: any, formData: FormData) {
  const validatedFields = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      apiErrors: null,
      message: "Incorrect email or password, cannot login",
    };
  }

  let response = await signInUser(validatedFields.data);
  if (!response.ok) {
    return {
      ...prevState,
      zodErrors: null,
      apiErrors: null,
      message: "Something went wrong, please try again.",
    };
  }

  const jsonData = await response.json();
  if (jsonData.data === null) {
    return {
      ...prevState,
      zodErrors: null,
      apiErrors: jsonData.message,
      message: "Failed to login",
    };
  }

  cookies().set("authcookie", jsonData.data, cookieConfig);
  redirect("/");
}

export async function runCode(data: RunRequestPayload, problemCode: string) {
  noStore();
  const url = new URL(`/api/v1/problemset/${problemCode}/run`, baseUrl);
  const authToken = getAuthToken();
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.toString(),
    };
  }
}

export async function submitCode(data: SubmitRequestPayload, problemCode: string) {
  noStore();
  let url = new URL(`/api/v1/problemset/${problemCode}/submit`, baseUrl);
  const authToken = getAuthToken();
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error: any) {
    console.log("Error in line 162", error);
    return {
      success: false,
      data: null,
      message: error.toString(),
    };
  }
}
