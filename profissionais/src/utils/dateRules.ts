export const MIN_APPLICATION_DATE = '1900-01-01';

function parseDateOnly(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Aplicações só podem ser registradas entre 01/01/1900 e hoje. */
export function isValidApplicationDate(value: string): boolean {
  const date = parseDateOnly(value);
  if (!date) return false;

  const today = parseDateOnly(getTodayDateString())!;
  const minimum = parseDateOnly(MIN_APPLICATION_DATE)!;

  return date >= minimum && date <= today;
}

export function getApplicationDateLimits() {
  return {
    min: MIN_APPLICATION_DATE,
    max: getTodayDateString(),
  };
}
