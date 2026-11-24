import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MailOutlined } from '@ant-design/icons';
import AuthLayout from '../../layouts/AuthLayout/AuthLayout';
import FormField from '../../components/form/FormField/FormField';
import ValidationOverlay from '../../components/common/ValidationOverlay/ValidationOverlay';
import { maskCPF, maskNumeric } from '../../utils/masks';

type Etapa = 'identificador' | 'codigo';
type ValidationStep = 'idle' | 'validating' | 'success';

// Como ainda não existe backend, este fluxo não valida CPF/código de
// verdade: qualquer preenchimento válido (campos não vazios) é aceito
// ("tudo dá certo"). O backend futuramente será responsável por localizar
// o administrador pelo CPF e gerar/enviar/validar o código por e-mail.
// Depois do código validado, o usuário entra no sistema. Não há tela de
// criar uma nova senha.
function EsqueciSenha() {
  const [etapa, setEtapa] = useState<Etapa>('identificador');
  const [validationStep, setValidationStep] = useState<ValidationStep>('idle');

  const [cpf, setCpf] = useState('');
  const [cpfErro, setCpfErro] = useState('');

  const [codigo, setCodigo] = useState('');
  const [codigoErro, setCodigoErro] = useState('');

  const navigate = useNavigate();

  function avancarComValidacao(proximaEtapa: Etapa) {
    setValidationStep('validating');
    window.setTimeout(() => {
      setValidationStep('success');
      window.setTimeout(() => {
        setValidationStep('idle');
        setEtapa(proximaEtapa);
      }, 800);
    }, 900);
  }

  function entrarNoSistema() {
    setValidationStep('validating');
    window.setTimeout(() => {
      setValidationStep('success');
      window.setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 800);
    }, 900);
  }

  function handleSubmitIdentificador(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!cpf.trim()) {
      setCpfErro('Informe o CPF cadastrado.');
      return;
    }

    setCpfErro('');
    avancarComValidacao('codigo');
  }

  function handleSubmitCodigo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!codigo.trim()) {
      setCodigoErro('Informe o código recebido por e-mail.');
      return;
    }

    setCodigoErro('');
    entrarNoSistema();
  }

  const validatingTextoPorEtapa: Record<Etapa, string> = {
    identificador: 'Localizando cadastro...',
    codigo: 'Validando código...',
  };

  const successTextoPorEtapa: Record<Etapa, string> = {
    identificador: 'Código enviado por e-mail',
    codigo: 'Código correto',
  };

  return (
    <AuthLayout>
      <div className="relative">
        {etapa === 'identificador' && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Esqueci a senha</h2>
            <p className="mt-1 text-sm text-gray-500">
              Informe o CPF cadastrado para enviarmos um código de verificação
              para o e-mail associado à conta.
            </p>

            <form
              onSubmit={handleSubmitIdentificador}
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
                error={cpfErro}
              />

              <button
                type="submit"
                className="mt-2 w-full rounded-lg bg-emerald-300 py-3 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400"
              >
                Enviar código
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

        {etapa === 'codigo' && (
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

            <form onSubmit={handleSubmitCodigo} className="mt-6 flex flex-col gap-4" noValidate>
              <FormField
                label="Código de verificação"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={codigo}
                onChange={(event) => setCodigo(maskNumeric(event.target.value, 6))}
                error={codigoErro}
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

        {validationStep !== 'idle' && (
          <ValidationOverlay
            status={validationStep === 'validating' ? 'validating' : 'success'}
            validatingText={validatingTextoPorEtapa[etapa]}
            successText={successTextoPorEtapa[etapa]}
          />
        )}
      </div>
    </AuthLayout>
  );
}

export default EsqueciSenha;
