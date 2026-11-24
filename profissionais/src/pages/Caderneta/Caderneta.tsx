import { useMemo, useRef, useState } from 'react';
import type { Patient } from '../../types/patient';
import type { RecorteId, SensitiveCondition } from '../../types/vaccine';
import type { VaccinationRecord } from '../../types/vaccinationRecord';
import { searchCitizen } from '../../services/cpfService';
import { getPatientBooklet, saveBooklet } from '../../services/cadernetaService';
import { saveCitizenRegistration } from '../../services/citizenService';
import { registerCadernetaRegistration } from '../../services/dashboardService';
import { calculateAge, getRecorteByAge, isRecorteAvailableForAge } from '../../utils/ageRules';
import { getTodayDateString } from '../../utils/dateRules';
import { brazilianDateToIso, formatAnyDate } from '../../utils/formatDate';
import {
  hasErrors,
  validateCitizenSearch,
  type CitizenSearchErrors,
} from '../../utils/applicationRules';
import { validateCitizenForm, type CitizenFormErrors, type CitizenFormValues } from '../../utils/citizenRules';
import {
  buildRecordsFromCards,
  buildVaccineCards,
  entriesFromRecords,
  validateCardEntry,
  type CardEntries,
  type CardEntry,
} from '../../utils/vaccineCards';
import VaccinationBookletView from '../../components/VaccinationBookletView';
import StepIndicator from '../../components/aplicacao/StepIndicator';
import CitizenSearchForm from '../../components/aplicacao/CitizenSearchForm';
import PatientSummary from '../../components/aplicacao/PatientSummary';
import ApplicationReview from '../../components/aplicacao/ApplicationReview';
import { Section, primaryButton, secondaryButton } from '../../components/aplicacao/Section';
import CitizenRegistrationForm from '../../components/caderneta/CitizenRegistrationForm';
import SensitiveConditionStep, { type HasCondition } from '../../components/caderneta/SensitiveConditionStep';
import VaccineCardsStep from '../../components/caderneta/VaccineCardsStep';

type Step = 'pesquisar' | 'cadastro' | 'condicao' | 'vacinas' | 'revisao' | 'concluido';
type Mode = 'cadastrar' | 'alterar';

const STEP_LABELS = ['Pesquisa', 'Cadastro do cidadão', 'Condição sensível', 'Vacinas', 'Revisão'];
const STEP_INDEX: Record<Step, number> = { pesquisar: 0, cadastro: 1, condicao: 2, vacinas: 3, revisao: 4, concluido: 4 };

const emptyForm: CitizenFormValues = { email: '', motherName: '', fatherName: '', susCard: '', gender: '' };

