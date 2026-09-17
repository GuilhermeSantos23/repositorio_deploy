import type { CampaignStatus, CampaignRecord } from '../types/campaign';
import { getTodayISO } from './date';

/**
 * Calcula o status de uma campanha a partir das suas datas — não existe
 * cadastro manual de status.
 *
 * - "agendada"  -> a publicação ainda está no futuro
 * - "encerrada" -> a data de encerramento já passou
 * - "ativa"     -> os demais casos (já publicada e ainda dentro do prazo)
 *
 * IMPORTANTE: quando a API existir, o status pode passar a vir pronto do
 * back-end, mas a lógica de cálculo deve continuar sendo esta.
 */
export function calculateCampaignStatus(
  campaign: Pick<CampaignRecord, 'publishedAt' | 'endDate'>,
  referenceDateISO: string = getTodayISO(),
): CampaignStatus {
  if (campaign.publishedAt > referenceDateISO) {
    return 'agendada';
  }

  if (campaign.endDate < referenceDateISO) {
    return 'encerrada';
  }

  return 'ativa';
}
