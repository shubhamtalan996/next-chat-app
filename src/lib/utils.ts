import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getEnvVariable = (variable: string) => {
  try {
    return process.env[variable] || "";
  } catch (error) {
    throw new Error(`Missing ${variable}`);
  }
};
