/**
 * Tipos do módulo de Estoque (lotes de vacina) do Administrador.
 *
 * Baseado no mock que já existia no projeto (mesma forma de
 * `profissionais/src/types/lot.ts` / `profissionais/src/data/mockLots.ts`),
 * estendido com os dados que a tela de Estoque do Administrador precisa:
 * recebimento, validade, receptor e anexo do romaneio/recibo.
 *
 * `profissionais` e `administradores` são aplicações Vite separadas (sem
 * workspace/alias compartilhado entre elas), então o tipo é replicado aqui
 * em vez de importado — os campos originais (id, code, vaccineId,
 * vaccineName, manufacturer, quantity) foram mantidos exatamente iguais.
 */
export interface VaccineLot {
  id: string;
  /** Código/identificação do lote (ex.: INF-26A41). */
  code: string;
  vaccineId: string;
  vaccineName: string;
  manufacturer: string;
  quantity: number;
  /** Data de recebimento do lote, em ISO (yyyy-mm-dd). Nunca é futura. */
  receivedAt: string;
  /** Data de vencimento do lote, em ISO (yyyy-mm-dd). Sempre posterior a receivedAt. */
  expiresAt: string;
  /** Nome de quem recebeu o lote — vem do admin logado (mocks/session.ts). */
  receivedBy: string;
  /** Nome do arquivo de romaneio/recibo anexado, se houver. */
  attachmentName?: string;
  /** Quando true, o lote foi excluído (mantido só para preservar o histórico). */
  deleted?: boolean;
  /** Justificativa informada na exclusão do lote. */
  deletionReason?: string;
}

/** Dados preenchidos no formulário de cadastro/alteração de um lote. */
export interface LotFormData {
  vaccineName: string;
  manufacturer: string;
  code: string;
  quantity: string;
  receivedAt: string;
  expiresAt: string;
  attachmentName?: string;
}
