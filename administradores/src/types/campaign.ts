// Tipos relacionados à tela "Campanhas e Alertas".
// Mantidos simples de propósito: a ideia é que, quando a API existir,
// esses mesmos tipos sirvam de contrato entre back-end e front-end.

/** Estado visual de uma campanha, calculado a partir das datas. */
export type CampaignStatus = 'ativa' | 'agendada' | 'encerrada';

/**
 * Campanha já "pronta para exibição": inclui o status calculado.
 * É o formato que a página e os componentes de listagem consomem.
 */
export interface Campaign {
  id: number;
  title: string;
  description: string;
  /**
   * Data em que a campanha fica visível para os usuários, no formato ISO
   * (yyyy-mm-dd). Definida no formulário: hoje = publicação imediata,
   * data futura = campanha "agendada" até lá.
   */
  publishedAt: string;
  /** Data de encerramento no formato ISO (yyyy-mm-dd). */
  endDate: string;
  status: CampaignStatus;
}

/**
 * Dados brutos de uma campanha, como ficam armazenados no mock/"banco".
 * Não inclui `status` porque ele é sempre calculado (ver `campaignStatus.ts`)
 * a partir de `publishedAt`/`endDate`, sem cadastro manual.
 */
export type CampaignRecord = Omit<Campaign, 'status'>;

/** Dados enviados pelo formulário de criação/edição de campanha. */
export interface CampaignFormData {
  title: string;
  description: string;
  publishedAt: string;
  endDate: string;
}
