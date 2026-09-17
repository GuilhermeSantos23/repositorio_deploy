import { useState, type ReactNode } from 'react';
import {
  SearchOutlined,
  UserOutlined,
  CheckCircleFilled,
  CheckOutlined,
} from '@ant-design/icons';
import { Select, Radio, Input, Alert } from 'antd';
import { maskCPF } from '../../utils/masks';
import { RECORTES } from '../../data/vaccinesData';
import { UNIT_NAME, type Patient } from '../../data/mockPatients';
import { MOCK_PROFESSIONALS } from '../../data/mockProfessionals';
import { SENSITIVE_CONDITIONS, type RecorteId, type SensitiveCondition } from '../../types/vaccine';
import type { VaccinationRecord } from '../../types/vaccinationRecord';
import VaccinationBookletView from '../../components/VaccinationBookletView';
import { findPatientByCpf } from '../../services/cpfService';
import { getPatientBooklet, saveBookletRecord, updateBookletRecord } from '../../services/cadernetaService';
import { registerCadernetaRegistration } from '../../services/dashboardService';
import { isValidApplicationDate } from '../../utils/dateRules';
import { useUser } from '../../hooks/useUser';

// Mesma regra usada em Aplicações: o profissional inicia com quem está
// logado (comparando o nome sem o prefixo Dr./Dra.), podendo ser trocado
// por outro profissional da unidade.
function normalizeName(name: string) {
  return name.replace(/^(dr\.?|dra\.?)\s+/i, '').trim().toLowerCase();
}

type Step = 'pesquisar' | 'paciente' | 'cadastro' | 'revisao' | 'concluido';

type TipoRegistro = 'aplicada' | 'nao-realizada';

// Estrutura do registro usada pelo fluxo atual e preparada para o
// futuro envio ao backend.
interface RegistroCaderneta {
  recorteId: RecorteId;
  momentoId: string;
  vacinaId: string;
  vacinaNome: string;
  tipo: TipoRegistro;
  condicaoSensivel?: SensitiveCondition;
  doseId?: string;
  doseLabel?: string;
  data?: string;
  unidade?: string;
  profissional?: string;
  crm?: string;
  justificativaNaoRealizada?: string;
}

const STEP_LABELS: { key: Step; label: string }[] = [
  { key: 'pesquisar', label: 'Pesquisar' },
  { key: 'paciente', label: 'Paciente' },
  { key: 'cadastro', label: 'Cadastro' },
  { key: 'revisao', label: 'Revisão' },
];

