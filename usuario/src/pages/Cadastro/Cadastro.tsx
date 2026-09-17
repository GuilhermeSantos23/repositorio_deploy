import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout/AuthLayout';
import FormField from '../../components/form/FormField/FormField';
import ValidationOverlay from '../../components/common/ValidationOverlay/ValidationOverlay';
import { maskCPF, maskTelefone, maskCartaoSus } from '../../utils/masks';
import { useUser } from '../../hooks/useUser';

interface CadastroErrors {
  firstName?: string;
  lastName?: string;
  cpf?: string;
  telefone?: string;
  email?: string;
  senha?: string;
}

type ValidationStep = 'idle' | 'validating' | 'success';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Cadastro() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cpf, setCpf] = useState('');
  const [cartaoSus, setCartaoSus] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [errors, setErrors] = useState<CadastroErrors>({});
  const [validationStep, setValidationStep] = useState<ValidationStep>('idle');
  const [mensagemErroCadastro, setMensagemErroCadastro] = useState('');

  const { register } = useUser();
  const navigate = useNavigate();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const novosErros: CadastroErrors = {};
    if (!firstName.trim()) novosErros.firstName = 'Primeiro nome é obrigatório.';
    if (!lastName.trim()) novosErros.lastName = 'Sobrenome é obrigatório.';
    if (!cpf.trim()) novosErros.cpf = 'CPF é obrigatório.';
    if (!telefone.trim()) novosErros.telefone = 'Telefone é obrigatório.';
    if (!email.trim()) {
      novosErros.email = 'E-mail é obrigatório.';
    } else if (!EMAIL_REGEX.test(email)) {
      novosErros.email = 'Informe um e-mail válido.';
    }
    if (!senha.trim()) novosErros.senha = 'Senha é obrigatória.';
    // Cartão SUS é opcional, por isso não entra na validação.

    setErrors(novosErros);
    setMensagemErroCadastro('');

    // Enquanto o checkbox dos Termos de Uso não estiver marcado, o
    // cadastro não pode ser executado, mesmo que os outros campos
    // estejam preenchidos corretamente.
    if (!aceitouTermos) {
      return;
    }

    if (Object.keys(novosErros).length === 0) {
      setValidationStep('validating');
    }
  }

  // Enquanto "validating", chama o serviço de cadastro (que confere CPF
  // duplicado e salva no localStorage). Se der certo, mostra a tela de
  // sucesso e segue para o Login. Se der errado (ex: CPF já existe),
  // volta para o formulário mostrando a mensagem do serviço.
  useEffect(() => {
    if (validationStep !== 'validating') {
      return;
    }

    async function cadastrar() {
      const resultado = await register({
        firstName,
        lastName,
        cpf,
        password: senha,
        acceptedTerms: aceitouTermos,
        email,
        phone: telefone,
        susCard: cartaoSus,
      });

      if (resultado.success) {
        setValidationStep('success');
      } else {
        setValidationStep('idle');
        setMensagemErroCadastro(resultado.message);
      }
    }

    const timer = setTimeout(cadastrar, 1200);
    return () => clearTimeout(timer);
  }, [
    validationStep,
    firstName,
    lastName,
    cpf,
    senha,
    aceitouTermos,
    email,
    telefone,
    cartaoSus,
    register,
  ]);

  useEffect(() => {
    if (validationStep === 'success') {
      const timer = setTimeout(() => {
        navigate('/login', { state: { cadastroSucesso: true } });
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [validationStep, navigate]);

  return (
    <AuthLayout>
      <div className="relative">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Criar conta de cidadão
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Acesse sua caderneta vacinal digital em segundos
        </p>

        {mensagemErroCadastro && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {mensagemErroCadastro}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-4"
          noValidate
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Primeiro nome"
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              error={errors.firstName}
            />

            <FormField
              label="Sobrenome"
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              error={errors.lastName}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormField
              label="CPF"
              type="text"
              inputMode="numeric"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(event) => setCpf(maskCPF(event.target.value))}
              error={errors.cpf}
            />

            <FormField
              label="Cartão SUS"
              type="text"
              inputMode="numeric"
              placeholder="opcional"
              value={maskCartaoSus(cartaoSus)}
              onChange={(event) =>
                setCartaoSus(event.target.value.replace(/\D/g, '').slice(0, 15))
              }
            />

            <FormField
              label="Telefone"
              type="tel"
              placeholder="(00) 00000-0000"
              value={telefone}
              onChange={(event) =>
                setTelefone(maskTelefone(event.target.value))
              }
              error={errors.telefone}
            />
          </div>

          <FormField
            label="E-mail"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={errors.email}
          />

          <FormField
            label="Senha"
            type="password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            error={errors.senha}
          />

          <label className="flex items-start gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={aceitouTermos}
              onChange={(event) => setAceitouTermos(event.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            Li e concordo com os Termos de Uso
          </label>

          <p className="text-sm text-gray-600">
            Já tem conta?{' '}
            <Link
              to="/login"
              className="font-medium text-emerald-700 hover:underline"
            >
              Entre
            </Link>
          </p>

          <button
            type="submit"
            disabled={!aceitouTermos}
            className="mt-2 w-full rounded-lg bg-emerald-300 py-3 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Criar conta
          </button>
        </form>

        {(validationStep === 'validating' || validationStep === 'success') && (
          <ValidationOverlay
            status={validationStep}
            validatingText="Validando cadastro..."
            successText="Cadastro efetuado com sucesso"
          />
        )}
      </div>
    </AuthLayout>
  );
}

export default Cadastro;
