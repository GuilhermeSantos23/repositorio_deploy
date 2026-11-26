/**
 * Nome e sobrenome do administrador de unidade.
 *
 * Registros antigos guardam só `name` (nome completo). Os novos também
 * guardam `firstName` e `lastName`, e continuam preenchendo `name` para
 * listagens e buscas que já usam o nome completo.
 */

export function splitPersonName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return { firstName: '', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };

  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

export function joinPersonName(firstName: string, lastName: string): string {
  return `${firstName.trim()} ${lastName.trim()}`.trim();
}

interface NamedPerson {
  name?: string;
  firstName?: string;
  lastName?: string;
}

export function readPersonNames(person: NamedPerson): { firstName: string; lastName: string } {
  if (person.firstName?.trim() || person.lastName?.trim()) {
    return {
      firstName: person.firstName?.trim() ?? '',
      lastName: person.lastName?.trim() ?? '',
    };
  }

  return splitPersonName(person.name ?? '');
}
