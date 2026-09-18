// Calcula um valor numérico (epoch em ms) a partir do texto já existente
// em HistoryEntry.timestamp, para permitir ordenar o Histórico do mais
// recente para o mais antigo sem alterar os mocks e sem escrever uma
// ordem manual no componente.
//
// Os mocks usam dois formatos de timestamp:
// - "Hoje, HH:MM" / "Ontem, HH:MM" (MOCK_HISTORY);
// - "DD/MM/YYYY" (gerado a partir de application.applicationDate).
function parseTimeOfDay(time: string | undefined): { hours: number; minutes: number } {
  if (!time) return { hours: 0, minutes: 0 };

  const [hoursText, minutesText] = time.split(':');
  const hours = Number(hoursText);
  const minutes = Number(minutesText);

  return {
    hours: Number.isNaN(hours) ? 0 : hours,
    minutes: Number.isNaN(minutes) ? 0 : minutes,
  };
}

function parseRelativeTimestamp(timestamp: string): number | null {
  const [dayPartRaw, timePartRaw] = timestamp.split(',').map((part) => part.trim());
  const dayPart = dayPartRaw.toLowerCase();

  if (dayPart !== 'hoje' && dayPart !== 'ontem') {
    return null;
  }

  const { hours, minutes } = parseTimeOfDay(timePartRaw);

  const date = new Date();
  if (dayPart === 'ontem') {
    date.setDate(date.getDate() - 1);
  }
  date.setHours(hours, minutes, 0, 0);

  return date.getTime();
}

function parseBrazilianDate(timestamp: string): number | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(timestamp);
  if (!match) return null;

  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.getTime();
}

/**
 * Retorna a data/hora (em ms) representada por um timestamp de Histórico,
 * cobrindo os formatos "Hoje, HH:MM", "Ontem, HH:MM" e "DD/MM/YYYY".
 * Caso o formato não seja reconhecido, retorna 0 (mais antigo possível),
 * para nunca quebrar a ordenação.
 */
export function getHistoryEntryTime(timestamp: string): number {
  return parseRelativeTimestamp(timestamp) ?? parseBrazilianDate(timestamp) ?? 0;
}
