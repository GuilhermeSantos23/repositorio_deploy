import type { RecorteId } from '../types/vaccine';

function parseBirthDate(value: string): Date | null {
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const brazilMatch = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);

  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    const date = new Date(Number(year), Number(month) - 1, Number(day));

    return date.getFullYear() === Number(year) &&
      date.getMonth() === Number(month) - 1 &&
      date.getDate() === Number(day)
      ? date
      : null;
  }

  if (brazilMatch) {
    const [, day, month, year] = brazilMatch;
    const date = new Date(Number(year), Number(month) - 1, Number(day));

    return date.getFullYear() === Number(year) &&
      date.getMonth() === Number(month) - 1 &&
      date.getDate() === Number(day)
      ? date
      : null;
  }

  return null;
}

export function calculateAge(birthDate: string, referenceDate = new Date()): number {
  const birth = parseBirthDate(birthDate);
  if (!birth || birth > referenceDate) return 0;

  let age = referenceDate.getFullYear() - birth.getFullYear();
  const monthDifference = referenceDate.getMonth() - birth.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && referenceDate.getDate() < birth.getDate())
  ) {
    age -= 1;
  }

  return Math.max(age, 0);
}

/**
 * Recortes usados pelo Vac+ conforme as faixas etárias do Calendário
 * Nacional de Vacinação: criança, adolescente, jovem, adulto e idoso.
 * "anual" é um recorte organizacional separado e não depende da idade.
 */
export function getRecorteByAge(age: number): Exclude<RecorteId, 'anual'> {
  if (age < 10) return 'crianca';
  if (age < 20) return 'adolescente';
  if (age < 25) return 'jovem';
  if (age < 60) return 'adulto';
  return 'idoso';
}
