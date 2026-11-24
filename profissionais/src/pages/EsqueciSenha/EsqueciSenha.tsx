import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MailOutlined } from '@ant-design/icons';
import AuthLayout from '../../layouts/AuthLayout/AuthLayout';
import FormField from '../../components/form/FormField/FormField';
import ValidationOverlay from '../../components/common/ValidationOverlay/ValidationOverlay';
import { maskCPF, maskNumeric } from '../../utils/masks';
import { login, requestAccessCode, verifyAccessCode } from '../../services/authService';

// Recuperação de acesso:
// Login -> Esqueci minha senha -> Informar CPF -> Receber código ->
// Informar código -> se o código estiver correto, entra direto no perfil.
// Não existe etapa de troca de senha.
//
// Hoje o envio e a conferência do código são simulados em authService; quando
// o backend existir, só aquele serviço precisa ser trocado. Na primeira
// etapa são pedidos o CPF e o código da unidade, como no Login.
type Step = 'cpf' | 'codigo';
type Phase = 'form' | 'validating' | 'success';

interface StepMessages {
  validatingText: string;
  successText: string;
}

function EsqueciSenha() {
  const [step, setStep] = useState<Step>('cpf');
  const [phase, setPhase] = useState<Phase>('form');
  const [pendingStep, setPendingStep] = useState<Step | null>(null);
  const [enterAfter, setEnterAfter] = useState(false);
  const [messages, setMessages] = useState<StepMessages>({
    validatingText: '',
    successText: '',
  });

  const [cpf, setCpf] = useState('');
  const [cpfError, setCpfError] = useState('');
  const [codigoUnidade, setCodigoUnidade] = useState('');
  const [unidadeError, setUnidadeError] = useState('');

  const [codigo, setCodigo] = useState('');
  const [codigoError, setCodigoError] = useState('');

  const navigate = useNavigate();

  // Controla a transição "validando -> sucesso -> próxima etapa", igual ao
  // padrão já usado no Login, só que reutilizável para as várias etapas
  // deste fluxo.
  useEffect(() => {
    if (phase === 'validating') {
      const timer = setTimeout(() => setPhase('success'), 900);
      return () => clearTimeout(timer);
    }

    if (phase === 'success') {
      const timer = setTimeout(() => {
        if (enterAfter) {
          navigate('/home', { replace: true });
          return;
        }
        if (pendingStep) {
          setStep(pendingStep);
          setPendingStep(null);
        }
        setPhase('form');
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [phase, pendingStep, enterAfter, navigate]);

  function goToNextStep(next: Step, stepMessages: StepMessages) {
    setMessages(stepMessages);
    setPendingStep(next);
    setPhase('validating');
  }

  async function handleSubmitCpf(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cpfInvalido = cpf.replace(/\D/g, '').length !== 11;
    const unidadeInvalida = !codigoUnidade.trim();
    setCpfError(cpfInvalido ? 'Informe um CPF com 11 dígitos.' : '');
    setUnidadeError(unidadeInvalida ? 'Código da unidade é obrigatório.' : '');
    if (cpfInvalido || unidadeInvalida) return;

    await requestAccessCode(cpf, codigoUnidade);
    goToNextStep('codigo', {
      validatingText: 'Verificando CPF...',
      successText: 'Enviamos um código para o email cadastrado',
    });
  }

  async function handleSubmitCodigo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (codigo.length !== 6) {
      setCodigoError('Informe o código de 6 números recebido por email.');
      return;
    }

    if (!(await verifyAccessCode(cpf, codigoUnidade, codigo))) {
      setCodigoError('Código incorreto. Confira o código recebido e tente novamente.');
      return;
    }

    // Código correto: o profissional entra direto no seu perfil.
    setCodigoError('');
    login();
    setEnterAfter(true);
    setMessages({ validatingText: 'Validando código...', successText: 'Código correto. Entrando...' });
    setPhase('validating');
  }

  if (phase !== 'form') {
    return (
      <AuthLayout>
        <div className="relative min-h-[320px]">
          <ValidationOverlay
            status={phase === 'validating' ? 'validating' : 'success'}
            validatingText={messages.validatingText}
            successText={messages.successText}
          />
        </div>
      </AuthLayout>
    );
  }

  if (step === 'cpf') {
    return (
      <AuthLayout>
        <div>
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-xl text-emerald-700">
            <MailOutlined />
          </span>

          <h2 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
            Esqueci minha senha
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Informe seu CPF e o código da unidade para receber um código de verificação no email cadastrado.
          </p>

          <form onSubmit={handleSubmitCpf} className="mt-6 flex flex-col gap-4" noValidate>
            <FormField
              label="CPF"
              type="text"
              inputMode="numeric"
              placeholder="123.456.789-00"
              value={cpf}
              onChange={(event) => setCpf(maskCPF(event.target.value))}
              error={cpfError}
            />

            <FormField
              label="Código da unidade"
              type="text"
              inputMode="numeric"
              maxLength={8}
              value={codigoUnidade}
              onChange={(event) => setCodigoUnidade(maskNumeric(event.target.value, 8))}
              error={unidadeError}
            />

            <button
              type="submit"
              className="mt-2 w-full rounded-lg bg-emerald-300 py-3 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400"
            >
              Continuar
            </button>

            <Link
              to="/login"
              className="text-center text-sm font-medium text-emerald-700 hover:underline"
            >
              Voltar para o login
            </Link>
          </form>
        </div>
      </AuthLayout>
    );
  }

  if (step === 'codigo') {
    return (
      <AuthLayout>
        <div>
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-xl text-emerald-700">
            <MailOutlined />
          </span>

          <h2 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
            Verifique seu email
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Um código foi enviado para o email cadastrado. Informe o código abaixo para
            continuar.
          </p>

          <form onSubmit={handleSubmitCodigo} className="mt-6 flex flex-col gap-4" noValidate>
            <FormField
              label="Código de verificação"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={codigo}
              onChange={(event) => setCodigo(maskNumeric(event.target.value, 6))}
              error={codigoError}
            />

            <button
              type="submit"
              className="mt-2 w-full rounded-lg bg-emerald-300 py-3 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400"
            >
              Continuar
            </button>

            <Link
              to="/login"
              className="text-center text-sm font-medium text-emerald-700 hover:underline"
            >
              Voltar para o login
            </Link>
          </form>
        </div>
      </AuthLayout>
    );
  }

  return null;
}

export default EsqueciSenha;
