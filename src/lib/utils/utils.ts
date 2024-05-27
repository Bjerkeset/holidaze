import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DateTime } from "luxon";
import { ErrorObj, VenueType, priceDataType } from "../validation/types";

export const fallbackError: ErrorObj = {
  status: "error",
  statusCode: 500,
  errors: [
    {
      message: "An unexpected error occurred. Please try again later.",
      code: "500",
      path: [],
    },
  ],
};

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

/**
 * Converts the total time between two dates into a formatted time frame.
 * The function returns the time difference in terms of days, weeks, or months.
 * @param {Date | string | number} fromDate - The start date. Can be a Date object, a string, or a timestamp.
 * @param {Date | string | number} toDate - The end date. Can be a Date object, a string, or a timestamp.
 * @returns {string} The formatted time frame.
 */
export function formatTimeFrame(
  fromDate: Date | string | number,
  toDate: Date | string | number
): string {
  const start =
    typeof fromDate === "string"
      ? DateTime.fromISO(fromDate)
      : typeof fromDate === "number"
      ? DateTime.fromMillis(fromDate)
      : DateTime.fromJSDate(fromDate);

  const end =
    typeof toDate === "string"
      ? DateTime.fromISO(toDate)
      : typeof toDate === "number"
      ? DateTime.fromMillis(toDate)
      : DateTime.fromJSDate(toDate);

  if (!start.isValid || !end.isValid) {
    return "Invalid dates";
  }

  const diff = end.diff(start, ["months", "weeks", "days"]);
  const { months, weeks, days } = diff.toObject();

  if (months && months >= 1) {
    return `${Math.round(months)} month${Math.round(months) > 1 ? "s" : ""}`;
  } else if (weeks && weeks >= 1) {
    return `${Math.round(weeks)} week${Math.round(weeks) > 1 ? "s" : ""}`;
  } else if (days && days >= 1) {
    return `${Math.round(days)} day${Math.round(days) > 1 ? "s" : ""}`;
  }

  return "Less than a day";
}

// Example usage:
// const timeFrame = formatTimeFrame('2023-05-01', '2024-05-01'); // '12 months'

// Group the data by week
export const groupByWeek = (data: { time: string; value: number }[]) => {
  return data.reduce((acc: { [key: string]: number }, entry) => {
    const week = DateTime.fromISO(entry.time).startOf("week").toISODate();
    if (week) {
      if (!acc[week]) {
        acc[week] = 0;
      }
      acc[week] += entry.value;
    }
    return acc;
  }, {});
};

// Calculate the percentage change between two numbers
export const calculatePercentageChange = (
  current: number,
  previous: number
): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

export const getLatestPurchasePrice = (
  sortedChartData: priceDataType[]
): number | null => {
  if (sortedChartData.length === 0) {
    return null;
  }
  return sortedChartData[sortedChartData.length - 1].value;
};

export const transformVenuesToCommands = (venues: VenueType[]) => {
  return venues.map((venue) => ({
    value: venue.name,
    label: venue.name,
  }));
};
