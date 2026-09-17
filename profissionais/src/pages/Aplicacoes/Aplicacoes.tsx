import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  SearchOutlined,
  UserOutlined,
  CheckCircleFilled,
  CheckOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { Alert, Select } from 'antd';
import { maskCPF } from '../../utils/masks';
import { findPatientByCpf } from '../../services/cpfService';
import { RECORTES } from '../../data/vaccinesData';
import { MOCK_PROFESSIONALS } from '../../data/mockProfessionals';
import { UNIT_NAME } from '../../data/mockPatients';
import { getAvailableLots } from '../../utils/stockRules';
import { getRecorteForAge } from '../../utils/vaccinationRules';
import { getTodayDateString, getApplicationDateLimits } from '../../utils/dateRules';
import { canSubmitApplication } from '../../utils/applicationRules';
import { EMPTY_LOT_MESSAGE } from '../../utils/stockRules';
import { getLots } from '../../services/lotService';
import { getAllApplications } from '../../services/applicationService';
import { getPatientBooklet } from '../../services/cadernetaService';
import VaccinationBookletView from '../../components/VaccinationBookletView';
import { registerApplication } from '../../services/applicationService';
import { useUser } from '../../hooks/useUser';
import {
  type Patient,
} from '../../data/mockPatients';
import type { RecorteId } from '../../types/vaccine';
import type { VaccinationRecord } from '../../types/vaccinationRecord';

type Step = 'pesquisar' | 'paciente' | 'visualizar' | 'aplicar' | 'revisao' | 'concluido';
type FilterChoice = 'sim' | 'nao';

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">{children}</div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2">
      <dt className="text-gray-500">{label}</dt>
      <dd className="text-right font-medium text-gray-900">{value}</dd>
    </div>
  );
}

