import { cookies } from "next/headers";
import { unstable_noStore as noStore } from "next/cache";
import { getBaseURL } from "@/lib/utils";

export function getAuthToken() {
  return cookies().get("authcookie")?.value;
}

export function removeAuthToken() {
  cookies().delete("authcookie");
}

export async function getUserProfile() {
  noStore();
  const token = getAuthToken();
  if (!token) {
    return {
      data: null,
      message: "No authentication token found, please login again",
    };
  }

  const baseUrl = getBaseURL();
  const url = new URL("/api/v1/user/me", baseUrl);
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: error,
    };
  }
}

export async function isUserLoggedIn() {
  const userData = await getUserProfile();
  return userData.data !== null;
}
