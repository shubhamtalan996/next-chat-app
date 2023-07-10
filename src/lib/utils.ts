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

export const chatHrefContructor = (id1: string, id2: string) => {
  const sortedIds = [id1, id2].sort();
  return `${sortedIds[0]}--${sortedIds[1]}`;
};

export const toPusherKey = (key: string) => {
  return key.replace(/:/g, "__");
};