function Aplicacoes() {
  const [step, setStep] = useState<Step>('pesquisar');

  const [cpf, setCpf] = useState('');
  const [patient, setPatient] = useState<Patient | null>(null);

  const { userName } = useUser();
  const [bookletRecords, setBookletRecords] = useState<VaccinationRecord[]>([]);
  const [bookletLoading, setBookletLoading] = useState(false);
  const [bookletError, setBookletError] = useState('');

  const [filterChoice, setFilterChoice] = useState<FilterChoice>('nao');
  const [recorteId, setRecorteId] = useState<RecorteId>(RECORTES[0].id);
  const [momentoId, setMomentoId] = useState<string | undefined>();
  const [vacinaId, setVacinaId] = useState<string | undefined>();
  const [doseId, setDoseId] = useState<string | undefined>();
  const [lotId, setLotId] = useState<string | undefined>();
  const [dataAplicacao, setDataAplicacao] = useState(getTodayDateString());
  const [profissionalId, setProfissionalId] = useState<string | undefined>();
  const [lots, setLots] = useState(() => getLots());
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [emptyLotMessage, setEmptyLotMessage] = useState('');

  const normalizeName = (name: string) =>
    name.replace(/^(dr\.?|dra\.?)\s+/i, '').trim().toLowerCase();

  const loggedProfessional = MOCK_PROFESSIONALS.find(
    (professional) => normalizeName(professional.name) === normalizeName(userName),
  ) ?? MOCK_PROFESSIONALS[0];
  const profissionalAplicou = MOCK_PROFESSIONALS.find((professional) => professional.id === profissionalId) ?? loggedProfessional;
  const crmAplicou = profissionalAplicou.crm;
  const unidade = UNIT_NAME;
  const hasApplications = patient
    ? getAllApplications().some((application) => application.patientCpf === patient.cpfFormatted)
    : false;

  const recorteAtual = RECORTES.find((recorte) => recorte.id === recorteId)!;
  // Quando o profissional não quer selecionar o filtro manualmente, reutilizamos
  // a regra de faixa etária já existente (ageRules/vaccinationRules) em vez de
  // misturar os momentos de todos os recortes — vários recortes compartilham o
  // mesmo id de momento (ex.: "conforme-historico"), então uma mistura direta
  // sobrescreveria as vacinas de um recorte pelas de outro.
  const recorteParaAplicacao = filterChoice === 'sim'
    ? recorteAtual
    : (patient ? getRecorteForAge(patient.age) : undefined) ?? recorteAtual;
  const momentosDisponiveis = recorteParaAplicacao.moments;
  const momentoAtual = momentosDisponiveis.find((momento) => momento.id === momentoId);
  const vacinaAtual = momentoAtual?.vaccines.find((vacina) => vacina.id === vacinaId);
  const lotesDisponiveis = vacinaId ? getAvailableLots(lots, vacinaId) : [];
  const loteAtual = lotesDisponiveis.find((lot) => lot.id === lotId);
  const { min: minApplicationDate, max: maxApplicationDate } = getApplicationDateLimits();

  // A tela consulta o serviço de CPF. Hoje ele usa o mock; futuramente,
  // o mesmo ponto será ligado à API real sem alterar este fluxo.
  async function handleSearch() {
    const found = await findPatientByCpf(cpf);

    setPatient(found);
    setStep('paciente');
  }

  // Usado quando o CPF pesquisado não corresponde a nenhum cidadão, para o
  // profissional não ficar preso na tela de resultado (ver item 8 do briefing).
  function handleVoltarPesquisa() {
    setStep('pesquisar');
    setCpf('');
    setPatient(null);
  }


  async function handleVisualizarCaderneta() {
    if (!patient?.hasCaderneta) return;

    setBookletLoading(true);
    setBookletError('');

    try {
      setBookletRecords(await getPatientBooklet(patient));
      setStep('visualizar');
    } catch {
      setBookletError('Não foi possível carregar a caderneta. Tente novamente.');
    } finally {
      setBookletLoading(false);
    }
  }

  function handleFilterChange(choice: FilterChoice) {
    setFilterChoice(choice);
    setRecorteId(RECORTES[0].id);
    setMomentoId(undefined);
    setVacinaId(undefined);
    setDoseId(undefined);
    setLotId(undefined);
  }

  function handleRecorteChange(id: RecorteId) {
    setRecorteId(id);
    setMomentoId(undefined);
    setVacinaId(undefined);
    setDoseId(undefined);
    setLotId(undefined);
  }

  function handleMomentoChange(id: string) {
    setMomentoId(id);
    setVacinaId(undefined);
    setDoseId(undefined);
    setLotId(undefined);
  }

  function handleVaccineChange(id: string) {
    setVacinaId(id);
    setDoseId(undefined);
    setLotId(undefined);
  }

  function handleReiniciar() {
    setStep('pesquisar');
    setCpf('');
    setPatient(null);
    setBookletRecords([]);
    setBookletError('');
    setMomentoId(undefined);
    setVacinaId(undefined);
    setDoseId(undefined);
    setLotId(undefined);
    setProfissionalId(undefined);
    setFilterChoice('nao');
    setDataAplicacao(getTodayDateString());
    setRegistrationError('');
    setEmptyLotMessage('');
  }

  async function handleCadastrar() {
    if (!patient || !vacinaAtual || !doseId || !loteAtual || !canSubmitApplication({
      applicationDate: dataAplicacao,
      lot: loteAtual,
      professional: profissionalAplicou,
      unit: unidade,
      expectedUnit: UNIT_NAME,
    })) {
      setRegistrationError('Revise os dados da aplicação antes de registrar.');
      return;
    }

    setRegistrationError('');
    setEmptyLotMessage('');
    setIsRegistering(true);

    try {
      await registerApplication({
        patientCpf: patient.cpfFormatted,
        patientName: patient.name,
        recorteId: recorteParaAplicacao.id,
        momentoId: momentoAtual?.id ?? '',
        momentoLabel: momentoAtual?.label ?? 'Não informado',
        vaccineId: vacinaAtual.id,
        vaccineName: vacinaAtual.name,
        doseId,
        doseLabel: vacinaAtual.doses.find((dose) => dose.id === doseId)?.label ?? 'Não informado',
        lotId: loteAtual.id,
        lotCode: loteAtual.code,
        applicationDate: dataAplicacao,
        professionalId: profissionalAplicou.id,
        professionalName: profissionalAplicou.name,
        professionalCrm: crmAplicou,
        unit: unidade,
      });

      const updatedLots = getLots();
      const updatedLot = updatedLots.find((lot) => lot.id === loteAtual.id);
      setLots(updatedLots);

      if (updatedLot?.quantity === 0) {
        setEmptyLotMessage(EMPTY_LOT_MESSAGE);
      }

      setStep('concluido');
    } catch {
      setRegistrationError('Não foi possível registrar a aplicação. Tente novamente.');
    } finally {
      setIsRegistering(false);
    }
  }

  const podeRevisar = Boolean(
    vacinaId &&
    doseId &&
    canSubmitApplication({
      applicationDate: dataAplicacao,
      lot: loteAtual,
      professional: profissionalAplicou,
      unit: unidade,
      expectedUnit: UNIT_NAME,
    }),
  );

  return (
  <div className="w-full max-w-5xl">
      <div className="mb-10 sm:mb-14">
        <p className="text-sm text-gray-500">Aplicações</p>
        <h1 className="text-2xl font-bold text-gray-800">Registro e acompanhamento de aplicações</h1>
        <p className="mt-1 text-sm text-gray-500">Pesquise o paciente para visualizar ou aplicar uma dose.</p>
      </div>

      {step === 'pesquisar' && (
        <Card>
          <div className="mt-2 flex items-center gap-2 text-emerald-700">
            <SearchOutlined />
            <h2 className="font-semibold text-gray-900">Pesquisar paciente</h2>
          </div>
          <p className="mt-1 text-sm text-gray-500">Informe o CPF do paciente para localizar.</p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              value={cpf}
              onChange={(event) => setCpf(maskCPF(event.target.value))}
              placeholder="000.000.000-00"
              inputMode="numeric"
              className="w-full flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={!cpf.trim()}
              className="rounded-lg bg-emerald-300 px-5 py-2 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Pesquisar
            </button>
          </div>
        </Card>
      )}

      {step === 'paciente' && (
        <Card>
          <h2 className="mb-4 font-semibold text-gray-900">Paciente encontrado</h2>

          {patient ? (
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <UserOutlined />
                </span>
                <div>
                  <p className="font-semibold text-gray-900">{patient.name}</p>
                  <p className="text-sm text-gray-500">CPF: {patient.cpfFormatted}</p>
                  <p className="text-sm text-gray-500">{patient.age} anos</p>
                </div>
              </div>

              {patient.hasCaderneta ? (
                <>
                  {!hasApplications && (
                    <Alert
                      className="mt-4"
                      type="warning"
                      showIcon
                      message="Paciente não possui aplicações registradas"
                      description="Ainda não há aplicações registradas para este paciente."
                    />
                  )}
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleVisualizarCaderneta}
                      disabled={bookletLoading}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {bookletLoading ? 'Carregando caderneta...' : 'Visualizar caderneta'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setRegistrationError(''); setStep('aplicar'); }}
                      className="rounded-lg bg-emerald-300 px-5 py-2 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400"
                    >
                      Aplicar vacina
                    </button>
                  </div>
                </>
              ) : (
                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  Cidadão ainda não possui caderneta registrada.{' '}
                  <Link to="/cadernetas" className="font-medium underline">
                    Cadastre a caderneta
                  </Link>{' '}
                  antes de registrar uma aplicação.
                </div>
              )}
            </div>
          ) : (
            <div>
              <Alert
                type="warning"
                showIcon
                message="Cidadão não encontrado"
                description="Verifique o CPF informado e tente novamente."
              />
              <button
                type="button"
                onClick={handleVoltarPesquisa}
                className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Voltar
              </button>
            </div>
          )}
        </Card>
      )}

      {step === 'visualizar' && patient && (
        <div>
          {bookletError && (
            <Alert
              className="mb-4"
              type="error"
              showIcon
              message={bookletError}
            />
          )}
          <VaccinationBookletView
            patient={patient}
            records={bookletRecords}
            onBack={() => setStep('paciente')}
          />
        </div>
      )}

      {step === 'aplicar' && (
        <Card>
          <h2 className="mb-4 font-semibold text-gray-900">Dados da aplicação</h2>

          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-800">Deseja selecionar filtro?</p>
            <p className="mt-1 text-xs text-gray-500">O filtro organiza as opções de acordo com o recorte escolhido.</p>
            <div className="mt-3 flex gap-2">
              {(['sim', 'nao'] as FilterChoice[]).map((choice) => (
                <button
                  key={choice}
                  type="button"
                  onClick={() => handleFilterChange(choice)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                    filterChoice === choice
                      ? 'bg-emerald-950 text-white'
                      : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {choice === 'sim' ? 'Sim' : 'Não'}
                </button>
              ))}
            </div>
          </div>

          {filterChoice === 'sim' && (
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">Filtro</label>
              <Select
                value={recorteId}
                onChange={handleRecorteChange}
                className="w-full"
                options={RECORTES.filter((recorte) => recorte.id !== 'anual').map((recorte) => ({
                  value: recorte.id,
                  label: recorte.label,
                }))}
              />
            </div>
          )}

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Momento</label>
              <Select
                value={momentoId}
                onChange={handleMomentoChange}
                placeholder="Selecione"
                className="w-full"
                options={momentosDisponiveis.map((momento) => ({
                  value: momento.id,
                  label: momento.label,
                }))}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Vacina</label>
              <Select
                value={vacinaId}
                onChange={handleVaccineChange}
                placeholder="Selecione"
                disabled={!momentoId}
                className="w-full"
                options={momentoAtual?.vaccines.map((vacina) => ({
                  value: vacina.id,
                  label: vacina.network === 'privada' ? `${vacina.name} — Opcional` : vacina.name,
                }))}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Dose</label>
              <Select
                value={doseId}
                onChange={setDoseId}
                placeholder="Selecione"
                disabled={!vacinaAtual}
                className="w-full"
                options={vacinaAtual?.doses.map((dose) => ({
                  value: dose.id,
                  label: dose.label,
                }))}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Lote</label>
              <Select
                value={lotId}
                onChange={setLotId}
                placeholder={vacinaId ? 'Selecione o lote' : 'Selecione a vacina primeiro'}
                disabled={!vacinaId}
                className="w-full"
                options={lotesDisponiveis.map((lot) => ({
                  value: lot.id,
                  label: `${lot.code} — ${lot.manufacturer} — ${lot.quantity} doses`,
                }))}
              />
              {vacinaId && lotesDisponiveis.length === 0 && (
                <p className="mt-1 text-xs text-amber-700">Não há lotes disponíveis para esta vacina.</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Data da aplicação</label>
              <input
                type="date"
                value={dataAplicacao}
                min={minApplicationDate}
                max={maxApplicationDate}
                onChange={(event) => setDataAplicacao(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Profissional que aplicou</label>
              <Select
                value={profissionalAplicou.id}
                onChange={setProfissionalId}
                className="w-full"
                options={MOCK_PROFESSIONALS.map((professional) => ({
                  value: professional.id,
                  label: professional.name,
                }))}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">CRM do profissional que aplicou</label>
              <input
                value={crmAplicou}
                readOnly
                inputMode="numeric"
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Unidade de saúde</label>
              <div className="flex min-h-10 items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700">
                {unidade}
              </div>
            </div>
          </div>

          {!dataAplicacao || dataAplicacao < minApplicationDate || dataAplicacao > maxApplicationDate ? (
            <p className="mt-3 text-xs text-red-600">Informe uma data entre 01/01/1900 e hoje.</p>
          ) : null}

          {loteAtual && (
            <div className="mt-4 flex gap-2 rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-800">
              <InfoCircleOutlined className="mt-0.5" />
              <span><strong>{loteAtual.code}</strong> possui {loteAtual.quantity} doses disponíveis.</span>
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={() => setStep('paciente')}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Voltar
            </button>
            <button
              type="button"
              onClick={() => { setRegistrationError(''); setStep('revisao'); }}
              disabled={!podeRevisar}
              className="rounded-lg bg-emerald-950 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Revisar aplicação
            </button>
          </div>
        </Card>
      )}

      {step === 'revisao' && patient && (
        <Card>
          <div className="mb-4 flex items-center gap-2 text-emerald-700">
            <CheckCircleFilled />
            <h2 className="font-semibold text-gray-900">Revisão da aplicação</h2>
          </div>

          <dl className="flex flex-col divide-y divide-gray-100 text-sm">
            <Row label="Paciente" value={patient.name} />
            <Row label="Vacina" value={vacinaAtual?.name ?? 'Não informado'} />
            <Row
              label="Dose"
              value={vacinaAtual?.doses.find((d) => d.id === doseId)?.label ?? '—'}
            />
            <Row label="Lote" value={loteAtual?.code ?? '—'} />
            <Row label="Data da aplicação" value={dataAplicacao} />
            <Row label="Profissional que aplicou" value={profissionalAplicou.name} />
            <Row label="CRM" value={crmAplicou || 'Não identificado'} />
            <Row label="Unidade" value={unidade} />
          </dl>

          {registrationError && (
            <Alert
              className="mt-4"
              type="error"
              showIcon
              message={registrationError}
            />
          )}

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={() => { setRegistrationError(''); setStep('aplicar'); }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Alterar
            </button>
            <button
              type="button"
              onClick={handleCadastrar}
              disabled={isRegistering}
              className="rounded-lg bg-emerald-950 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRegistering ? 'Registrando aplicação' : 'Registrar'}
            </button>
          </div>
        </Card>
      )}

      {step === 'concluido' && patient && (
        <Card>
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
              <CheckOutlined />
            </span>
            <h2 className="text-lg font-bold text-gray-900">Aplicação registrada</h2>
            <p className="text-sm text-gray-500">
              Aplicação de vacina registrada com sucesso.
            </p>
            {emptyLotMessage && (
              <Alert
                className="mt-2 w-full text-left"
                type="warning"
                showIcon
                message={emptyLotMessage}
              />
            )}
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={handleReiniciar}
                className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Nova aplicação
              </button>
              <Link
                to="/historico"
                className="rounded-lg bg-emerald-300 px-5 py-2 text-center text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400"
              >
                Ver histórico
              </Link>
            </div>
          </div>
        </Card>
      )}

    </div>
  );
}

export default Aplicacoes;
