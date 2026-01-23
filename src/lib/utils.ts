import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parses a date string from the database (SQLite DATETIME) as UTC.
 * SQLite stores dates without timezone info, so we need to explicitly treat them as UTC.
 * 
 * @param dateString - Date string from database (e.g., "2024-01-15 14:30:00")
 * @returns Date object parsed as UTC
 */
export function parseDatabaseDate(dateString: string | null | undefined): Date {
  if (!dateString) {
    return new Date()
  }
  
  // If the string already has timezone info (ends with Z or has timezone offset like +05:00), use it as-is
  if (dateString.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(dateString)) {
    return new Date(dateString)
  }
  
  // SQLite DATETIME format: "YYYY-MM-DD HH:MM:SS" or "YYYY-MM-DD HH:MM:SS.SSS"
  // Convert to ISO format by replacing space with 'T' and appending 'Z' for UTC
  const isoString = dateString.replace(' ', 'T') + 'Z'
  return new Date(isoString)
}
