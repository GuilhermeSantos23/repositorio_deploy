import type { VacinaPrevista } from '../types/vaccine';

// =====================================================================
// DADOS SIMULADOS (MOCK) — Histórico Vacinal
// O projeto ainda não tem a data de nascimento do cidadão nem os
// registros das vacinas que ele já tomou, então não é possível calcular
// o que está pendente ou em atraso de verdade. Esta lista é apenas um
// exemplo, e as datas são calculadas a partir de HOJE para que a tela
// sempre mostre valores coerentes. Quando houver dados reais (backend),
// troque esta lista por eles; a tela e as regras em
// utils/prazosVacinais.ts continuam iguais.
// =====================================================================

// Soma (ou subtrai, se negativo) meses a uma data.
function emMeses(hoje: Date, meses: number): Date {
  return new Date(hoje.getFullYear(), hoje.getMonth() + meses, hoje.getDate());
}

export function criarVacinasPrevistasMock(hoje: Date = new Date()): VacinaPrevista[] {
  return [
    // Próximas: a faixa de aplicação ainda não começou.
    { id: 'influenza-2027', nome: 'Influenza 2027', dataPrevista: emMeses(hoje, 5), dataLimite: emMeses(hoje, 8) },
    { id: 'covid-reforco', nome: 'COVID-19 (reforço)', dataPrevista: emMeses(hoje, 3), dataLimite: emMeses(hoje, 9) },
    { id: 'hpv', nome: 'HPV (reforço)', dataPrevista: emMeses(hoje, 8), dataLimite: emMeses(hoje, 20) },
    { id: 'dt-reforco', nome: 'dT (reforço a cada 10 anos)', dataPrevista: emMeses(hoje, 14), dataLimite: emMeses(hoje, 26) },

    // Pendentes: estamos dentro da faixa e a vacina ainda não foi tomada.
    { id: 'meningo-acwy', nome: 'Meningocócica ACWY', dataPrevista: emMeses(hoje, -4), dataLimite: emMeses(hoje, 2) },
    { id: 'febre-amarela-reforco', nome: 'Febre Amarela (reforço)', dataPrevista: emMeses(hoje, -2), dataLimite: emMeses(hoje, 5) },
    { id: 'hepatite-a', nome: 'Hepatite A', dataPrevista: emMeses(hoje, -1), dataLimite: emMeses(hoje, 12) },
    { id: 'varicela-2', nome: 'Varicela (2ª dose)', dataPrevista: emMeses(hoje, 0), dataLimite: emMeses(hoje, 7) },

    // Em atraso: a faixa terminou, mas ainda pode ser tomada.
    { id: 'triplice-viral-2', nome: 'Tríplice Viral (2ª dose)', dataPrevista: emMeses(hoje, -40), dataLimite: emMeses(hoje, -26) },
    { id: 'hepatite-b-3', nome: 'Hepatite B (3ª dose)', dataPrevista: emMeses(hoje, -26), dataLimite: emMeses(hoje, -14) },
    { id: 'febre-amarela', nome: 'Febre Amarela', dataPrevista: emMeses(hoje, -14), dataLimite: emMeses(hoje, -5) },
    { id: 'dtp-reforco', nome: 'DTP (reforço)', dataPrevista: emMeses(hoje, -8), dataLimite: emMeses(hoje, -2) },
    { id: 'hpv-1', nome: 'HPV (1ª dose)', dataPrevista: emMeses(hoje, -6), dataLimite: emMeses(hoje, -1) },
  ];
}
