import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { RECORTES } from '../../data/vaccinesData';
import { MOCK_PROFESSIONALS } from '../../data/mockProfessionals';
import { UNIT_NAME } from '../../data/mockPatients';
import type { Patient } from '../../types/patient';
import type { VaccinationRecord } from '../../types/vaccinationRecord';
import { searchCitizen } from '../../services/cpfService';
import { getPatientBooklet } from '../../services/cadernetaService';
import { getLots } from '../../services/lotService';
import { ApplicationRegistrationError, registerApplication } from '../../services/applicationService';
import { useUser } from '../../hooks/useUser';
import { calculateAge, getRecorteByAge } from '../../utils/ageRules';
import { getTodayDateString } from '../../utils/dateRules';
import { formatAnyDate, formatIsoDate } from '../../utils/formatDate';
import { getAvailableLots } from '../../utils/stockRules';
import {
  hasErrors,
  validateApplicationData,
  validateCitizenSearch,
  validateVaccineSelection,
  type ApplicationFormErrors,
  type ApplicationFormValues,
  type CitizenSearchErrors,
} from '../../utils/applicationRules';
import VaccinationBookletView from '../../components/VaccinationBookletView';
import StepIndicator from '../../components/aplicacao/StepIndicator';
import CitizenSearchForm from '../../components/aplicacao/CitizenSearchForm';
import PatientSummary from '../../components/aplicacao/PatientSummary';
import VaccineDoseStep from '../../components/aplicacao/VaccineDoseStep';
import ApplicationDataStep from '../../components/aplicacao/ApplicationDataStep';
import ApplicationReview from '../../components/aplicacao/ApplicationReview';
import { Section, primaryButton, secondaryButton } from '../../components/aplicacao/Section';

type Step = 'identificacao' | 'vacina' | 'dados' | 'revisao' | 'concluido';

const STEP_INDEX: Record<Step, number> = { identificacao: 0, vacina: 1, dados: 2, revisao: 3, concluido: 3 };

function normalizeName(name: string) {
  return name.replace(/^(dr\.?|dra\.?)\s+/i, '').trim().toLowerCase();
}

function createInitialValues(patient: Patient): ApplicationFormValues {
  const recorteId = getRecorteByAge(calculateAge(patient.birthDate));
  const momentos = RECORTES.find((recorte) => recorte.id === recorteId)?.moments ?? [];
  return {
    recorteId,
    // Quando o grupo só tem um momento, ele já vem selecionado.
    momentoId: momentos.length === 1 ? momentos[0].id : undefined,
    applicationDate: getTodayDateString(),
  };
}

