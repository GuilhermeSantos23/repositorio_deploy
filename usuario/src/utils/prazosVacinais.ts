import type { VacinaPrevista } from '../types/vaccine';

export interface VacinasClassificadas {
  // Faixa de aplicação ainda não começou. Mais perto primeiro.
  proximas: VacinaPrevista[];
  // Dentro da faixa e ainda não tomada. Prazo mais curto primeiro.
  pendentes: VacinaPrevista[];
  // Passou da faixa, mas ainda pode ser tomada. Maior atraso primeiro.
  atrasadas: VacinaPrevista[];
}

// Separa as vacinas em próximas, pendentes e em atraso, comparando as
// datas com "hoje", e já devolve cada grupo na ordem de exibição.
export function classificarVacinas(
  vacinas: VacinaPrevista[],
  hoje: Date = new Date(),
): VacinasClassificadas {
  const porLimite = (a: VacinaPrevista, b: VacinaPrevista) =>
    a.dataLimite.getTime() - b.dataLimite.getTime();

  return {
    proximas: vacinas
      .filter((v) => hoje < v.dataPrevista)
      .sort((a, b) => a.dataPrevista.getTime() - b.dataPrevista.getTime()),
    pendentes: vacinas
      .filter((v) => hoje >= v.dataPrevista && hoje <= v.dataLimite)
      .sort(porLimite),
    // O limite mais antigo é o maior atraso.
    atrasadas: vacinas.filter((v) => hoje > v.dataLimite).sort(porLimite),
  };
}

// Texto do tempo de atraso. Exemplos: "Atrasada há 5 dias",
// "Atrasada há 2 meses", "Atrasada há 1 ano e 2 meses".
export function textoAtraso(dataLimite: Date, hoje: Date = new Date()): string {
  let meses =
    (hoje.getFullYear() - dataLimite.getFullYear()) * 12 +
    (hoje.getMonth() - dataLimite.getMonth());
  if (hoje.getDate() < dataLimite.getDate()) {
    meses -= 1;
  }

  if (meses < 1) {
    const dias = Math.max(
      1,
      Math.floor((hoje.getTime() - dataLimite.getTime()) / 86400000),
    );
    return `Atrasada há ${dias} ${dias === 1 ? 'dia' : 'dias'}`;
  }

  if (meses < 12) {
    return `Atrasada há ${meses} ${meses === 1 ? 'mês' : 'meses'}`;
  }

  const anos = Math.floor(meses / 12);
  const resto = meses % 12;
  const textoAnos = `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
  if (resto === 0) {
    return `Atrasada há ${textoAnos}`;
  }
  return `Atrasada há ${textoAnos} e ${resto} ${resto === 1 ? 'mês' : 'meses'}`;
}
