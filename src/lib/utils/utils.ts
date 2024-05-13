import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DateTime } from "luxon";

/**
 * Merges the classes together and returns a string.
 * @param {ClassValue[]} inputs - The classes to be merged.
 * @returns {string} The merged classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function starFromRating(rating: number) {
  return Math.round(rating * 2) / 2;
}

/**
 * Formats a date into a specified format string using Luxon.
 * @param {Date | string | number | undefined} date - The date to format. Can be a Date object, a string, a timestamp, or undefined.
 * @param {string} formatStr - The format string to use, e.g., 'yyyy LLL dd'.
 * @returns {string} The formatted date string or a default value if the date is not valid.
 */
export function formatDate(
  date: Date | string | number | undefined,
  formatStr: string = "yyyy LLL dd",
  defaultValue: string = "Select a date"
): string {
  if (!date) return defaultValue; // Return default value if date is falsy

  const dt =
    typeof date === "string"
      ? DateTime.fromISO(date)
      : typeof date === "number"
      ? DateTime.fromMillis(date)
      : DateTime.fromJSDate(date);

  return dt.isValid ? dt.toFormat(formatStr) : defaultValue; // Check if DateTime object is valid
}

// Example usage:
// const formattedDate = formatDate(new Date(), 'yyyy LLL dd'); // '2024 May 13'

/**
 * Formats a number into a currency format as dollars with proper thousands separator and two decimal places.
 * @param {number} amount - The amount to be formatted.
 * @returns {string} The formatted currency string.
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
