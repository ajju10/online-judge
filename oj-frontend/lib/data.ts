import { unstable_noStore as noStore } from "next/cache";

import { getBaseURL } from "@/lib/utils";
import { Problem, ProblemDetails, Submission } from "@/lib/definitions";
import { getAuthToken } from "@/lib/serverUtils";

const baseUrl = getBaseURL();

export async function fetchProblems() {
  noStore();
  const url = new URL("/api/v1/problemset", baseUrl);
  const response = await fetch(url);
  if (!response.ok) {
    return null;
  }
  let problems: Problem[] = [];
  const jsonData = await response.json();
  const data = jsonData.data;
  for (let i = 0; i < data.length; i++) {
    problems.push({
      id: data[i].code,
      title: data[i].title,
      difficulty: data[i].difficulty,
      totalSubmissions: data[i].submissions.length,
    });
  }
  return problems;
}

export async function fetchProblemDetails(code: string) {
  noStore();
  const url = new URL(`/api/v1/problemset/${code}`, baseUrl);
  const response = await fetch(url);
  if (!response.ok) {
    return null;
  }
  const jsonData = await response.json();
  const problemDetails: ProblemDetails = { ...jsonData.data };
  return problemDetails;
}

export async function fetchSubmissions(problemCode: string) {
  noStore();
  const url = new URL(`/api/v1/problemset/${problemCode}/submission`, baseUrl);
  const authToken = getAuthToken();
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (!response.ok) return [];
    const jsonData = await response.json();
    const mySubmissions: Submission[] = jsonData.data;
    return mySubmissions;
  } catch (error: any) {
    return [];
  }
}
