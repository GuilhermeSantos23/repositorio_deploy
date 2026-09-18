// Prefixos de tratamento que não devem ser considerados "primeiro nome"
// quando o sistema precisa extrair só o primeiro nome (ex.: saudação da
// Home). Mantido em minúsculas para comparação case-insensitive.
const TITLE_PREFIXES = ['dr.', 'dr', 'dra.', 'dra', 'enf(a)', 'enf', 'sr.', 'sr', 'sra.', 'sra'];

/**
 * Extrai o primeiro nome de um nome completo, ignorando prefixos de
 * tratamento (Dr., Dra., etc.) quando existirem.
 * Ex.: "Helena Ramos" -> "Helena"; "Dra. Helena Ramos" -> "Helena".
 */
export function getFirstName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return '';
  }

  const [firstPart, secondPart] = parts;
  const firstPartIsTitle = TITLE_PREFIXES.includes(firstPart.toLowerCase());

  if (firstPartIsTitle && secondPart) {
    return secondPart;
  }

  return firstPart;
}
