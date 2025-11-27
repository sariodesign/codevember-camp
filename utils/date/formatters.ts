/**
 * Converts an ISO 8601 datetime string to the format expected by
 * HTML datetime-local input (YYYY-MM-DDTHH:MM).
 *
 * Uses the browser's local timezone (not UTC).
 *
 * @example
 * toLocalInputDateTime("2025-11-26T14:30:00.000Z") // "2025-11-26T14:30" (in local TZ)
 * toLocalInputDateTime("2025-11-26") // "2025-11-26T00:00"
 * toLocalInputDateTime("") // ""
 */
export function toLocalInputDateTime(isoString: string): string {
  if (!isoString) return "";

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return ""; // invalid date

  // Format as YYYY-MM-DDTHH:MM in local timezone
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
