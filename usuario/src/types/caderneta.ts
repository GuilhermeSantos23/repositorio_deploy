/** Identificação do cidadão exibida na caderneta. */
export interface CadernetaCitizen {
  name: string;
  cpf: string;
  /** Data de nascimento no formato DD/MM/AAAA. */
  birthDate: string;
  susCard?: string;
  motherName?: string;
  fatherName?: string;
  sensitiveCondition?: string;
}

/**
 * Registro da caderneta gerado pelo profissional de saúde.
 * Somente registros com status "aplicada" são vacinas aplicadas.
 */
export interface VaccinationRecord {
  id: string;
  vacinaNome: string;
  doseLabel: string;
  momentoLabel: string;
  status: 'aplicada' | 'nao-realizada';
  /** Data da aplicação (AAAA-MM-DD). */
  data?: string;
  lote?: string;
  unidade?: string;
  profissional?: string;
  cofen?: string;
  condicaoSensivel?: string;
}
