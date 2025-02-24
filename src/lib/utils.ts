import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateExpiresIn(tokenExpires: number) {
  return new Date(tokenExpires * 1000);
}
