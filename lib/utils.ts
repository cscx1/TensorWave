import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// merge tailwind classes and resolve conflicts (used by shadcn components)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
