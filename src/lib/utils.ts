import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string into a more readable format
 * @param dateString - ISO date string to format
 * @returns Formatted date string (e.g., "15 Aug, 2025")
 */
export function formatDate(dateString: string): string {
  if (!dateString) {
    return "Unknown date";
  }
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).replace(',', '');
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}
