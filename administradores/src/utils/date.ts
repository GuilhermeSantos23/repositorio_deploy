// Helpers de data usados pela tela de Campanhas e Alertas.
// Datas são guardadas internamente no formato ISO (yyyy-mm-dd), que é o
// formato nativo de <input type="date">, e formatadas em pt-BR (dd/mm/aaaa)
// apenas na hora de exibir.

/** Retorna a data atual da máquina no formato ISO (yyyy-mm-dd). */
export function getTodayISO(): string {
  const today = new Date();
  return toISODate(today);
}

/** Converte um objeto Date para o formato ISO (yyyy-mm-dd), no fuso local. */
export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Formata uma data ISO (yyyy-mm-dd) para o padrão pt-BR (dd/mm/aaaa). */
export function formatDateBR(isoDate: string): string {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
}

/** Compara duas datas ISO (yyyy-mm-dd). Retorna negativo/0/positivo, como localeCompare. */
export function compareISODates(a: string, b: string): number {
  return a.localeCompare(b);
}
