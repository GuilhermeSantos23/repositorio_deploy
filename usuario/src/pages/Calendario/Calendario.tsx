import { useState } from 'react';
import { RECORTES } from '../../data/vaccines';
import { GRUPOS_ESPECIAIS, GRUPO_VIAJANTE } from '../../data/specialGroups';
import type { GrupoEspecial, Recorte, Vaccine } from '../../types/vaccine';

// -------------------------------------------------------------------
// ATENÇÃO: esta tela é apenas INFORMATIVA.
// Ela não calcula a idade do usuário logado, não escolhe aba pela
// idade, não verifica atraso de vacina e não compara o calendário com
// o histórico vacinal de ninguém. Ela só apresenta o Calendário
// Nacional de Vacinação de forma organizada, na estrutura:
// Grupo -> Idade/Momento -> Vacina -> Dose -> Observação.
// -------------------------------------------------------------------

// Grupos por idade, exatamente na ordem pedida.
const IDS_GRUPOS_POR_IDADE = [
  'crianca',
  'adolescente',
  'jovem',
  'adulto',
  'idoso',
];

function buscarGruposPorIdade(): Recorte[] {
  const grupos: Recorte[] = [];

  for (const idAtual of IDS_GRUPOS_POR_IDADE) {
    for (const recorteAtual of RECORTES) {
      if (recorteAtual.id === idAtual) {
        grupos.push(recorteAtual);
      }
    }
  }

  return grupos;
}

const GRUPOS_POR_IDADE = buscarGruposPorIdade();

// Cada aba guarda o rótulo mostrado e o tipo de conteúdo que ela
// representa, para a tela saber quais colunas e quais linhas montar.
interface Aba {
  label: string;
  tipo: 'idade' | 'especial' | 'viajante';
}

// Ordem dos filtros: grupos por idade, depois os grupos especiais em
// ordem alfabética e, por último, Viajante.
function montarAbas(): Aba[] {
  const abas: Aba[] = [];

  for (const grupoAtual of GRUPOS_POR_IDADE) {
    abas.push({ label: grupoAtual.label, tipo: 'idade' });
  }

  for (const grupoAtual of GRUPOS_ESPECIAIS) {
    abas.push({ label: grupoAtual.label, tipo: 'especial' });
  }

  abas.push({ label: GRUPO_VIAJANTE.label, tipo: 'viajante' });

  return abas;
}

const ABAS = montarAbas();

// -------------------------------------------------------------------
// Tabela única: todos os grupos (Criança, Adolescente, Jovem, Adulto,
// Idoso, grupos especiais e Viajante) usam esta mesma tabela. O que
// muda é apenas o nome das colunas, as linhas e a cor do bloco do nome
// da vacina (verde para vacina recomendada, vermelho para vacina que
// exige atenção nos grupos especiais).
// -------------------------------------------------------------------

type DestaqueCelula = 'nenhum' | 'verde' | 'vermelho';

interface Celula {
  texto: string;
  destaque: DestaqueCelula;
  // Texto menor, mostrado embaixo do texto principal (usado para as
  // observações longas do calendário oficial).
  detalhe?: string;
}

interface Linha {
  id: string;
  celulas: Celula[];
}

// Devolve as classes de estilo do conteúdo de uma célula.
function montarClasseDaCelula(destaque: DestaqueCelula): string {
  switch (destaque) {
    case 'verde':
      return 'inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800';
    case 'vermelho':
      return 'inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800';
    default:
      return 'text-sm text-gray-700';
  }
}

interface TabelaCalendarioProps {
  colunas: string[];
  linhas: Linha[];
}