function StepIndicator({ current }: { current: Step }) {
  const currentIndex = STEP_LABELS.findIndex((step) => step.key === current);

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      {STEP_LABELS.map((step, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step.key} className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                isDone
                  ? 'bg-emerald-600 text-white'
                  : isCurrent
                    ? 'bg-emerald-950 text-white'
                    : 'bg-gray-200 text-gray-500'
              }`}
            >
              {isDone ? <CheckOutlined className="text-[10px]" /> : index + 1}
            </span>
            <span
              className={`text-sm ${isCurrent ? 'font-semibold text-gray-900' : 'text-gray-500'}`}
            >
              {step.label}
            </span>
            {index < STEP_LABELS.length - 1 && (
              <span className="mx-1 h-px w-6 bg-gray-200" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">{children}</div>
  );
}

function Caderneta() {
  const [step, setStep] = useState<Step>('pesquisar');
  const [bookletMode, setBookletMode] = useState<'none' | 'view' | 'select-edit'>('none');
  const [selectedRecord, setSelectedRecord] = useState<VaccinationRecord | null>(null);
  const [bookletRecords, setBookletRecords] = useState<VaccinationRecord[]>([]);

  const [cpf, setCpf] = useState('');
  const [searched, setSearched] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);

  const [recorteId, setRecorteId] = useState<RecorteId>(RECORTES[0].id);
  const [momentoId, setMomentoId] = useState<string | undefined>();
  const [tipo, setTipo] = useState<TipoRegistro>('aplicada');
  const [vacinaId, setVacinaId] = useState<string | undefined>();
  const [doseId, setDoseId] = useState<string | undefined>();
  const [data, setData] = useState('');
  // A unidade é fixa (UBS Pimentas). O profissional inicia com o
  // profissional logado, mas pode ser trocado por outro da mesma unidade —
  // o CRM sempre acompanha automaticamente quem estiver selecionado.
  const { userName } = useUser();
  const [profissionalId, setProfissionalId] = useState<string | undefined>();
  const [justificativaNaoRealizada, setJustificativaNaoRealizada] = useState('');

  // A condição sensível pertence ao cadastro do cidadão e pode ser atualizada
  // durante o cadastro/alteração da caderneta. Não há justificativa neste ponto.
  const [possuiCondicaoSensivel, setPossuiCondicaoSensivel] = useState<'sim' | 'nao'>('nao');
  const [condicaoSensivel, setCondicaoSensivel] = useState<SensitiveCondition | undefined>();

  const recorteAtual = RECORTES.find((recorte) => recorte.id === recorteId)!;
  const momentoAtual = recorteAtual.moments.find((momento) => momento.id === momentoId);
  const vacinaAtual = momentoAtual?.vaccines.find((vacina) => vacina.id === vacinaId);
  const loggedProfessional =
    MOCK_PROFESSIONALS.find((item) => normalizeName(item.name) === normalizeName(userName)) ??
    MOCK_PROFESSIONALS[0];
  const profissionalAtual =
    MOCK_PROFESSIONALS.find((item) => item.id === profissionalId) ?? loggedProfessional;

  // Hoje a busca usa mocks. A consulta real por CPF será integrada
  // posteriormente, preservando o restante do fluxo da tela.
  async function handleSearch() {
    const found = await findPatientByCpf(cpf);

    setPatient(found);
    setSearched(true);
    setStep('paciente');
  }

  // Usado quando o CPF pesquisado não corresponde a nenhum cidadão, para o
  // profissional não ficar preso na tela de resultado (mesma regra usada em
  // Aplicações).
  function handleVoltarPesquisa() {
    setStep('pesquisar');
    setCpf('');
    setSearched(false);
    setPatient(null);
  }

  function handleOpenCadastro() {
    setPossuiCondicaoSensivel(patient?.sensitiveCondition ? 'sim' : 'nao');
    setCondicaoSensivel(patient?.sensitiveCondition);
    setStep('cadastro');
  }

  async function handleVisualizar() {
    if (!patient?.hasCaderneta) return;
    setBookletRecords(await getPatientBooklet(patient));
    setSelectedRecord(null);
    setBookletMode('view');
  }

  async function handleIniciarAlteracao() {
    if (!patient?.hasCaderneta) return;
    setBookletRecords(await getPatientBooklet(patient));
    setSelectedRecord(null);
    setBookletMode('select-edit');
  }

  function handleEditSelected(record: VaccinationRecord) {
    setSelectedRecord(record);
    setRecorteId(record.recorteId);
    setMomentoId(record.momentoId);
    setVacinaId(record.vacinaId);
    setDoseId(record.doseId);
    setTipo(record.status);
    setData(record.data ?? '');
    setProfissionalId(
      MOCK_PROFESSIONALS.find((item) => item.name === record.profissional)?.id ??
        MOCK_PROFESSIONALS[0]?.id,
    );
    setJustificativaNaoRealizada(record.justificativa ?? '');
    setPossuiCondicaoSensivel(patient?.sensitiveCondition ? 'sim' : 'nao');
    setCondicaoSensivel(patient?.sensitiveCondition);
    setBookletMode('none');
    setStep('cadastro');
  }

  function handleRecorteChange(id: RecorteId) {
    setRecorteId(id);
    setMomentoId(undefined);
    setVacinaId(undefined);
    setDoseId(undefined);
  }

  function handleMomentoChange(id: string) {
    setMomentoId(id);
    setVacinaId(undefined);
    setDoseId(undefined);
  }

  function handleVacinaChange(id: string) {
    setVacinaId(id);
    setDoseId(undefined);
  }

  function handleReiniciar() {
    setStep('pesquisar');
    setBookletMode('none');
    setSelectedRecord(null);
    setCpf('');
    setSearched(false);
    setPatient(null);
    setBookletRecords([]);
    setMomentoId(undefined);
    setVacinaId(undefined);
    setDoseId(undefined);
    setData('');
    setProfissionalId(undefined);
    setJustificativaNaoRealizada('');
    setPossuiCondicaoSensivel('nao');
    setCondicaoSensivel(undefined);
  }

  // Monta o registro final para a futura integração com o backend.
  // Por enquanto, apenas o fluxo local é executado.
  async function handleCadastrar() {
    if (!vacinaAtual || !momentoAtual) return;

    const registro: RegistroCaderneta = {
      recorteId,
      momentoId: momentoAtual.id,
      vacinaId: vacinaAtual.id,
      vacinaNome: vacinaAtual.name,
      tipo,
      ...(possuiCondicaoSensivel === 'sim' && condicaoSensivel
        ? { condicaoSensivel }
        : {}),
      ...(tipo === 'aplicada'
        ? {
            doseId,
            doseLabel: vacinaAtual.doses.find((dose) => dose.id === doseId)?.label,
            data,
            unidade: UNIT_NAME,
            profissional: profissionalAtual?.name,
            crm: profissionalAtual?.crm,
          }
        : { justificativaNaoRealizada }),
    };

    if (!patient) return;

    const recordData = {
      patientCpf: patient.cpfFormatted,
      recorteId: registro.recorteId,
      momentoId: registro.momentoId,
      momentoLabel: momentoAtual.label,
      vacinaId: registro.vacinaId,
      vacinaNome: registro.vacinaNome,
      doseId: registro.doseId ?? '',
      doseLabel: registro.doseLabel ?? 'Não informado',
      status: registro.tipo,
      ...(registro.data ? { data: registro.data } : {}),
      ...(registro.unidade ? { unidade: registro.unidade } : {}),
      ...(registro.profissional ? { profissional: registro.profissional } : {}),
      ...(registro.crm ? { crm: registro.crm } : {}),
      ...(registro.justificativaNaoRealizada
        ? { justificativa: registro.justificativaNaoRealizada }
        : {}),
      ...(registro.condicaoSensivel ? { condicaoSensivel: registro.condicaoSensivel } : {}),
    };

    if (selectedRecord) {
      await updateBookletRecord({ id: selectedRecord.id, ...recordData });
    } else {
      await saveBookletRecord({
        patientCpf: patient.cpfFormatted,
        record: recordData,
      });
    }

    registerCadernetaRegistration();
    setStep('concluido');
  }

  const podeRevisar =
    Boolean(possuiCondicaoSensivel === 'nao' || condicaoSensivel) &&
    (tipo === 'aplicada'
      ? Boolean(vacinaId && doseId && (!data || isValidApplicationDate(data)))
      : Boolean(vacinaId && justificativaNaoRealizada.trim()));

  return (
    <div className="w-full max-w-5xl">
      <p className="text-sm text-gray-500">Cadernetas</p>
      <h1 className="text-2xl font-bold text-gray-800">
        {patient?.hasCaderneta ? 'Alteração de caderneta' : 'Cadastro de caderneta'}
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Localize o cidadão e registre as informações da caderneta.
      </p>

      {bookletMode !== 'none' && patient && (
        <VaccinationBookletView
          patient={patient}
          records={bookletRecords}
          selectionMode={bookletMode === 'select-edit'}
          onBack={() => setBookletMode('none')}
          onEditSelected={handleEditSelected}
        />
      )}

      {bookletMode === 'none' && <div className="mt-6">
        <StepIndicator current={step} />
      </div>}

      {bookletMode === 'none' && step === 'pesquisar' && (
        <Card>
          <div className="flex items-center gap-2 text-emerald-700">
            <SearchOutlined />
            <h2 className="font-semibold text-gray-900">Pesquisar cidadão</h2>
          </div>
          <p className="mt-1 text-sm text-gray-500">Informe o CPF do cidadão.</p>

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

          {searched && !patient && (
            <p className="mt-3 text-sm text-gray-500">
              Cidadão não encontrado. Verifique o CPF informado e tente novamente.
            </p>
          )}
        </Card>
      )}

      {bookletMode === 'none' && step === 'paciente' && (
        <Card>
          <h2 className="mb-4 font-semibold text-gray-900">Cidadão encontrado</h2>

          {patient ? (
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <UserOutlined />
                </span>
                <div>
                  <p className="font-semibold text-gray-900">{patient.name}</p>
                  <p className="text-sm text-gray-500">
                    CPF {patient.cpfFormatted} · {patient.age} anos
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {patient.hasCaderneta ? (
                  <>
                    <button
                      type="button"
                      onClick={handleVisualizar}
                      className="rounded-lg bg-emerald-950 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-900"
                    >
                      Visualizar
                    </button>
                    <button
                      type="button"
                      onClick={handleIniciarAlteracao}
                      className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      Alterar
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleOpenCadastro}
                    className="rounded-lg bg-emerald-300 px-5 py-2 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400"
                  >
                    Cadastrar caderneta
                  </button>
                )}
              </div>
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

      {bookletMode === 'none' && step === 'cadastro' && (
        <div className="flex flex-col gap-4">
          <Card>
            <h2 className="mb-3 font-semibold text-gray-900">
              O cidadão possui condição sensível?
            </h2>
            <Select
              value={possuiCondicaoSensivel}
              onChange={(value) => {
                setPossuiCondicaoSensivel(value);
                if (value === 'nao') setCondicaoSensivel(undefined);
              }}
              className="w-full sm:w-64"
              options={[
                { value: 'nao', label: 'Não' },
                { value: 'sim', label: 'Sim' },
              ]}
            />

            {possuiCondicaoSensivel === 'sim' && (
              <div className="mt-4">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Condição sensível
                </label>
                <Select
                  value={condicaoSensivel}
                  onChange={setCondicaoSensivel}
                  placeholder="Selecione a condição"
                  className="w-full sm:w-80"
                  options={SENSITIVE_CONDITIONS.map((condition) => ({
                    value: condition,
                    label: condition,
                  }))}
                />
              </div>
            )}
          </Card>

          <Card>
            <h2 className="mb-3 font-semibold text-gray-900">Caderneta inteligente</h2>

            <div className="flex flex-wrap gap-1 border-b border-gray-100 pb-2">
              {RECORTES.map((recorte) => (
                <button
                  key={recorte.id}
                  type="button"
                  onClick={() => handleRecorteChange(recorte.id)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                    recorte.id === recorteId
                      ? 'bg-emerald-950 text-white'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {recorte.label}
                </button>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Momento</label>
                <Select
                  value={momentoId}
                  onChange={handleMomentoChange}
                  placeholder="Selecione"
                  className="w-full"
                  options={recorteAtual.moments.map((momento) => ({
                    value: momento.id,
                    label: momento.label,
                  }))}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Tipo de registro
                </label>
                <Radio.Group
                  value={tipo}
                  onChange={(event) => setTipo(event.target.value)}
                  optionType="button"
                  buttonStyle="solid"
                  options={[
                    { value: 'aplicada', label: 'Vacina aplicada' },
                    { value: 'nao-realizada', label: 'Vacina não realizada' },
                  ]}
                />
              </div>
            </div>

            {momentoId && (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Vacina</label>
                  <Select
                    value={vacinaId}
                    onChange={handleVacinaChange}
                    placeholder="Selecione"
                    className="w-full"
                    options={momentoAtual?.vaccines.map((vacina) => ({
                      value: vacina.id,
                      label:
                        vacina.network === 'privada'
                          ? `${vacina.name} — Opcional`
                          : vacina.name,
                    }))}
                  />
                </div>

                {tipo === 'aplicada' && (
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
                )}
              </div>
            )}

            {vacinaId && tipo === 'nao-realizada' && (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="mb-2 text-sm font-medium text-amber-900">
                  Este registro marca a vacina como não realizada — não é uma aplicação.
                </p>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Justificativa
                </label>
                <Input.TextArea
                  value={justificativaNaoRealizada}
                  onChange={(event) => setJustificativaNaoRealizada(event.target.value)}
                  rows={3}
                  placeholder="Explique por que a vacina não foi aplicada."
                />
              </div>
            )}

            {vacinaId && tipo === 'aplicada' && (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Data (opcional)
                  </label>
                  <input
                    type="date"
                    min="1900-01-01"
                    max={new Date().toISOString().slice(0, 10)}
                    value={data}
                    onChange={(event) => setData(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Unidade</label>
                  <input
                    value={UNIT_NAME}
                    disabled
                    className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Profissional responsável
                  </label>
                  <Select
                    value={profissionalId ?? loggedProfessional.id}
                    onChange={setProfissionalId}
                    placeholder="Selecione o profissional"
                    className="w-full"
                    options={MOCK_PROFESSIONALS.map((item) => ({ value: item.id, label: item.name }))}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    CRM do profissional
                  </label>
                  <input
                    value={profissionalAtual?.crm ?? 'Não identificado'}
                    disabled
                    className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600"
                  />
                </div>
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
                onClick={() => setStep('revisao')}
                disabled={!podeRevisar}
                className="rounded-lg bg-emerald-950 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Revisar
              </button>
            </div>
          </Card>
        </div>
      )}

      {bookletMode === 'none' && step === 'revisao' && patient && (
        <Card>
          <div className="mb-4 flex items-center gap-2 text-emerald-700">
            <CheckCircleFilled />
            <h2 className="font-semibold text-gray-900">Revisão antes do cadastro</h2>
          </div>
          <p className="mb-4 text-sm text-gray-500">Confira as informações antes de concluir.</p>

          <dl className="flex flex-col divide-y divide-gray-100 text-sm">
            <Row label="Cidadão" value={patient.name} />
            <Row
              label="Possui condição sensível"
              value={possuiCondicaoSensivel === 'sim' ? 'Sim' : 'Não'}
            />
            {possuiCondicaoSensivel === 'sim' && (
              <Row label="Condição sensível" value={condicaoSensivel || 'Não informado'} />
            )}
            <Row label="Recorte" value={recorteAtual.label} />
            <Row label="Momento" value={momentoAtual?.label ?? 'Não informado'} />
            <Row label="Vacina" value={vacinaAtual?.name ?? 'Não informado'} />
            <Row
              label="Tipo de registro"
              value={tipo === 'aplicada' ? 'Vacina aplicada' : 'Vacina não realizada'}
            />
            {tipo === 'aplicada' ? (
              <>
                <Row
                  label="Dose"
                  value={vacinaAtual?.doses.find((d) => d.id === doseId)?.label ?? '—'}
                />
                <Row label="Data" value={data || 'Não informada'} />
                <Row label="Unidade" value={UNIT_NAME} />
                <Row label="Profissional" value={profissionalAtual?.name ?? 'Não identificado'} />
                <Row label="CRM" value={profissionalAtual?.crm ?? 'Não identificado'} />
              </>
            ) : (
              <Row label="Justificativa" value={justificativaNaoRealizada} />
            )}
          </dl>

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={handleOpenCadastro}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Alterar
            </button>
            <button
              type="button"
              onClick={handleCadastrar}
              className="rounded-lg bg-emerald-950 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-900"
            >
              {patient.hasCaderneta ? 'Alterar' : 'Cadastrar'}
            </button>
          </div>
        </Card>
      )}

      {bookletMode === 'none' && step === 'concluido' && patient && (
        <Card>
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
              <CheckOutlined />
            </span>
            <h2 className="text-lg font-bold text-gray-900">Registro concluído</h2>
            <p className="text-sm text-gray-500">
              {patient.name} teve sua caderneta{' '}
              {patient.hasCaderneta ? 'alterada' : 'cadastrada'} com sucesso.
            </p>
            <button
              type="button"
              onClick={handleReiniciar}
              className="mt-2 rounded-lg bg-emerald-300 px-5 py-2 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400"
            >
              Voltar ao início
            </button>
          </div>
        </Card>
      )}
    </div>
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

export default Caderneta;
