import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import AuthLayout from '../../layouts/AuthLayout/AuthLayout';
import FormField from '../../components/form/FormField/FormField';
import ValidationOverlay from '../../components/common/ValidationOverlay/ValidationOverlay';
import { maskCPF, maskNumeric } from '../../utils/masks';

// Fluxo completo de recuperação de senha:
// Login -> Esqueci minha senha -> Informar CPF -> Receber código ->
// Informar código -> Criar nova senha -> Confirmação de sucesso ->
// Voltar para Login.
//
// Como ainda não existe backend, cada etapa só simula uma validação
// (nenhum CPF/código real é checado) e usa o mesmo overlay de
// "validando -> sucesso" já usado no Login. Ao final, o profissional
// volta para a tela de Login (não é logado automaticamente).
type Step = 'cpf' | 'codigo' | 'novaSenha' | 'sucesso';
type Phase = 'form' | 'validating' | 'success';

interface StepMessages {
  validatingText: string;
  successText: string;
}

function EsqueciSenha() {
  const [step, setStep] = useState<Step>('cpf');
  const [phase, setPhase] = useState<Phase>('form');
  const [pendingStep, setPendingStep] = useState<Step | null>(null);
  const [messages, setMessages] = useState<StepMessages>({
    validatingText: '',
    successText: '',
  });

  const [cpf, setCpf] = useState('');
  const [cpfError, setCpfError] = useState('');

  const [codigo, setCodigo] = useState('');
  const [codigoError, setCodigoError] = useState('');

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [senhaError, setSenhaError] = useState('');

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
        if (pendingStep) {
          setStep(pendingStep);
          setPendingStep(null);
        }
        setPhase('form');
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [phase, pendingStep]);

  function goToNextStep(next: Step, stepMessages: StepMessages) {
    setMessages(stepMessages);
    setPendingStep(next);
    setPhase('validating');
  }

  function handleSubmitCpf(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!cpf.trim()) {
      setCpfError('CPF é obrigatório.');
      return;
    }

    setCpfError('');
    goToNextStep('codigo', {
      validatingText: 'Verificando CPF...',
      successText: 'Enviamos um código para o email cadastrado',
    });
  }

  function handleSubmitCodigo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!codigo.trim()) {
      setCodigoError('Informe o código recebido por email.');
      return;
    }

    setCodigoError('');
    goToNextStep('novaSenha', {
      validatingText: 'Validando código...',
      successText: 'Código correto',
    });
  }

  function handleSubmitNovaSenha(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!novaSenha.trim() || !confirmarSenha.trim()) {
      setSenhaError('Preencha a nova senha e a confirmação.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setSenhaError('As senhas não coincidem.');
      return;
    }

    setSenhaError('');
    goToNextStep('sucesso', {
      validatingText: 'Salvando nova senha...',
      successText: 'Senha alterada com sucesso',
    });
  }

  function handleVoltarParaLogin() {
    navigate('/login', { replace: true });
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
            Informe seu CPF para receber um código de verificação no email cadastrado.
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

  if (step === 'novaSenha') {
    return (
      <AuthLayout>
        <div>
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-xl text-emerald-700">
            <LockOutlined />
          </span>

          <h2 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
            Criar nova senha
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Escolha uma nova senha para acessar sua conta.
          </p>

          <form onSubmit={handleSubmitNovaSenha} className="mt-6 flex flex-col gap-4" noValidate>
            <FormField
              label="Nova senha"
              type="password"
              value={novaSenha}
              onChange={(event) => setNovaSenha(event.target.value)}
            />

            <FormField
              label="Confirmar nova senha"
              type="password"
              value={confirmarSenha}
              onChange={(event) => setConfirmarSenha(event.target.value)}
              error={senhaError}
            />

            <button
              type="submit"
              className="mt-2 w-full rounded-lg bg-emerald-300 py-3 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400"
            >
              Salvar nova senha
            </button>
          </form>
        </div>
      </AuthLayout>
    );
  }

  // step === 'sucesso'
  return (
    <AuthLayout>
      <div className="flex flex-col items-center text-center">
        <svg
          viewBox="0 0 52 52"
          className="h-14 w-14"
          fill="none"
          stroke="#059669"
          strokeWidth="3"
        >
          <circle cx="26" cy="26" r="23" />
          <path d="M15 27 L23 35 L38 18" />
        </svg>

        <h2 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
          Senha redefinida com sucesso!
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Sua senha foi alterada. Use a nova senha na próxima vez que entrar no sistema.
        </p>

        <button
          type="button"
          onClick={handleVoltarParaLogin}
          className="mt-6 w-full rounded-lg bg-emerald-300 py-3 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400"
        >
          Voltar para o Login
        </button>
      </div>
    </AuthLayout>
  );
}

export default EsqueciSenha;
