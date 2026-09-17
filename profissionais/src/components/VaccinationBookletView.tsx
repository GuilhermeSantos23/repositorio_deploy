import { useEffect, useMemo, useState, type ReactElement, type ReactNode } from 'react';
import {
  BookOutlined,
  CheckCircleFilled,
  CloseOutlined,
  EditOutlined,
  LeftOutlined,
  RightOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { RECORTES } from '../data/vaccinesData';
import { useIsDesktop } from '../hooks/useIsDesktop';
import type { Patient } from '../types/patient';
import type { VaccinationRecord } from '../types/vaccinationRecord';

interface Props {
  patient: Patient;
  records: VaccinationRecord[];
  selectionMode?: boolean;
  onBack: () => void;
  onEditSelected?: (record: VaccinationRecord) => void;
}

interface BookletVaccine {
  id: string;
  name: string;
  recorteId: string;
  recorteLabel: string;
  firstMomentLabel: string;
  doses: { id: string; label: string; momentLabel: string }[];
}

interface VaccinePage {
  recorteLabel: string;
  vaccines: BookletVaccine[];
}

const VACCINES_PER_PAGE = 3;

// Uma vacina só é agrupada uma vez, mesmo que possua registros em
// recortes/momentos diferentes (ex.: Hepatite B ao nascer e na vida adulta).
function buildVaccines(): BookletVaccine[] {
  const map = new Map<string, BookletVaccine>();

  for (const recorte of RECORTES) {
    for (const moment of recorte.moments) {
      for (const vaccine of moment.vaccines) {
        const existing = map.get(vaccine.id);
        if (!existing) {
          map.set(vaccine.id, {
            id: vaccine.id,
            name: vaccine.name,
            recorteId: recorte.id,
            recorteLabel: recorte.label,
            firstMomentLabel: moment.label,
            doses: vaccine.doses.map((dose) => ({ ...dose, momentLabel: moment.label })),
          });
          continue;
        }

        for (const dose of vaccine.doses) {
          const alreadyListed = existing.doses.some(
            (item) => item.id === dose.id && item.momentLabel === moment.label,
          );
          if (!alreadyListed) {
            existing.doses.push({ ...dose, momentLabel: moment.label });
          }
        }
      }
    }
  }

  return [...map.values()];
}

// Organiza os registros por recorte (na ordem oficial do calendário) e,
// dentro de cada recorte, em ordem alfabética — como pede o fluxo da
// caderneta. Cada página pertence a um único recorte.
function buildVaccinePages(vaccines: BookletVaccine[]): VaccinePage[] {
  const pages: VaccinePage[] = [];

  for (const recorte of RECORTES) {
    const vaccinesOfRecorte = vaccines
      .filter((vaccine) => vaccine.recorteId === recorte.id)
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

    if (vaccinesOfRecorte.length === 0) continue;

    for (let i = 0; i < vaccinesOfRecorte.length; i += VACCINES_PER_PAGE) {
      pages.push({
        recorteLabel: recorte.label,
        vaccines: vaccinesOfRecorte.slice(i, i + VACCINES_PER_PAGE),
      });
    }
  }

  return pages;
}

function formatDate(date?: string) {
  if (!date) return 'Não informado';
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}

function formatBirthDate(birthDate: string) {
  if (!birthDate.includes('/')) return formatDate(birthDate);
  return birthDate;
}

function recordForDose(records: VaccinationRecord[], vaccineId: string, doseId: string, momentLabel: string) {
  return (
    records.find(
      (record) =>
        record.vacinaId === vaccineId &&
        record.doseId === doseId &&
        record.momentoLabel === momentLabel,
    ) ?? records.find((record) => record.vacinaId === vaccineId && record.doseId === doseId)
  );
}

// Agrupa os números de página em "spreads" (pares de páginas mostradas
// lado a lado, como um livro aberto). Em telas estreitas cada spread tem
// apenas uma página, para nada ficar cortado.
function buildSpreads(totalPages: number, pagesPerSpread: 1 | 2): number[][] {
  const spreads: number[][] = [];
  for (let page = 1; page <= totalPages; page += pagesPerSpread) {
    const spread = [page];
    if (pagesPerSpread === 2 && page + 1 <= totalPages) {
      spread.push(page + 1);
    }
    spreads.push(spread);
  }
  return spreads;
}

export default function VaccinationBookletView({
  patient,
  records,
  selectionMode = false,
  onBack,
  onEditSelected,
}: Props) {
  const isDesktop = useIsDesktop();
  const pagesPerSpread = isDesktop ? 2 : 1;

  const [spreadIndex, setSpreadIndex] = useState(0);
  const [selectedRecordId, setSelectedRecordId] = useState<string>();

  const vaccines = useMemo(buildVaccines, []);
  const vaccinePages = useMemo(() => buildVaccinePages(vaccines), [vaccines]);

  // Página 1: capa · Página 2: dados do cidadão · páginas seguintes: vacinas
  // por recorte · última página: institucional.
  const COVER_PAGE = 1;
  const PATIENT_PAGE = 2;
  const FIRST_VACCINE_PAGE = 3;
  const totalPages = FIRST_VACCINE_PAGE + vaccinePages.length; // + página institucional
  const FINAL_PAGE = totalPages;

  const spreads = useMemo(
    () => buildSpreads(totalPages, pagesPerSpread),
    [totalPages, pagesPerSpread],
  );

  // Se a tela mudar de tamanho (ou o conteúdo mudar), garante que o
  // spread atual continue existindo.
  useEffect(() => {
    setSpreadIndex((current) => Math.min(current, spreads.length - 1));
  }, [spreads.length]);

  const currentSpread = spreads[spreadIndex] ?? [1];
  const leftPageNumber = currentSpread[0];
  const rightPageNumber = currentSpread[1];

  const selectedRecord = records.find((record) => record.id === selectedRecordId);
  const isFirstSpread = spreadIndex === 0;
  const isLastSpread = spreadIndex === spreads.length - 1;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onBack();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  function renderDose(vaccine: BookletVaccine, dose: BookletVaccine['doses'][number]) {
    const record = recordForDose(records, vaccine.id, dose.id, dose.momentLabel);
    const selectable = selectionMode && Boolean(record);
    const selected = record?.id === selectedRecordId;

    return (
      <button
        key={`${vaccine.id}-${dose.id}`}
        type="button"
        disabled={!selectable}
        onClick={() => selectable && setSelectedRecordId(record?.id)}
        className={`w-full rounded-lg border p-3 text-left transition-colors ${
          selected ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-white'
        } ${selectable ? 'cursor-pointer hover:border-emerald-400' : 'cursor-default'}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-800">{dose.label}</p>
            <p className="text-xs text-gray-500">Momento: {dose.momentLabel}</p>
          </div>
          {record?.status === 'aplicada' ? <CheckCircleFilled className="text-emerald-600" /> : null}
        </div>

        {record ? (
          <div className="mt-2 grid gap-x-4 gap-y-1 text-xs text-gray-600 sm:grid-cols-2">
            {record.status === 'nao-realizada' ? (
              <span className="font-medium text-amber-700">Não realizada</span>
            ) : (
              <span>Data: {formatDate(record.data)}</span>
            )}
            <span>Lote: {record.lote || 'Não informado'}</span>
            <span>Profissional: {record.profissional || 'Não informado'}</span>
            <span>CRM: {record.crm || 'Não informado'}</span>
            <span>Unidade: {record.unidade || 'Não informado'}</span>
            {record.status === 'nao-realizada' ? (
              <span className="sm:col-span-2">
                Justificativa: {record.justificativa || 'Não informado'}
              </span>
            ) : null}
          </div>
        ) : (
          <p className="mt-2 text-xs font-medium text-gray-500">Dose não informada</p>
        )}
      </button>
    );
  }

  // Devolve o conteúdo de uma página a partir do seu número. Cada página
  // é renderizada dentro de um "PageCard" (o retângulo com borda que dá
  // a aparência de folha da caderneta).
  function renderPageContent(pageNumber: number): ReactElement | null {
    if (pageNumber === COVER_PAGE) return <CoverPage />;
    if (pageNumber === PATIENT_PAGE) return <PatientPage patient={patient} />;
    if (pageNumber === FINAL_PAGE) return <FinalPage />;

    const vaccinePage = vaccinePages[pageNumber - FIRST_VACCINE_PAGE];
    if (vaccinePage) {
      return <VaccinePageView vaccinePage={vaccinePage} renderDose={renderDose} />;
    }
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/60 p-4 backdrop-blur-[2px] sm:p-8"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onBack();
      }}
    >
      <div className="flex h-full max-h-[660px] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Cabeçalho */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-3 sm:px-7">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <BookOutlined />
            </span>
            <h1 className="text-base font-bold text-gray-900">Caderneta de Saúde</h1>
          </div>
          <button
            type="button"
            onClick={onBack}
            aria-label="Fechar caderneta"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <CloseOutlined />
          </button>
        </div>

        {/* Aviso de seleção para alteração */}
        {selectionMode && (
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-emerald-100 bg-emerald-50 px-5 py-3 sm:px-7">
            <div>
              <p className="text-sm font-semibold text-emerald-950">Selecione um registro para alterar.</p>
              <p className="text-xs text-emerald-800">
                Navegue pelas páginas de vacinas e escolha um registro já existente.
              </p>
            </div>
            <button
              type="button"
              disabled={!selectedRecord}
              onClick={() => selectedRecord && onEditSelected?.(selectedRecord)}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-emerald-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <EditOutlined /> Alterar registro selecionado
            </button>
          </div>
        )}

        {/* Área das páginas: uma "folha" em telas estreitas, duas
            "folhas" lado a lado (como um livro aberto) em telas largas. */}
        <div className="flex-1 overflow-hidden bg-[#f2f4f1] p-3 sm:p-5">
          <div
            key={spreadIndex}
            className={`grid h-full gap-3 sm:gap-4 [animation:booklet-page-turn_0.35s_ease-out] ${
              rightPageNumber ? 'grid-cols-2' : 'grid-cols-1'
            }`}
          >
            <PageCard cover={leftPageNumber === COVER_PAGE}>
              {renderPageContent(leftPageNumber)}
            </PageCard>
            {rightPageNumber ? (
              <PageCard cover={rightPageNumber === COVER_PAGE}>
                {renderPageContent(rightPageNumber)}
              </PageCard>
            ) : null}
          </div>
        </div>

        {/* Rodapé / navegação */}
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-gray-100 bg-white px-5 py-3 sm:px-7">
          <button
            type="button"
            disabled={isFirstSpread}
            onClick={() => setSpreadIndex((value) => value - 1)}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <LeftOutlined /> Anterior
          </button>

          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <span
                  key={pageNumber}
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    pageNumber === leftPageNumber || pageNumber === rightPageNumber
                      ? 'bg-emerald-700'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-gray-400">
              Página {leftPageNumber} de {totalPages}
            </span>
          </div>

          <button
            type="button"
            disabled={isLastSpread}
            onClick={() => setSpreadIndex((value) => value + 1)}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Próxima <RightOutlined />
          </button>
        </div>
      </div>
    </div>
  );
}

// Retângulo com aparência de "folha" da caderneta: borda, cantos
// arredondados e rolagem própria caso o conteúdo não caiba.
function PageCard({ cover, children }: { cover?: boolean; children: ReactNode }) {
  return (
    <div
      className={`h-full min-w-0 overflow-y-auto rounded-xl border p-5 shadow-sm sm:p-6 ${
        cover
          ? 'border-emerald-100 bg-gradient-to-br from-emerald-50 via-emerald-50 to-white'
          : 'border-gray-100 bg-white'
      }`}
    >
      {children}
    </div>
  );
}

function CoverPage() {
  return (
    <div className="relative flex h-full min-h-[420px] flex-col items-center justify-center overflow-hidden rounded-lg text-center">
      <span className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-emerald-100/70" />
      <span className="pointer-events-none absolute -bottom-16 -left-14 h-48 w-48 rounded-full bg-emerald-100/50" />

      <h2 className="relative mt-6 text-3xl font-bold tracking-tight text-emerald-950 sm:text-4xl">
        Caderneta de Saúde
      </h2>
      <p className="relative mt-1 text-xl font-medium text-emerald-700 sm:text-2xl">Vacinação</p>

      <span className="relative mt-5 h-1 w-10 rounded-full bg-emerald-600" />


      <span className="relative mt-8 flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-emerald-800/70 text-3xl text-emerald-800">
        <SafetyCertificateOutlined />
      </span>

      <p className="relative mt-8 max-w-md text-[11px] leading-5 text-gray-500">
        Este documento é uma representação digital desenvolvida pelo grupo Vac+, com finalidade
        acadêmica e demonstrativa.
      </p>
    </div>
  );
}

function PatientPage({ patient }: { patient: Patient }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-emerald-700">
        <UserOutlined className="text-xs" />
        <p className="text-xs font-semibold uppercase tracking-[0.18em]">Informações do usuário</p>
      </div>
      <h2 className="mt-1 text-xl font-bold text-emerald-950">Dados pessoais</h2>
      <span className="mt-3 block h-0.5 w-full rounded-full bg-emerald-600/80" />

      <div className="mt-5 flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xl text-emerald-700">
          <UserOutlined />
        </span>
        <div className="grid flex-1 grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          <Info label="Nome completo" value={patient.name} />
          <Info label="Data de nascimento" value={formatBirthDate(patient.birthDate)} />
          <Info label="Cartão do SUS" value={patient.susCard || 'Não informado'} />
          <Info label="CPF" value={patient.cpfFormatted} />
          <Info label="Nome da mãe" value={patient.motherName || 'Não informado'} />
          <Info label="Nome do pai" value={patient.fatherName || 'Não informado'} />
        </div>
      </div>
      {patient.sensitiveCondition ? (
        <p className="mt-4 text-xs text-gray-500">
          Condição sensível registrada: {patient.sensitiveCondition}
        </p>
      ) : null}
    </div>
  );
}

function VaccinePageView({
  vaccinePage,
  renderDose,
}: {
  vaccinePage: VaccinePage;
  renderDose: (vaccine: BookletVaccine, dose: BookletVaccine['doses'][number]) => ReactElement;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
        Registro de vacinação
      </p>
      <h2 className="mt-1 text-xl font-bold text-emerald-950">{vaccinePage.recorteLabel}</h2>
      <p className="mt-1 text-xs text-gray-500">
        Vacinas organizadas por faixa etária/momento e em ordem alfabética.
      </p>

      <div className="mt-4 space-y-4">
        {vaccinePage.vaccines.map((vaccine) => (
          <section key={vaccine.id} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-bold text-gray-900">{vaccine.name}</h3>
              <span className="text-xs text-gray-500">Primeiro momento: {vaccine.firstMomentLabel}</span>
            </div>
            <div className="space-y-2">{vaccine.doses.map((dose) => renderDose(vaccine, dose))}</div>
          </section>
        ))}
      </div>
    </div>
  );
}

function FinalPage() {
  return (
    <div className="flex h-full min-h-[420px] flex-col items-center justify-center text-center">
      <span className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-700">Vac+</span>
      <h2 className="mt-3 text-xl font-bold text-emerald-950">Caderneta de Saúde Digital</h2>
      <span className="mt-4 h-0.5 w-14 rounded-full bg-emerald-600/80" />

      <div className="mt-6 max-w-md space-y-3 text-sm leading-6 text-gray-600">
        <p>
          As informações apresentadas nesta caderneta são destinadas ao acompanhamento dos registros
          de vacinação do cidadão e devem ser tratadas de forma responsável, respeitando os
          princípios de privacidade, segurança e proteção de dados pessoais.
        </p>
        <p>
          O acesso às informações deve ocorrer exclusivamente por usuários autorizados, evitando seu
          compartilhamento, divulgação ou utilização para finalidades diferentes das previstas pelo
          sistema.
        </p>
        <p>
          Esta caderneta digital constitui uma representação desenvolvida pelo grupo{' '}
          <strong className="font-semibold text-emerald-900">Vac+</strong>, como parte de um projeto
          acadêmico voltado à demonstração de uma solução para gerenciamento e acompanhamento da
          vacinação.
        </p>
        <p>
          O grupo Vac+ agradece a confiança e reforça seu compromisso com a organização, segurança e
          responsabilidade no tratamento das informações apresentadas pelo sistema.
        </p>
      </div>

      <span className="mt-8 inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-gray-400">
        Projeto acadêmico · Demonstração
      </span>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}
