/*
  ==========================================================
  cn.ts
  ----------------------------------------------------------
  Utility function for combining Tailwind CSS classes.
  ==========================================================
*/

import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}