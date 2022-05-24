/**
 * Turn a Date object into a string value used by 'datetime-local' input elements.
 */
export function toDatetimeLocalValue(datetime: Date): string {
  datetime.setMinutes(datetime.getMinutes() - datetime.getTimezoneOffset());
  return datetime.toISOString().slice(0, 16);
}

export function fromDatetimeLocalValue(value: string): Date {
  let datetime = new Date(value);
  datetime.setMinutes(datetime.getMinutes() + datetime.getTimezoneOffset());
  return datetime;
}

export function getDateStart(datetime: Date): Date {
  datetime.setHours(0, 0, 0, 0);
  return datetime;
}

export function getDateEnd(datetime: Date): Date {
  datetime.setHours(23, 59, 59, 999);
  return datetime;
}