import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MailOutlined } from '@ant-design/icons';
import AuthLayout from '../../layouts/AuthLayout/AuthLayout';
import FormField from '../../components/form/FormField/FormField';
import ValidationOverlay from '../../components/common/ValidationOverlay/ValidationOverlay';
import { maskNumeric } from '../../utils/masks';

type ValidationStep = 'idle' | 'validating' | 'success';

// Como ainda não existe backend, este fluxo não verifica o código de
// verdade: qualquer código preenchido é aceito ("tudo dá certo"). O
// backend futuramente será responsável por gerar, enviar, validar e
// expirar esse código.
function EsqueciSenha() {
  const [codigo, setCodigo] = useState('');
  const [erro, setErro] = useState('');
  const [validationStep, setValidationStep] = useState<ValidationStep>('idle');

  const navigate = useNavigate();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!codigo.trim()) {
      setErro('Informe o código recebido por email.');
      return;
    }

    setErro('');
    setValidationStep('validating');
  }

  useEffect(() => {
    if (validationStep === 'validating') {
      const timer = setTimeout(() => setValidationStep('success'), 900);
      return () => clearTimeout(timer);
    }

    if (validationStep === 'success') {
      const timer = setTimeout(() => navigate('/home'), 800);
      return () => clearTimeout(timer);
    }
  }, [validationStep, navigate]);

  return (
    <AuthLayout>
      <div className="relative">
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

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
          <FormField
            label="Código de verificação"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            value={codigo}
            onChange={(event) => setCodigo(maskNumeric(event.target.value, 6))}
            error={erro}
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

        {validationStep !== 'idle' && (
          <ValidationOverlay
            status={validationStep === 'validating' ? 'validating' : 'success'}
            validatingText="Validando código..."
            successText="Código correto"
          />
        )}
      </div>
    </AuthLayout>
  );
}

export default EsqueciSenha;
