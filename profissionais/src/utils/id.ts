/** Gera um identificador único para registros salvos localmente (mock). */
export function createId(prefix: string): string {
  const unique =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return `${prefix}-${unique}`;
}
