/**
 * Formata uma data no padrão usado no Header, ex: "Terça-feira, 19 de maio de 2026".
 * A primeira letra é maiúscula porque toLocaleDateString retorna tudo em minúsculo.
 */
export function formatFullDate(date: Date): string {
  const formatted = date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

/** Converte "AAAA-MM-DD" em "DD/MM/AAAA". Sem valor, devolve o texto de fallback. */
export function formatIsoDate(value: string | undefined, fallback = 'Não informado'): string {
  const match = value ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(value) : null;
  if (!match) return fallback;

  const [, year, month, day] = match;
  return `${day}/${month}/${year}`;
}

/** Converte "DD/MM/AAAA" em "AAAA-MM-DD" (formato do input type="date"). */
export function brazilianDateToIso(value: string): string {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return value;

  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}

/** Aceita as duas formas usadas no projeto e devolve sempre "DD/MM/AAAA". */
export function formatAnyDate(value: string | undefined, fallback = 'Não informado'): string {
  if (value && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) return value;
  return formatIsoDate(value, fallback);
}
