export type RecorteId =
  | 'crianca'
  | 'adolescente'
  | 'jovem'
  | 'adulto'
  | 'idoso'
  | 'anual';

export type NetworkType = 'publica' | 'privada';

export interface DoseOption {
  id: string;
  label: string;
}

export interface VaccineOption {
  id: string;
  name: string;
  network: NetworkType;
  doses: DoseOption[];
  note?: string;
}

export interface Momento {
  id: string;
  label: string;
  vaccines: VaccineOption[];
}

export interface Recorte {
  id: RecorteId;
  label: string;
  moments: Momento[];
}

export type SensitiveCondition =
  | 'Quimioterapia'
  | 'Gravidez'
  | 'Imunossupressão'
  | 'Transplante'
  | 'Alergia Grave'
  | 'HIV/AIDS'
  | 'Diabetes Mellitus'
  | 'Cardiopatia Crônica'
  | 'Pneumopatia Crônica'
  | 'Doença Renal Crônica'
  | 'Doença Hepática Crônica';

export const SENSITIVE_CONDITIONS: SensitiveCondition[] = [
  'Quimioterapia',
  'Gravidez',
  'Imunossupressão',
  'Transplante',
  'Alergia Grave',
  'HIV/AIDS',
  'Diabetes Mellitus',
  'Cardiopatia Crônica',
  'Pneumopatia Crônica',
  'Doença Renal Crônica',
  'Doença Hepática Crônica',
];
