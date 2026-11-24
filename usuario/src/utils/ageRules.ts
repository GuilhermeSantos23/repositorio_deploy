/** Idade em anos completos a partir de uma data DD/MM/AAAA. */
export function calculateAge(birthDate: string, referenceDate = new Date()): number {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(birthDate);
  if (!match) return 0;

  const [, day, month, year] = match.map(Number);
  let age = referenceDate.getFullYear() - year;
  const beforeBirthday =
    referenceDate.getMonth() + 1 < month ||
    (referenceDate.getMonth() + 1 === month && referenceDate.getDate() < day);

  if (beforeBirthday) age -= 1;
  return Math.max(age, 0);
}
