// O projeto ainda não tem uma tela/serviço próprio de cadastro de vacinas.
// Para não criar uma lista solta e desconectada do resto do projeto, o
// campo "Nome da vacina" (e "Fabricante") do formulário de Estoque reusa os
// nomes que já aparecem nos lotes mockados (mocks/lots.ts).
import { MOCK_LOTS } from '../mocks/lots';

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

export const VACCINE_NAME_OPTIONS: string[] = uniqueSorted(
  MOCK_LOTS.map((lot) => lot.vaccineName),
);

export const MANUFACTURER_OPTIONS: string[] = uniqueSorted(
  MOCK_LOTS.map((lot) => lot.manufacturer),
);
