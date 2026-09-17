import type { VaccinationRecord } from '../types/vaccinationRecord';

const UNIT = 'UBS Pimentas';

export const MOCK_CADERNETA_RECORDS: VaccinationRecord[] = [
  {
    id: 'booklet-maria-influenza', patientCpf: '104.825.736-42', recorteId: 'anual', momentoId: 'campanha-anual', momentoLabel: 'Campanha anual', vacinaId: 'influenza', vacinaNome: 'Influenza trivalente', doseId: 'anual', doseLabel: 'Dose anual', status: 'aplicada', data: '2026-09-06', lote: 'INF-26A41', unidade: UNIT, profissional: 'Ana Paula Santos', crm: '123456',
  },
  {
    id: 'booklet-maria-hepb', patientCpf: '104.825.736-42', recorteId: 'crianca', momentoId: 'ao-nascer', momentoLabel: 'Ao nascer', vacinaId: 'hepatite-b', vacinaNome: 'Hepatite B', doseId: 'dose-1', doseLabel: '1ª dose', status: 'aplicada', data: '1988-03-15', lote: 'HB-8801', unidade: UNIT, profissional: 'Ana Paula Santos', crm: '123456',
  },
  {
    id: 'booklet-maria-bcg', patientCpf: '104.825.736-42', recorteId: 'crianca', momentoId: 'ao-nascer', momentoLabel: 'Ao nascer', vacinaId: 'bcg', vacinaNome: 'BCG', doseId: 'unica', doseLabel: 'Dose única', status: 'nao-realizada', justificativa: 'Registro histórico não localizado.',
  },
  {
    id: 'booklet-maria-hpv', patientCpf: '104.825.736-42', recorteId: 'adolescente', momentoId: 'conforme-historico', momentoLabel: 'Conforme histórico vacinal', vacinaId: 'hpv4', vacinaNome: 'HPV4', doseId: 'unica', doseLabel: '1 dose', status: 'aplicada', data: '2000-06-12', lote: 'HPV-0001', unidade: UNIT, profissional: 'Dra. Helena Ramos', crm: '54321',
  },
  {
    id: 'booklet-joana-hpv', patientCpf: '529.307.184-16', recorteId: 'adolescente', momentoId: 'conforme-historico', momentoLabel: 'Conforme histórico vacinal', vacinaId: 'hpv4', vacinaNome: 'HPV4', doseId: 'unica', doseLabel: '1 dose', status: 'aplicada', data: '2026-09-05', lote: 'HPV-9921', unidade: UNIT, profissional: 'Dra. Helena Ramos', crm: '54321',
  },
  {
    id: 'booklet-joana-hepb-1', patientCpf: '529.307.184-16', recorteId: 'adulto', momentoId: 'conforme-historico', momentoLabel: 'Conforme histórico vacinal', vacinaId: 'hepatite-b', vacinaNome: 'Hepatite B', doseId: 'dose-1', doseLabel: '1ª dose', status: 'aplicada', data: '2010-01-10', lote: 'HB-1001', unidade: UNIT, profissional: 'Mariana Costa', crm: '24680',
  },
  {
    id: 'booklet-joana-hepb-2', patientCpf: '529.307.184-16', recorteId: 'adulto', momentoId: 'conforme-historico', momentoLabel: 'Conforme histórico vacinal', vacinaId: 'hepatite-b', vacinaNome: 'Hepatite B', doseId: 'dose-2', doseLabel: '2ª dose', status: 'nao-realizada', justificativa: 'Não há registro de aplicação para esta dose.'
  },
  {
    id: 'booklet-lucas-hpv', patientCpf: '638.217.490-05', recorteId: 'crianca', momentoId: '9-anos', momentoLabel: '9 anos', vacinaId: 'hpv4', vacinaNome: 'HPV4', doseId: 'unica', doseLabel: '1 dose', status: 'aplicada', data: '2022-06-20', lote: 'HPV-2210', unidade: UNIT, profissional: 'Dr. Carlos Souza', crm: '67890', condicaoSensivel: 'Imunossupressão',
  },
  {
    id: 'booklet-helena-flu', patientCpf: '291.847.560-32', recorteId: 'idoso', momentoId: 'conforme-historico', momentoLabel: 'Conforme histórico vacinal', vacinaId: 'influenza', vacinaNome: 'Influenza trivalente', doseId: 'anual', doseLabel: '1 dose anual por temporada', status: 'aplicada', data: '2026-05-11', lote: 'INF-26B12', unidade: UNIT, profissional: 'Ana Paula Santos', crm: '123456',
  },
];

export function getMockCadernetaRecords(cpf: string): VaccinationRecord[] {
  return MOCK_CADERNETA_RECORDS.filter((record) => record.patientCpf === cpf);
}