function Caderneta() {
  const [step, setStep] = useState<Step>('pesquisar');
  const [mode, setMode] = useState<Mode>('cadastrar');

  // Pesquisa
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [searchErrors, setSearchErrors] = useState<CitizenSearchErrors>({});
  const [searchError, setSearchError] = useState('');
  const [searching, setSearching] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [records, setRecords] = useState<VaccinationRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  // Cadastro. Tudo fica aqui para ser preservado ao voltar entre as etapas.
  const [form, setForm] = useState<CitizenFormValues>(emptyForm);
  const [formErrors, setFormErrors] = useState<CitizenFormErrors>({});
  const [hasCondition, setHasCondition] = useState<HasCondition | undefined>();
  const [condition, setCondition] = useState<SensitiveCondition | undefined>();
  const [conditionError, setConditionError] = useState('');
  const [entries, setEntries] = useState<CardEntries>({});
  const [activeTab, setActiveTab] = useState<RecorteId>('crianca');
  const [showCardErrors, setShowCardErrors] = useState(false);
  const [cardsError, setCardsError] = useState('');

  // Confirmação
  const submittingRef = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [bookletOpen, setBookletOpen] = useState(false);

  const age = patient ? calculateAge(patient.birthDate) : 0;
  const birthDateIso = patient ? brazilianDateToIso(patient.birthDate) : '';
  const cards = useMemo(() => buildVaccineCards(age), [age]);
  const allCards = useMemo(() => Object.values(cards).flat(), [cards]);
  const sensitiveCondition = hasCondition === 'sim' ? condition : undefined;

  // ---- Pesquisa ----

  async function handleSearch() {
    const errors = validateCitizenSearch(cpf, birthDate);
    setSearchErrors(errors);
    setSearchError('');
    if (hasErrors(errors)) return;

    setSearching(true);
    try {
      const result = await searchCitizen(cpf, birthDate);
      if (result.status === 'not-found') {
        setSearchError('CPF não encontrado. Verifique o número e digite novamente.');
      } else if (result.status === 'birth-date-mismatch') {
        setSearchError('A data de nascimento não confere com o CPF informado.');
      } else {
        setPatient(result.patient);
      }
    } catch {
      setSearchError('Não foi possível consultar o cidadão. Tente novamente.');
    } finally {
      setSearching(false);
    }
  }

  function resetAll() {
    setStep('pesquisar');
    setCpf('');
    setBirthDate('');
    setSearchErrors({});
    setSearchError('');
    setPatient(null);
    setRecords([]);
    setLoadError('');
    setForm(emptyForm);
    setFormErrors({});
    setHasCondition(undefined);
    setCondition(undefined);
    setConditionError('');
    setEntries({});
    setShowCardErrors(false);
    setCardsError('');
    setSubmitError('');
  }

  // ---- Visualização e início do cadastro/alteração ----

  async function handleViewBooklet() {
    if (!patient) return;
    setLoading(true);
    setLoadError('');
    try {
      setRecords(await getPatientBooklet(patient));
      setBookletOpen(true);
    } catch {
      setLoadError('Não foi possível carregar a caderneta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  async function handleStart(nextMode: Mode) {
    if (!patient) return;
    setLoading(true);
    setLoadError('');
    try {
      const existing = nextMode === 'alterar' ? await getPatientBooklet(patient) : [];
      setRecords(existing);
      setMode(nextMode);
      setForm({
        email: patient.email ?? '',
        motherName: patient.motherName ?? '',
        fatherName: patient.fatherName ?? '',
        susCard: patient.susCard && /\d/.test(patient.susCard) ? patient.susCard : '',
        gender: patient.gender ?? '',
      });
      setHasCondition(nextMode === 'alterar' ? (patient.sensitiveCondition ? 'sim' : 'nao') : undefined);
      setCondition(patient.sensitiveCondition);
      setEntries(entriesFromRecords(existing));
      setActiveTab(getRecorteByAge(age));
      setFormErrors({});
      setStep('cadastro');
    } catch {
      setLoadError('Não foi possível carregar a caderneta do cidadão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  // ---- Avanço entre etapas ----

  function handleContinueRegistration() {
    const errors = validateCitizenForm(form);
    setFormErrors(errors);
    if (!hasErrors(errors)) setStep('condicao');
  }

  function handleContinueCondition() {
    if (!hasCondition) {
      setConditionError('Informe se o cidadão possui ou não condição sensível.');
    } else if (hasCondition === 'sim' && !condition) {
      setConditionError('Selecione a condição sensível.');
    } else {
      setConditionError('');
      setStep('vacinas');
    }
  }

  function getCardProblems(): { missing: number; invalid: number; firstTab?: RecorteId } {
    let missing = 0;
    let invalid = 0;
    let firstTab: RecorteId | undefined;

    for (const card of allCards) {
      const entry = entries[card.key];
      const entryErrors = entry ? validateCardEntry(entry, birthDateIso, getTodayDateString()) : {};
      const isMissing = !entry;
      const isInvalid = hasErrors(entryErrors);

      if (isMissing) missing += 1;
      if (isInvalid) invalid += 1;
      if ((isMissing || isInvalid) && !firstTab) firstTab = card.recorteId;
    }
    return { missing, invalid, firstTab };
  }

  function handleReview() {
    const { missing, invalid, firstTab } = getCardProblems();
    if (missing === 0 && invalid === 0) {
      setShowCardErrors(false);
      setCardsError('');
      setStep('revisao');
      return;
    }

    setShowCardErrors(true);
    setCardsError(
      [
        missing > 0 ? `${missing} dose(s) sem marcação de tomada ou não tomada` : '',
        invalid > 0 ? `${invalid} card(s) com dados inválidos` : '',
      ].filter(Boolean).join(' e ') + '. Corrija para continuar.',
    );
    if (firstTab) setActiveTab(firstTab);
  }

  // ---- Cards ----

  function handleStatusChange(key: string, status: CardEntry['status']) {
    setEntries((current) => ({
      ...current,
      // Ao trocar para "não tomada" os dados de aplicação deixam de valer.
      [key]: status === 'aplicada' ? { ...current[key], status } : { status },
    }));
  }

  function handleFieldChange(key: string, changes: Partial<CardEntry>) {
    setEntries((current) => ({ ...current, [key]: { ...current[key], ...changes } }));
  }

  function handleMarkPending(recorteId: RecorteId) {
    setEntries((current) => {
      const next = { ...current };
      cards[recorteId].forEach((card) => {
        if (!next[card.key]) next[card.key] = { status: 'nao-realizada' };
      });
      return next;
    });
  }

  // ---- Revisão e confirmação ----

  // Citizen e caderneta como ficarão depois de confirmar. Usados na revisão,
  // na pré-visualização e no salvamento, para que os três sejam sempre iguais.
  const draftPatient: Patient | null = patient
    ? {
        ...patient,
        email: form.email.trim(),
        motherName: form.motherName.trim(),
        fatherName: form.fatherName.trim(),
        susCard: form.susCard.trim() || undefined,
        gender: form.gender || undefined,
        sensitiveCondition,
        hasCaderneta: true,
      }
    : null;
  const draftRecords = patient
    ? buildRecordsFromCards({ patientCpf: patient.cpfFormatted, cards: allCards, entries, previousRecords: records })
    : [];
  const takenCount = draftRecords.filter((record) => record.status === 'aplicada').length;
  const notTakenCount = draftRecords.length - takenCount;

  async function handleConfirm() {
    if (submittingRef.current || !patient || !draftPatient) return;
    submittingRef.current = true;
    setSubmitting(true);
    setSubmitError('');

    try {
      await saveCitizenRegistration(patient.cpfFormatted, {
        email: draftPatient.email,
        gender: draftPatient.gender,
        susCard: draftPatient.susCard,
        motherName: draftPatient.motherName,
        fatherName: draftPatient.fatherName,
        sensitiveCondition,
      });
      await saveBooklet(patient.cpfFormatted, draftRecords);
      registerCadernetaRegistration();

      // A tela só mostra sucesso depois que tudo foi salvo.
      setPatient(draftPatient);
      setRecords(draftRecords);
      setStep('concluido');
    } catch {
      setSubmitError('Não foi possível salvar a caderneta. Nenhuma alteração foi confirmada; tente novamente.');
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  const reviewGroups = draftPatient
    ? [
        {
          title: 'Cidadão',
          items: [
            { label: 'Nome', value: draftPatient.name },
            { label: 'CPF', value: draftPatient.cpfFormatted },
            { label: 'Data de nascimento', value: formatAnyDate(draftPatient.birthDate) },
            { label: 'E-mail', value: draftPatient.email || 'Não informado' },
            { label: 'Nome da mãe', value: draftPatient.motherName || 'Não informado' },
            { label: 'Nome do pai', value: draftPatient.fatherName || 'Não informado' },
            { label: 'Cartão SUS', value: draftPatient.susCard || 'Não informado' },
            { label: 'Gênero', value: draftPatient.gender || 'Não informado' },
            { label: 'Condição sensível', value: sensitiveCondition ?? 'Não possui' },
          ],
        },
        {
          title: 'Caderneta',
          items: [
            { label: 'Doses tomadas (aplicadas)', value: String(takenCount) },
            { label: 'Doses não tomadas', value: String(notTakenCount) },
          ],
        },
      ]
    : [];

  const isAlteration = mode === 'alterar';

  return (
    <div className="w-full max-w-4xl">
      <header className="mb-6">
        <p className="text-sm text-gray-500">Cadernetas</p>
        <h1 className="text-2xl font-bold text-gray-800">
          {isAlteration ? 'Alteração de caderneta' : 'Cadastro de caderneta'}
        </h1>
      </header>

      <StepIndicator current={STEP_INDEX[step]} steps={STEP_LABELS} />

      {patient && step !== 'pesquisar' && step !== 'concluido' && (
        <PatientSummary compact patient={patient} onChangeCitizen={resetAll} />
      )}

      {loadError && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{loadError}</p>
      )}

      {step === 'pesquisar' && !patient && (
        <CitizenSearchForm
          cpf={cpf}
          birthDate={birthDate}
          errors={searchErrors}
          searchError={searchError}
          loading={searching}
          onChange={(next) => { setCpf(next.cpf); setBirthDate(next.birthDate); }}
          onSubmit={handleSearch}
        />
      )}

      {step === 'pesquisar' && patient && (
        <>
          <PatientSummary patient={patient} onChangeCitizen={resetAll} />
          {patient.hasCaderneta ? (
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button type="button" onClick={handleViewBooklet} disabled={loading} className={secondaryButton}>Visualizar caderneta</button>
              <button type="button" onClick={() => handleStart('alterar')} disabled={loading} className={primaryButton}>Alterar caderneta</button>
            </div>
          ) : (
            <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900" role="alert">
              <p className="font-semibold">Este cidadão não possui caderneta cadastrada.</p>
              <p className="mt-1">Cadastre o cidadão para vincular a caderneta, com ou sem conta no Vac+.</p>
              <button type="button" onClick={() => handleStart('cadastrar')} disabled={loading} className={`${primaryButton} mt-3`}>
                Cadastrar cidadão
              </button>
            </div>
          )}
        </>
      )}

      {step === 'cadastro' && patient && (
        <>
          <CitizenRegistrationForm patient={patient} values={form} errors={formErrors} onChange={(c) => setForm((cur) => ({ ...cur, ...c }))} />
          <div className="mt-5 flex justify-between">
            <button type="button" onClick={() => setStep('pesquisar')} className={secondaryButton}>Voltar</button>
            <button type="button" onClick={handleContinueRegistration} className={primaryButton}>Continuar</button>
          </div>
        </>
      )}

      {step === 'condicao' && patient && (
        <>
          <SensitiveConditionStep
            hasCondition={hasCondition}
            condition={condition}
            error={conditionError}
            onChange={(has, value) => { setHasCondition(has); setCondition(value); setConditionError(''); }}
          />
          <div className="mt-5 flex justify-between">
            <button type="button" onClick={() => setStep('cadastro')} className={secondaryButton}>Voltar</button>
            <button type="button" onClick={handleContinueCondition} className={primaryButton}>Continuar</button>
          </div>
        </>
      )}

      {step === 'vacinas' && patient && (
        <>
          <VaccineCardsStep
            cards={cards}
            age={age}
            birthDateIso={birthDateIso}
            entries={entries}
            activeTab={activeTab}
            showErrors={showCardErrors}
            onTabChange={(id) => isRecorteAvailableForAge(id, age) && setActiveTab(id)}
            onStatusChange={handleStatusChange}
            onFieldChange={handleFieldChange}
            onMarkPendingAsNotTaken={handleMarkPending}
          />
          {cardsError && (
            <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{cardsError}</p>
          )}
          <div className="mt-5 flex justify-between">
            <button type="button" onClick={() => setStep('condicao')} className={secondaryButton}>Voltar</button>
            <button type="button" onClick={handleReview} className={primaryButton}>Revisar</button>
          </div>
        </>
      )}

      {step === 'revisao' && patient && draftPatient && (
        <>
          <ApplicationReview
            title="Revisão da caderneta"
            summary={
              <>
                A caderneta de <strong>{patient.name}</strong> será {isAlteration ? 'atualizada' : 'cadastrada'} com{' '}
                <strong>{takenCount}</strong> dose(s) tomada(s). Pré-visualize o documento e confirme, ou volte para alterar.
              </>
            }
            groups={reviewGroups}
          >
            <div className="mt-4">
              <button type="button" className={secondaryButton} onClick={() => setBookletOpen(true)}>Pré-visualizar caderneta</button>
            </div>
          </ApplicationReview>
          {submitError && (
            <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{submitError}</p>
          )}
          <div className="sticky bottom-20 z-10 mt-5 flex items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 py-3 lg:bottom-0">
            <button type="button" onClick={() => setStep('vacinas')} disabled={submitting} className={secondaryButton}>Voltar e alterar</button>
            <button type="button" onClick={handleConfirm} disabled={submitting} className={primaryButton}>
              {submitting ? 'Salvando...' : isAlteration ? 'Salvar alterações' : 'Cadastrar caderneta'}
            </button>
          </div>
        </>
      )}

      {step === 'concluido' && patient && (
        <Section title={isAlteration ? 'Caderneta atualizada' : 'Caderneta cadastrada'}>
          <p className="text-sm text-gray-800">
            A caderneta de <strong>{patient.name}</strong> foi {isAlteration ? 'atualizada' : 'cadastrada'} com sucesso.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" onClick={handleViewBooklet} disabled={loading} className={primaryButton}>Visualizar caderneta</button>
            <button type="button" onClick={resetAll} className={secondaryButton}>Novo atendimento</button>
          </div>
        </Section>
      )}

      {bookletOpen && patient && (
        <VaccinationBookletView
          // Na revisão a pré-visualização mostra o rascunho; nos demais casos, a caderneta salva.
          patient={step === 'revisao' && draftPatient ? draftPatient : patient}
          records={step === 'revisao' ? draftRecords : records}
          onClose={() => setBookletOpen(false)}
        />
      )}
    </div>
  );
}

export default Caderneta;
