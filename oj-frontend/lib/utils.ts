import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBaseURL() {
  return process.env.API_URL;
}

export function removeLeadingZeroes(id: string) {
  let newId = "";
  for (let i = 0; i < id.length; i++) {
    if (id[i] !== "0") {
      newId += id[i];
    }
  }
  return newId;
}