function Aplicacoes() {
  const { userName } = useUser();
  const [step, setStep] = useState<Step>('identificacao');

  // Identificação
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [searchErrors, setSearchErrors] = useState<CitizenSearchErrors>({});
  const [searchError, setSearchError] = useState('');
  const [searching, setSearching] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);

  // Caderneta do cidadão
  const [records, setRecords] = useState<VaccinationRecord[]>([]);
  const [bookletOpen, setBookletOpen] = useState(false);
  const [bookletLoading, setBookletLoading] = useState(false);
  const [bookletError, setBookletError] = useState('');

  // Formulário. Fica aqui para ser preservado ao voltar entre as etapas.
  const [values, setValues] = useState<ApplicationFormValues>({ recorteId: RECORTES[0].id, applicationDate: getTodayDateString() });
  const [showErrors, setShowErrors] = useState(false);
  const [lots, setLots] = useState(() => getLots());

  // Registro. O ref impede um segundo clique antes de o estado atualizar.
  const submittingRef = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [registeredSummary, setRegisteredSummary] = useState('');

  const patientAge = patient ? calculateAge(patient.birthDate) : 0;
  const recorte = RECORTES.find((item) => item.id === values.recorteId) ?? RECORTES[0];
  const momento = recorte.moments.find((item) => item.id === values.momentoId);
  const vacina = momento?.vaccines.find((item) => item.id === values.vacinaId);
  const dose = vacina?.doses.find((item) => item.id === values.doseId);
  const availableLots = values.vacinaId ? getAvailableLots(lots, values.vacinaId) : [];
  const lot = availableLots.find((item) => item.id === values.lotId);
  const loggedProfessional =
    MOCK_PROFESSIONALS.find((item) => normalizeName(item.name) === normalizeName(userName)) ?? MOCK_PROFESSIONALS[0];
  const professional = MOCK_PROFESSIONALS.find((item) => item.id === values.professionalId) ?? loggedProfessional;

  const vaccineErrors: ApplicationFormErrors = validateVaccineSelection(values, records);
  const dataErrors: ApplicationFormErrors = patient
    ? validateApplicationData({ values, lot, professional, birthDate: patient.birthDate })
    : {};
  const visibleErrors = showErrors ? { ...vaccineErrors, ...dataErrors } : {};

  function changeValues(changes: Partial<ApplicationFormValues>) {
    setValues((current) => ({ ...current, ...changes }));
  }

  function goTo(next: Step) {
    setShowErrors(false);
    setSubmitError('');
    setStep(next);
  }

  // ---- Identificação ----

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
        setValues(createInitialValues(result.patient));
      }
    } catch {
      setSearchError('Não foi possível consultar o cidadão. Tente novamente.');
    } finally {
      setSearching(false);
    }
  }

  function resetAll() {
    setStep('identificacao');
    setCpf('');
    setBirthDate('');
    setSearchErrors({});
    setSearchError('');
    setPatient(null);
    setRecords([]);
    setBookletError('');
    setShowErrors(false);
    setSubmitError('');
    setRegisteredSummary('');
  }

  // ---- Caderneta ----

  async function loadRecords(current: Patient) {
    const loaded = await getPatientBooklet(current);
    setRecords(loaded);
    return loaded;
  }

  async function handleViewBooklet() {
    if (!patient) return;
    setBookletLoading(true);
    setBookletError('');
    try {
      await loadRecords(patient);
      setBookletOpen(true);
    } catch {
      setBookletError('Não foi possível carregar a caderneta. Tente novamente.');
    } finally {
      setBookletLoading(false);
    }
  }

  async function handleStartApplication() {
    if (!patient) return;
    setBookletLoading(true);
    setBookletError('');
    try {
      await loadRecords(patient);
      setValues(createInitialValues(patient));
      goTo('vacina');
    } catch {
      setBookletError('Não foi possível carregar a caderneta do cidadão. Tente novamente.');
    } finally {
      setBookletLoading(false);
    }
  }

  // ---- Seleção de vacina e dose ----

  function handleRecorteChange(recorteId: string) {
    const momentos = RECORTES.find((item) => item.id === recorteId)?.moments ?? [];
    setValues((current) => ({
      ...current,
      recorteId,
      momentoId: momentos.length === 1 ? momentos[0].id : undefined,
      vacinaId: undefined,
      doseId: undefined,
      lotId: undefined,
    }));
  }

  // ---- Avanço entre etapas ----

  function handleNext(from: 'vacina' | 'dados') {
    const errors = from === 'vacina' ? vaccineErrors : dataErrors;
    if (hasErrors(errors)) {
      setShowErrors(true);
      return;
    }
    goTo(from === 'vacina' ? 'dados' : 'revisao');
  }

  // ---- Confirmação ----

  async function handleConfirm() {
    if (submittingRef.current || !patient || !vacina || !momento || !dose || !lot) return;
    submittingRef.current = true;
    setSubmitting(true);
    setSubmitError('');

    try {
      // Reconsulta a caderneta: outra aplicação pode ter sido registrada nesse meio tempo.
      const freshRecords = await loadRecords(patient);
      const errors = {
        ...validateVaccineSelection(values, freshRecords),
        ...validateApplicationData({ values, lot, professional, birthDate: patient.birthDate }),
      };
      if (hasErrors(errors)) {
        setSubmitError(Object.values(errors)[0] ?? 'Revise os dados da aplicação.');
        return;
      }

      await registerApplication(
        {
          patientCpf: patient.cpfFormatted,
          patientName: patient.name,
          recorteId: recorte.id,
          momentoId: momento.id,
          momentoLabel: momento.label,
          vaccineId: vacina.id,
          vaccineName: vacina.name,
          doseId: dose.id,
          doseLabel: dose.label,
          lotId: lot.id,
          lotCode: lot.code,
          applicationDate: values.applicationDate,
          professionalId: professional.id,
          professionalName: professional.name,
          professionalCofen: professional.cofen,
          unit: UNIT_NAME,
        },
        patient,
      );

      // Só agora, com o registro salvo, a tela de sucesso e a caderneta são atualizadas.
      setRegisteredSummary(`${vacina.name} · ${dose.label} · ${formatIsoDate(values.applicationDate)}`);
      setLots(getLots());
      try {
        await loadRecords(patient);
      } catch {
        setBookletError('A aplicação foi registrada, mas a caderneta exibida pode estar desatualizada. Consulte-a novamente.');
      }
      goTo('concluido');
    } catch (error) {
      setSubmitError(
        error instanceof ApplicationRegistrationError
          ? error.message
          : 'Não foi possível registrar a aplicação. Nada foi salvo; tente novamente.',
      );
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  function handleNewApplication() {
    if (!patient) return;
    setValues(createInitialValues(patient));
    setBookletError('');
    setRegisteredSummary('');
    goTo('vacina');
  }

  const reviewGroups = patient && vacina && dose && momento
    ? [
        {
          title: 'Cidadão',
          items: [
            { label: 'Nome', value: patient.name },
            { label: 'CPF', value: patient.cpfFormatted },
            { label: 'Data de nascimento', value: formatAnyDate(patient.birthDate) },
          ],
        },
        {
          title: 'Vacina e dose',
          items: [
            { label: 'Vacina', value: vacina.name },
            { label: 'Dose', value: dose.label },
            { label: 'Momento', value: `${recorte.label} · ${momento.label}` },
            { label: 'Situação', value: 'Será registrada como aplicada ao confirmar' },
          ],
        },
        {
          title: 'Dados da aplicação',
          items: [
            { label: 'Data da aplicação', value: formatIsoDate(values.applicationDate) },
            { label: 'Lote', value: lot?.code ?? 'Não informado' },
            { label: 'Unidade de saúde', value: UNIT_NAME },
            { label: 'Profissional responsável', value: professional.name },
            { label: 'Registro profissional', value: professional.cofen },
          ],
        },
      ]
    : [];

  return (
    <div className="w-full max-w-4xl">
      <header className="mb-6">
        <p className="text-sm text-gray-500">Aplicações</p>
        <h1 className="text-2xl font-bold text-gray-800">Registro de aplicação de vacina</h1>
      </header>

      <StepIndicator current={STEP_INDEX[step]} />

      {patient && step !== 'identificacao' && (
        <PatientSummary
          compact
          patient={patient}
          onViewBooklet={handleViewBooklet}
          bookletLoading={bookletLoading}
          onChangeCitizen={resetAll}
        />
      )}

      {bookletError && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {bookletError}
        </p>
      )}

      {step === 'identificacao' && !patient && (
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

      {step === 'identificacao' && patient && (
        <>
          <PatientSummary
            patient={patient}
            onViewBooklet={handleViewBooklet}
            bookletLoading={bookletLoading}
            onChangeCitizen={resetAll}
          />
          {patient.hasCaderneta ? (
            <div className="mt-4 flex justify-end">
              <button type="button" onClick={handleStartApplication} disabled={bookletLoading} className={primaryButton}>
                {bookletLoading ? 'Carregando...' : 'Registrar aplicação'}
              </button>
            </div>
          ) : (
            <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900" role="alert">
              <p className="font-semibold">Este cidadão ainda não possui caderneta de vacinação.</p>
              <p className="mt-1">
                É necessário cadastrar a caderneta antes de registrar uma aplicação.{' '}
                <Link to="/cadernetas" className="font-semibold underline">Cadastrar caderneta</Link>
              </p>
            </div>
          )}
        </>
      )}

      {step === 'vacina' && patient && (
        <>
          <VaccineDoseStep
            values={values}
            errors={visibleErrors}
            records={records}
            patientAge={patientAge}
            momentos={recorte.moments}
            vacina={vacina}
            onRecorteChange={handleRecorteChange}
            onMomentoChange={(momentoId) => changeValues({ momentoId, vacinaId: undefined, doseId: undefined, lotId: undefined })}
            onVacinaChange={(vacinaId) => changeValues({ vacinaId, doseId: undefined, lotId: undefined })}
            onDoseChange={(doseId) => changeValues({ doseId })}
          />
          <div className="mt-5 flex justify-end">
            <button type="button" onClick={() => handleNext('vacina')} className={primaryButton}>Continuar</button>
          </div>
        </>
      )}

      {step === 'dados' && patient && (
        <>
          <ApplicationDataStep
            values={values}
            errors={visibleErrors}
            lots={availableLots}
            professionals={MOCK_PROFESSIONALS}
            professional={professional}
            unit={UNIT_NAME}
            onChange={changeValues}
          />
          <div className="mt-5 flex justify-between">
            <button type="button" onClick={() => goTo('vacina')} className={secondaryButton}>Voltar</button>
            <button type="button" onClick={() => handleNext('dados')} className={primaryButton}>Revisar</button>
          </div>
        </>
      )}

      {step === 'revisao' && patient && (
        <>
          <ApplicationReview
            summary={
              <>
                Será registrada a aplicação de <strong>{vacina?.name} · {dose?.label}</strong> para{' '}
                <strong>{patient.name}</strong> em {formatIsoDate(values.applicationDate)}. Confira os dados e clique em
                “Registrar aplicação”.
              </>
            }
            groups={reviewGroups}
          />
          {submitError && (
            <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {submitError}
            </p>
          )}
          <div className="sticky bottom-20 z-10 mt-5 flex items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 py-3 lg:bottom-0">
            <button type="button" onClick={() => goTo('dados')} disabled={submitting} className={secondaryButton}>Voltar e alterar</button>
            <button type="button" onClick={handleConfirm} disabled={submitting} className={primaryButton}>
              {submitting ? 'Registrando...' : 'Registrar aplicação'}
            </button>
          </div>
        </>
      )}

      {step === 'concluido' && patient && (
        <Section title="Aplicação registrada">
          <p className="text-sm text-gray-800">
            A aplicação foi registrada e já consta na caderneta de <strong>{patient.name}</strong>.
          </p>
          <p className="mt-2 text-sm text-gray-600">{registeredSummary}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" onClick={handleViewBooklet} disabled={bookletLoading} className={primaryButton}>
              Consultar caderneta
            </button>
            <button type="button" onClick={handleNewApplication} className={secondaryButton}>Nova aplicação</button>
            <button type="button" onClick={resetAll} className={secondaryButton}>Outro cidadão</button>
            <Link to="/historico" className={`${secondaryButton} inline-block`}>Ver histórico</Link>
          </div>
        </Section>
      )}

      {bookletOpen && patient && (
        <VaccinationBookletView patient={patient} records={records} onClose={() => setBookletOpen(false)} />
      )}
    </div>
  );
}

export default Aplicacoes;