function TabelaCalendario({ colunas, linhas }: TabelaCalendarioProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white shadow-sm">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-gray-200">
            {colunas.map((nomeDaColuna) => (
              <th
                key={nomeDaColuna}
                className="px-5 py-3 text-xs font-bold tracking-wide text-gray-500 uppercase"
              >
                {nomeDaColuna}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {linhas.map((linhaAtual) => (
            <tr
              key={linhaAtual.id}
              className="border-b border-gray-100 last:border-b-0"
            >
              {linhaAtual.celulas.map((celulaAtual, indiceDaColuna) => (
                <td
                  key={colunas[indiceDaColuna]}
                  className="px-5 py-3 align-top"
                >
                  <span className={montarClasseDaCelula(celulaAtual.destaque)}>
                    {celulaAtual.texto}
                  </span>

                  {celulaAtual.detalhe && (
                    <span className="mt-1 block text-xs text-gray-500">
                      {celulaAtual.detalhe}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Aviso mostrado no topo dos grupos especiais. Sem emoji.
function AvisoAtencao({ texto }: { texto: string }) {
  return (
    <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <p className="font-bold">Atenção</p>
      <p className="mt-1">{texto}</p>
    </div>
  );
}

// -------------------------------------------------------------------
// Montagem das linhas de cada tipo de grupo.
// -------------------------------------------------------------------

// Junta as doses da vacina e, se existir, acrescenta a observação
// curta. Exemplo: "3 doses — conforme histórico vacinal".
// A observação nunca aparece sozinha: ela é sempre um complemento da
// dose, porque a vacina precisa estar sempre visível.
function montarTextoDaDose(vacina: Vaccine): string {
  let texto = '';

  for (const doseAtual of vacina.doses) {
    if (texto === '') {
      texto = doseAtual.label;
    } else {
      texto = texto + '; ' + doseAtual.label;
    }
  }

  if (vacina.observation) {
    texto = texto + ' — ' + vacina.observation;
  }

  return texto;
}

// Criança, Adolescente, Jovem, Adulto e Idoso:
// Idade/Momento | Vacina | Dose
function montarLinhasPorIdade(recorte: Recorte): Linha[] {
  const linhas: Linha[] = [];

  for (const momentoAtual of recorte.moments) {
    for (const vacinaAtual of momentoAtual.vaccines) {
      const linha: Linha = {
        id: momentoAtual.id + '-' + vacinaAtual.id,
        celulas: [
          { texto: momentoAtual.label, destaque: 'nenhum' },
          { texto: vacinaAtual.name, destaque: 'verde' },
          {
            texto: montarTextoDaDose(vacinaAtual),
            destaque: 'nenhum',
            detalhe: vacinaAtual.note,
          },
        ],
      };

      linhas.push(linha);
    }
  }

  return linhas;
}

// Em quimioterapia, Gestante, Imunossuprimido e Transplantado:
// Vacina | Motivo
function montarLinhasDeGrupoEspecial(grupo: GrupoEspecial): Linha[] {
  const linhas: Linha[] = [];

  for (const vacinaAtual of grupo.vaccines) {
    const linha: Linha = {
      id: vacinaAtual.id,
      celulas: [
        { texto: vacinaAtual.name, destaque: 'vermelho' },
        { texto: vacinaAtual.reason, destaque: 'nenhum' },
      ],
    };

    linhas.push(linha);
  }

  return linhas;
}

// Viajante: Vacina | Motivo | Antecedência
function montarLinhasDeViajante(): Linha[] {
  const linhas: Linha[] = [];

  for (const vacinaAtual of GRUPO_VIAJANTE.vaccines) {
    const linha: Linha = {
      id: vacinaAtual.id,
      celulas: [
        { texto: vacinaAtual.name, destaque: 'verde' },
        { texto: vacinaAtual.reason, destaque: 'nenhum' },
        { texto: vacinaAtual.leadTime, destaque: 'nenhum' },
      ],
    };

    linhas.push(linha);
  }

  return linhas;
}

// -------------------------------------------------------------------
// Página
// -------------------------------------------------------------------

function Calendario() {
  const [abaAtiva, setAbaAtiva] = useState(ABAS[0].label);

  // Descobre qual conteúdo desenhar a partir do rótulo da aba ativa.
  let recorteSelecionado: Recorte | null = null;
  let grupoEspecialSelecionado: GrupoEspecial | null = null;
  let mostrarViajante = false;

  for (const recorteAtual of GRUPOS_POR_IDADE) {
    if (recorteAtual.label === abaAtiva) {
      recorteSelecionado = recorteAtual;
    }
  }

  for (const grupoAtual of GRUPOS_ESPECIAIS) {
    if (grupoAtual.label === abaAtiva) {
      grupoEspecialSelecionado = grupoAtual;
    }
  }

  if (abaAtiva === GRUPO_VIAJANTE.label) {
    mostrarViajante = true;
  }

  // Monta as colunas e as linhas da tabela conforme o grupo escolhido.
  // Independente do grupo, no final sempre é a mesma tabela.
  let colunas: string[] = [];
  let linhas: Linha[] = [];

  if (recorteSelecionado) {
    colunas = ['Idade/Momento', 'Vacina', 'Dose'];
    linhas = montarLinhasPorIdade(recorteSelecionado);
  }

  if (grupoEspecialSelecionado) {
    colunas = ['Vacina', 'Motivo'];
    linhas = montarLinhasDeGrupoEspecial(grupoEspecialSelecionado);
  }

  if (mostrarViajante) {
    colunas = ['Vacina', 'Motivo', 'Antecedência'];
    linhas = montarLinhasDeViajante();
  }

  function handleTrocarAba(novaAba: string) {
    setAbaAtiva(novaAba);
  }

  function montarClasseDaAba(rotuloDaAba: string): string {
    if (rotuloDaAba === abaAtiva) {
      return 'pb-2 text-sm font-medium border-b-2 border-emerald-700 text-emerald-700';
    }

    return 'pb-2 text-sm font-medium text-gray-500 hover:text-gray-700';
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Calendário Vacinal</h1>
      <p className="mt-1 text-sm text-gray-500">
        Visualize o calendário vacinal atualizado para cada público
      </p>

      <div className="mt-4 flex flex-wrap gap-5 border-b border-gray-200">
        {ABAS.map((abaAtual) => (
          <button
            key={abaAtual.label}
            type="button"
            onClick={function () {
              handleTrocarAba(abaAtual.label);
            }}
            className={montarClasseDaAba(abaAtual.label)}
          >
            {abaAtual.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {grupoEspecialSelecionado && (
          <AvisoAtencao texto={grupoEspecialSelecionado.warning} />
        )}

        {mostrarViajante && (
          <p className="mb-4 text-sm text-gray-600">
            {GRUPO_VIAJANTE.description}
          </p>
        )}

        <TabelaCalendario colunas={colunas} linhas={linhas} />

        {mostrarViajante && (
          <div className="mt-3">
            <p className="text-xs text-gray-500">{GRUPO_VIAJANTE.disclaimer}</p>
            <p className="mt-1 text-xs text-gray-400">
              {GRUPO_VIAJANTE.source}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Calendario;
