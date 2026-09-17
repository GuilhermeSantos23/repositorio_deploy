import type { VaccineLot } from '../types/lot';
import { CURRENT_UNIT_ADMIN } from './session';

// Os 10 lotes abaixo são os MESMOS registros de
// `profissionais/src/data/mockLots.ts` (mesmos id, code, vaccineId,
// vaccineName, manufacturer e quantity — nada disso foi alterado). Os
// campos novos (receivedAt, expiresAt, receivedBy, attachmentName) foram
// adicionados só para a tela de Estoque do Administrador poder exibir e
// testar recebimento, validade e o receptor automático.
//
// Datas escolhidas para cobrir os cenários pedidos no escopo:
// - receivedAt sempre <= hoje (15/09/2026), com variedade de datas;
// - INF-26A41, HPV-9921 e PEN-26038 vencem nos próximos ~30 dias
//   ("perto do vencimento");
// - FA-26031 já está com a validade vencida, para testar a lógica futura
//   de lote vencido (ver item 21 do escopo);
// - quantidades preservadas como já estavam, o que já cobre os 3 níveis de
//   estoque (crítico < 50, atenção 50–64, OK >= 65).
export const MOCK_LOTS: VaccineLot[] = [
  {
    id: 'lot-influenza-01',
    code: 'INF-26A41',
    vaccineId: 'influenza',
    vaccineName: 'Influenza trivalente',
    manufacturer: 'Instituto Butantan',
    quantity: 20,
    receivedAt: '2026-03-10',
    expiresAt: '2026-10-05',
    receivedBy: CURRENT_UNIT_ADMIN.name,
    attachmentName: 'romaneio-inf-26a41.pdf',
  },
  {
    id: 'lot-influenza-02',
    code: 'INF-26B72',
    vaccineId: 'influenza',
    vaccineName: 'Influenza trivalente',
    manufacturer: 'Instituto Butantan',
    quantity: 18,
    receivedAt: '2026-04-02',
    expiresAt: '2027-04-02',
    receivedBy: CURRENT_UNIT_ADMIN.name,
  },
  {
    id: 'lot-hpv-01',
    code: 'HPV-9921',
    vaccineId: 'hpv4',
    vaccineName: 'HPV4',
    manufacturer: 'Fundação Oswaldo Cruz',
    quantity: 24,
    receivedAt: '2026-01-15',
    expiresAt: '2026-09-29',
    receivedBy: CURRENT_UNIT_ADMIN.name,
  },
  {
    id: 'lot-hpv-02',
    code: 'HPV-9937',
    vaccineId: 'hpv4',
    vaccineName: 'HPV4',
    manufacturer: 'Fundação Oswaldo Cruz',
    quantity: 19,
    receivedAt: '2026-02-20',
    expiresAt: '2027-02-20',
    receivedBy: CURRENT_UNIT_ADMIN.name,
  },
  {
    id: 'lot-febre-amarela-01',
    code: 'FA-26031',
    vaccineId: 'febre-amarela',
    vaccineName: 'Febre Amarela',
    manufacturer: 'Bio-Manguinhos',
    quantity: 17,
    receivedAt: '2025-11-05',
    expiresAt: '2026-08-20',
    receivedBy: CURRENT_UNIT_ADMIN.name,
  },
  {
    id: 'lot-febre-amarela-02',
    code: 'FA-26044',
    vaccineId: 'febre-amarela',
    vaccineName: 'Febre Amarela',
    manufacturer: 'Bio-Manguinhos',
    quantity: 21,
    receivedAt: '2026-05-18',
    expiresAt: '2027-05-18',
    receivedBy: CURRENT_UNIT_ADMIN.name,
  },
  {
    id: 'lot-bcg-01',
    code: 'BCG-26011',
    vaccineId: 'bcg',
    vaccineName: 'BCG',
    manufacturer: 'Fundação Ataulpho de Paiva',
    quantity: 65,
    receivedAt: '2026-06-01',
    expiresAt: '2028-06-01',
    receivedBy: CURRENT_UNIT_ADMIN.name,
    attachmentName: 'recibo-bcg-26011.pdf',
  },
  {
    id: 'lot-bcg-02',
    code: 'BCG-26019',
    vaccineId: 'bcg',
    vaccineName: 'BCG',
    manufacturer: 'Fundação Ataulpho de Paiva',
    quantity: 55,
    receivedAt: '2026-07-10',
    expiresAt: '2027-07-10',
    receivedBy: CURRENT_UNIT_ADMIN.name,
  },
  {
    id: 'lot-penta-01',
    code: 'PEN-26021',
    vaccineId: 'penta',
    vaccineName: 'Penta (DTP + Hib + HB)',
    manufacturer: 'Instituto Butantan',
    quantity: 70,
    receivedAt: '2026-08-01',
    expiresAt: '2028-08-01',
    receivedBy: CURRENT_UNIT_ADMIN.name,
  },
  {
    id: 'lot-penta-02',
    code: 'PEN-26038',
    vaccineId: 'penta',
    vaccineName: 'Penta (DTP + Hib + HB)',
    manufacturer: 'Instituto Butantan',
    quantity: 45,
    receivedAt: '2026-08-25',
    expiresAt: '2026-10-10',
    receivedBy: CURRENT_UNIT_ADMIN.name,
  },
];
