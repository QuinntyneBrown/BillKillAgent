const MINUTE = 60;
const HOUR = 3600;
const DAY = 86400;
const WEEK = 604800;
const MONTH = 2592000;
const YEAR = 31536000;

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const target = typeof date === "string" ? new Date(date) : date;
  const diffMs = now.getTime() - target.getTime();
  const diffSec = Math.floor(Math.abs(diffMs) / 1000);
  const isFuture = diffMs < 0;

  let value: number;
  let unit: string;

  if (diffSec < MINUTE) {
    return "just now";
  } else if (diffSec < HOUR) {
    value = Math.floor(diffSec / MINUTE);
    unit = "minute";
  } else if (diffSec < DAY) {
    value = Math.floor(diffSec / HOUR);
    unit = "hour";
  } else if (diffSec < WEEK) {
    value = Math.floor(diffSec / DAY);
    unit = "day";
  } else if (diffSec < MONTH) {
    value = Math.floor(diffSec / WEEK);
    unit = "week";
  } else if (diffSec < YEAR) {
    value = Math.floor(diffSec / MONTH);
    unit = "month";
  } else {
    value = Math.floor(diffSec / YEAR);
    unit = "year";
  }

  const plural = value !== 1 ? "s" : "";
  return isFuture ? `in ${value} ${unit}${plural}` : `${value} ${unit}${plural} ago`;
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const target = typeof date === "string" ? new Date(date) : date;
  return target.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  });
}
