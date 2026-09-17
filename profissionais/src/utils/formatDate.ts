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
