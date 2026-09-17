// Estrutura de dados do Calendário de Vacinação, na ordem:
// Recorte -> Momento -> Vacina -> Doses
// Essa é a mesma estrutura usada pelo restante do Vac+ e deve continuar
// sendo a fonte única de verdade do calendário.

export interface Dose {
  id: string;
  label: string;
}

export interface Vaccine {
  id: string;
  name: string;
  network: string;
  doses: Dose[];
  // Observação curta que aparece logo depois da dose, na mesma coluna.
  // Exemplo: "3 doses — conforme histórico vacinal".
  observation?: string;
  // Observação longa, mostrada em letra menor embaixo da dose.
  note?: string;
}

export interface Moment {
  id: string;
  label: string;
  vaccines: Vaccine[];
}

export interface Recorte {
  id: string;
  label: string;
  moments: Moment[];
}

// Uma vacina que exige atenção/contraindicação em algum grupo especial
// (gestante, imunossuprimido, em quimioterapia, transplantado).
export interface VacinaEspecial {
  id: string;
  name: string;
  reason: string;
}

// Um grupo especial completo: o aviso que aparece no topo da tabela e a
// lista de vacinas que exigem atenção nesse grupo.
export interface GrupoEspecial {
  id: string;
  label: string;
  warning: string;
  vaccines: VacinaEspecial[];
}

// Uma vacina recomendada para o viajante, com o motivo e a antecedência
// recomendada antes da viagem.
export interface VacinaViajante {
  id: string;
  name: string;
  reason: string;
  leadTime: string;
}

// Grupo do viajante: diferente dos grupos especiais, porque aqui a
// vacina é recomendada (visual verde), não contraindicada (visual
// vermelho).
export interface GrupoViajante {
  id: string;
  label: string;
  description: string;
  disclaimer: string;
  vaccines: VacinaViajante[];
  source: string;
}
