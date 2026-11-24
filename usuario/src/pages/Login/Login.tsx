import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import AuthLayout from '../../layouts/AuthLayout/AuthLayout';
import FormField from '../../components/form/FormField/FormField';
import PasswordField from '../../components/form/PasswordField/PasswordField';
import ValidationOverlay from '../../components/common/ValidationOverlay/ValidationOverlay';
import { maskCPF } from '../../utils/masks';
import { cpfCompleto } from '../../utils/validators';
import { useUser } from '../../hooks/useUser';

interface LoginErrors {
  cpf?: string;
  senha?: string;
}

type Etapa = 'formulario' | 'enviando' | 'sucesso';

function Login() {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const [etapa, setEtapa] = useState<Etapa>('formulario');
  const [mensagemErroLogin, setMensagemErroLogin] = useState('');

  const { login } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const cadastroSucesso = Boolean(
    (location.state as { cadastroSucesso?: boolean } | null)?.cadastroSucesso,
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Evita envio duplicado enquanto a requisição está em andamento.
    if (etapa !== 'formulario') {
      return;
    }

    const novosErros: LoginErrors = {};
    if (!cpf.trim()) {
      novosErros.cpf = 'CPF é obrigatório.';
    } else if (!cpfCompleto(cpf)) {
      novosErros.cpf = 'Informe um CPF válido.';
    }
    if (!senha) novosErros.senha = 'Senha é obrigatória.';

    setErrors(novosErros);
    setMensagemErroLogin('');

    if (Object.keys(novosErros).length > 0) {
      return;
    }

    setEtapa('enviando');

    // As mensagens de erro não dizem se foi o CPF ou a senha que falhou.
    try {
      const resultado = await login(cpf, senha);

      if (resultado.success) {
        setEtapa('sucesso');
      } else {
        setEtapa('formulario');
        setMensagemErroLogin(resultado.message);
      }
    } catch {
      setEtapa('formulario');
      setMensagemErroLogin(
        'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
      );
    }
  }

  // Só navega depois que o serviço de login confirmou a autenticação.
  useEffect(() => {
    if (etapa === 'sucesso') {
      const timer = setTimeout(() => navigate('/home'), 800);
      return () => clearTimeout(timer);
    }
  }, [etapa, navigate]);

  return (
    <AuthLayout>
      <div className="relative">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Bem-vindo de volta
        </h2>
        <p className="mt-1 text-sm text-gray-500">Acesse sua conta Vac+</p>

        {cadastroSucesso && (
          <p className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            <CheckCircleOutlined />
            Cadastro efetuado com sucesso
          </p>
        )}

        {mensagemErroLogin && (
          <p
            role="alert"
            className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            <CloseCircleOutlined />
            {mensagemErroLogin}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-4"
          noValidate
        >
          <FormField
            label="CPF"
            type="text"
            inputMode="numeric"
            autoComplete="username"
            placeholder="123.456.789-00"
            value={cpf}
            onChange={(event) => setCpf(maskCPF(event.target.value))}
            error={errors.cpf}
          />

          <PasswordField
            label="Senha"
            autoComplete="current-password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            error={errors.senha}
          />

          <div className="flex flex-col gap-1 text-sm text-gray-600">
            <Link
              to="/recuperar-acesso"
              className="font-medium text-emerald-700 hover:underline"
            >
              Esqueci minha senha
            </Link>
            <p>
              Não tem conta?{' '}
              <Link
                to="/cadastro"
                className="font-medium text-emerald-700 hover:underline"
              >
                Cadastre-se
              </Link>
            </p>
          </div>

          <button
            type="submit"
            disabled={etapa !== 'formulario'}
            className="mt-2 w-full rounded-lg bg-emerald-300 py-3 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {etapa === 'enviando' ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {(etapa === 'enviando' || etapa === 'sucesso') && (
          <ValidationOverlay
            status={etapa === 'enviando' ? 'validating' : 'success'}
            validatingText="Validando dados..."
            successText="Dados corretos"
          />
        )}
      </div>
    </AuthLayout>
  );
}

export default Login;
