import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MailOutlined } from '@ant-design/icons';
import AuthLayout from '../../layouts/AuthLayout/AuthLayout';
import FormField from '../../components/form/FormField/FormField';
import ValidationOverlay from '../../components/common/ValidationOverlay/ValidationOverlay';
import { maskCPF, maskNumeric } from '../../utils/masks';
import {
  requestPasswordRecovery,
  verifyRecoveryCode,
  resetPassword,
} from '../../services/forgotPasswordService';

/**
 * Fluxo de recuperação de senha do administrador.
 *
 * Etapas:
 *   1. cpf         -> identifica a conta pelo CPF (login do administrador)
 *   2. codigo      -> código de verificação enviado ao e-mail cadastrado
 *   3. novaSenha    -> definição da nova senha
 *   4. sucesso      -> confirmação e retorno ao login
 *
 * Ainda não existe backend: cada etapa conversa apenas com
 * src/services/forgotPasswordService.ts (mock). Ver comentários lá
 * para o contrato esperado quando a API real existir.
 */
type Step = 'cpf' | 'codigo' | 'novaSenha' | 'sucesso';
type OverlayStatus = 'validating' | 'success';

interface OverlayConfig {
  status: OverlayStatus;
  validatingText: string;
  successText: string;
}

function EsqueciSenha() {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('cpf');
  const [overlay, setOverlay] = useState<OverlayConfig | null>(null);

  const [cpf, setCpf] = useState('');
  const [erroCpf, setErroCpf] = useState('');

  const [codigo, setCodigo] = useState('');
  const [erroCodigo, setErroCodigo] = useState('');

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erroSenha, setErroSenha] = useState('');

  // Mostra o "check" de sucesso da validação por um instante antes de
  // avançar para a próxima etapa, mantendo o mesmo padrão visual já
  // usado no restante do fluxo de autenticação.
  useEffect(() => {
    if (overlay?.status !== 'success') return;
    const timer = setTimeout(() => setOverlay(null), 700);
    return () => clearTimeout(timer);
  }, [overlay]);

  async function handleSubmitCpf(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (cpf.replace(/\D/g, '').length !== 11) {
      setErroCpf('Informe um CPF válido.');
      return;
    }

    setErroCpf('');
    setOverlay({
      status: 'validating',
      validatingText: 'Verificando CPF...',
      successText: 'Código enviado',
    });

    const result = await requestPasswordRecovery(cpf);

    if (result.success) {
      setOverlay({
        status: 'success',
        validatingText: 'Verificando CPF...',
        successText: 'Código enviado',
      });
      setTimeout(() => setStep('codigo'), 700);
    } else {
      setOverlay(null);
      setErroCpf('Não foi possível iniciar a recuperação. Verifique o CPF.');
    }
  }

  async function handleSubmitCodigo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (codigo.length !== 6) {
      setErroCodigo('Informe o código recebido por email.');
      return;
    }

    setErroCodigo('');
    setOverlay({
      status: 'validating',
      validatingText: 'Validando código...',
      successText: 'Código correto',
    });

    const result = await verifyRecoveryCode(cpf, codigo);

    if (result.success) {
      setOverlay({
        status: 'success',
        validatingText: 'Validando código...',
        successText: 'Código correto',
      });
      setTimeout(() => setStep('novaSenha'), 700);
    } else {
      setOverlay(null);
      setErroCodigo('Código inválido. Verifique e tente novamente.');
    }
  }

  async function handleSubmitNovaSenha(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!novaSenha.trim() || !confirmarSenha.trim()) {
      setErroSenha('Preencha a nova senha e a confirmação.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErroSenha('As senhas não coincidem.');
      return;
    }

    setErroSenha('');
    setOverlay({
      status: 'validating',
      validatingText: 'Salvando nova senha...',
      successText: 'Senha redefinida',
    });

    const result = await resetPassword(cpf, codigo, novaSenha);

    if (result.success) {
      setOverlay({
        status: 'success',
        validatingText: 'Salvando nova senha...',
        successText: 'Senha redefinida',
      });
      setTimeout(() => setStep('sucesso'), 700);
    } else {
      setOverlay(null);
      setErroSenha('Não foi possível salvar a nova senha. Tente novamente.');
    }
  }

  return (
    <AuthLayout>
      <div className="relative">
        {step === 'cpf' && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Esqueci minha senha
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Informe seu CPF para iniciar o processo de recuperação da senha.
            </p>

            <form
              onSubmit={handleSubmitCpf}
              className="mt-6 flex flex-col gap-4"
              noValidate
            >
              <FormField
                label="CPF"
                type="text"
                inputMode="numeric"
                placeholder="123.456.789-00"
                value={cpf}
                onChange={(event) => setCpf(maskCPF(event.target.value))}
                error={erroCpf}
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
          </>
        )}

        {step === 'codigo' && (
          <>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-xl text-emerald-700">
              <MailOutlined />
            </span>

            <h2 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
              Verifique seu email
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Um código foi enviado para o email cadastrado. Informe o código
              abaixo para continuar.
            </p>

            <form
              onSubmit={handleSubmitCodigo}
              className="mt-6 flex flex-col gap-4"
              noValidate
            >
              <FormField
                label="Código de verificação"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={codigo}
                onChange={(event) => setCodigo(maskNumeric(event.target.value, 6))}
                error={erroCodigo}
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
          </>
        )}

        {step === 'novaSenha' && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Defina uma nova senha
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Escolha uma nova senha de acesso para a sua conta.
            </p>

            <form
              onSubmit={handleSubmitNovaSenha}
              className="mt-6 flex flex-col gap-4"
              noValidate
            >
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
                error={erroSenha}
              />

              <button
                type="submit"
                className="mt-2 w-full rounded-lg bg-emerald-300 py-3 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400"
              >
                Confirmar
              </button>

              <Link
                to="/login"
                className="text-center text-sm font-medium text-emerald-700 hover:underline"
              >
                Voltar para o login
              </Link>
            </form>
          </>
        )}

        {step === 'sucesso' && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Senha redefinida
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Sua senha foi alterada com sucesso. Você já pode entrar com a
              nova senha.
            </p>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="mt-6 w-full rounded-lg bg-emerald-300 py-3 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400"
            >
              Voltar para o login
            </button>
          </>
        )}

        {overlay && (
          <ValidationOverlay
            status={overlay.status}
            validatingText={overlay.validatingText}
            successText={overlay.successText}
          />
        )}
      </div>
    </AuthLayout>
  );
}

export default EsqueciSenha;
