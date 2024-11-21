import { format, isSameDay, parse } from "date-fns";

const dateFormat = "MM-dd-yyyy";

export function parseDate(s: string): Date {
  if (s === "today") {
    return new Date();
  }

  return parse(s, dateFormat, new Date());
}

export function formatDate(d: Date): string {
  if (isSameDay(parseDate("today"), d)) {
    return "today";
  }

  return format(d, dateFormat);
}
