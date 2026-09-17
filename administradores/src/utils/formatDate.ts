export function formatFullDate(date: Date): string {
  
  const formatted = date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
