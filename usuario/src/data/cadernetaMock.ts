import type { CadernetaCitizen, VaccinationRecord } from '../types/caderneta';

// =====================================================================
// DADOS SIMULADOS (MOCK) — Caderneta do cidadão
// Reproduzem o que o profissional de saúde registra na caderneta. Quando
// o backend existir, troque estes dados pela resposta da API (mantendo os
// mesmos campos); as telas e o documento da caderneta continuam iguais.
// =====================================================================

export interface CitizenProfile extends CadernetaCitizen {
  age: string;
  priorityGroup: string;
}

export const CITIZEN: CitizenProfile = {
  name: 'Carla Ribeiro',
  cpf: '123.456.789-00',
  susCard: '700 9674 9916 0003',
  birthDate: '14/04/1992',
  age: '34 anos',
  priorityGroup: 'Adulto',
};

export const VACCINATION_RECORDS: VaccinationRecord[] = [
  {
    id: 'rec-bcg',
    vacinaNome: 'BCG',
    doseLabel: 'Dose única',
    momentoLabel: 'Ao nascer',
    status: 'aplicada',
    data: '1992-04-19',
    lote: 'BC39292',
    unidade: 'Maternidade Municipal',
    profissional: 'Ana Costa',
  },
  {
    id: 'rec-hepb-1',
    vacinaNome: 'Hepatite B',
    doseLabel: '1ª dose',
    momentoLabel: 'Ao nascer',
    status: 'aplicada',
    data: '1992-04-19',
    lote: 'HEP3310',
    unidade: 'Maternidade Municipal',
    profissional: 'Ana Costa',
  },
  {
    id: 'rec-penta-1',
    vacinaNome: 'Penta (DTP + Hib + HB)',
    doseLabel: '1ª dose',
    momentoLabel: '2 meses',
    status: 'aplicada',
    data: '1992-06-14',
    lote: 'PEN2205',
    unidade: 'UBS Vila Nova',
    profissional: 'Tec. Pedro Lima',
  },
  {
    id: 'rec-vip-1',
    vacinaNome: 'Poliomielite inativada (VIP)',
    doseLabel: '1ª dose',
    momentoLabel: '2 meses',
    status: 'aplicada',
    data: '1992-06-14',
    lote: 'VIP1187',
    unidade: 'UBS Vila Nova',
    profissional: 'Tec. Pedro Lima',
  },
  {
    id: 'rec-hepb-3',
    vacinaNome: 'Hepatite B',
    doseLabel: '3ª dose',
    momentoLabel: 'Conforme histórico vacinal',
    status: 'aplicada',
    data: '1992-10-14',
    lote: 'HEP4421',
    unidade: 'UBS Vila Nova',
    profissional: 'Tec. Pedro Lima',
  },
  {
    id: 'rec-influenza-2026',
    vacinaNome: 'Influenza trivalente',
    doseLabel: 'Dose anual',
    momentoLabel: 'Campanha anual',
    status: 'aplicada',
    data: '2026-05-11',
    lote: 'INF-26B12',
    unidade: 'UBS Vila Nova',
    profissional: 'Ana Costa',
  },
];
