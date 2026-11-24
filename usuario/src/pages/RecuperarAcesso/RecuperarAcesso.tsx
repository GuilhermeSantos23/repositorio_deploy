import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CloseCircleOutlined, MailOutlined } from '@ant-design/icons';
import AuthLayout from '../../layouts/AuthLayout/AuthLayout';
import FormField from '../../components/form/FormField/FormField';
import { maskCPF, somenteDigitos } from '../../utils/masks';
import { cpfCompleto } from '../../utils/validators';
import {
  solicitarCodigoRecuperacao,
  validarCodigoRecuperacao,
} from '../../services/recuperacaoService';

type Etapa = 'cpf' | 'codigo';

const MENSAGEM_CONEXAO =
  'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';
const MENSAGEM_NAO_INTEGRADO =
  'A recuperação de acesso ainda não está disponível. Tente novamente mais tarde.';

// Recuperação de acesso: CPF -> código de 6 dígitos enviado ao e-mail
// cadastrado -> entra direto no perfil. NÃO existe etapa de nova senha
// (a senha só pode ser trocada em Configurações, já autenticado). Este
// fluxo é independente do 2FA do login.
function RecuperarAcesso() {
  const [etapa, setEtapa] = useState<Etapa>('cpf');
  const [cpf, setCpf] = useState('');
  const [codigo, setCodigo] = useState('');
  const [erroCampo, setErroCampo] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [segundosRestantes, setSegundosRestantes] = useState(0);
  const [codigoExpirado, setCodigoExpirado] = useState(false);

  const navigate = useNavigate();

  // Contagem regressiva do intervalo de reenvio (valor vindo do backend).
  useEffect(() => {
    if (segundosRestantes <= 0) {
      return;
    }
    const timer = setTimeout(
      () => setSegundosRestantes(segundosRestantes - 1),
      1000,
    );
    return () => clearTimeout(timer);
  }, [segundosRestantes]);

  // Pede o código ao backend. Serve para o primeiro envio e para o reenvio.
  async function pedirCodigo(): Promise<void> {
    setEnviando(true);
    setMensagemErro('');

    try {
      const resultado = await solicitarCodigoRecuperacao(cpf);

      if (resultado.status === 'enviado') {
        setEtapa('codigo');
        setCodigo('');
        setCodigoExpirado(false);
      } else if (resultado.status === 'aguardar') {
        setSegundosRestantes(resultado.segundos);
        setMensagemErro(
          'Aguarde o intervalo indicado para solicitar um novo código.',
        );
      } else if (resultado.status === 'erro_conexao') {
        setMensagemErro(MENSAGEM_CONEXAO);
      } else {
        setMensagemErro(MENSAGEM_NAO_INTEGRADO);
      }
    } catch {
      setMensagemErro(MENSAGEM_CONEXAO);
    } finally {
      setEnviando(false);
    }
  }

  async function handleSubmitCpf(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (enviando) {
      return;
    }

    if (!cpf.trim()) {
      setErroCampo('CPF é obrigatório.');
      return;
    }
    if (!cpfCompleto(cpf)) {
      setErroCampo('Informe um CPF válido.');
      return;
    }

    setErroCampo('');
    await pedirCodigo();
  }

  async function handleSubmitCodigo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (enviando) {
      return;
    }

    if (codigo.length !== 6) {
      setErroCampo('Digite os 6 números do código.');
      return;
    }

    setErroCampo('');
    setMensagemErro('');
    setEnviando(true);

    try {
      const resultado = await validarCodigoRecuperacao(cpf, codigo);

      if (resultado.status === 'ok') {
        // O backend confirmou o código. A sessão deve ser estabelecida
        // com a credencial devolvida por ele (pendente: o formato ainda
        // não existe). Se a sessão não estiver ativa, a rota protegida
        // devolve ao login, então ninguém entra sem confirmação.
        navigate('/home');
      } else if (resultado.status === 'invalido') {
        setErroCampo('Código inválido. Confira os números e tente de novo.');
      } else if (resultado.status === 'expirado') {
        setCodigoExpirado(true);
        setMensagemErro('O código expirou. Solicite um novo código.');
      } else if (resultado.status === 'tentativas_excedidas') {
        setMensagemErro(
          'Muitas tentativas incorretas. Solicite um novo código.',
        );
      } else if (resultado.status === 'erro_conexao') {
        setMensagemErro(MENSAGEM_CONEXAO);
      } else {
        setMensagemErro(MENSAGEM_NAO_INTEGRADO);
      }
    } catch {
      setMensagemErro(MENSAGEM_CONEXAO);
    } finally {
      setEnviando(false);
    }
  }

  function voltarParaCpf() {
    setEtapa('cpf');
    setCodigo('');
    setErroCampo('');
    setMensagemErro('');
    setCodigoExpirado(false);
  }

  const botaoClasses =
    'mt-2 w-full rounded-lg bg-emerald-300 py-3 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        Recuperar acesso
      </h2>

      {etapa === 'cpf' ? (
        <p className="mt-1 text-sm text-gray-500">
          Informe seu CPF para receber um código de verificação.
        </p>
      ) : (
        <p className="mt-1 flex items-start gap-2 text-sm text-gray-500">
          <MailOutlined className="mt-0.5" />
          Se houver uma conta com este CPF, enviamos um código de 6 números
          para o e-mail cadastrado.
        </p>
      )}

      {mensagemErro && (
        <p
          role="alert"
          className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          <CloseCircleOutlined />
          {mensagemErro}
        </p>
      )}

      {etapa === 'cpf' ? (
        <form
          onSubmit={handleSubmitCpf}
          className="mt-6 flex flex-col gap-4"
          noValidate
        >
          <FormField
            label="CPF"
            type="text"
            inputMode="numeric"
            placeholder="000.000.000-00"
            value={cpf}
            onChange={(event) => setCpf(maskCPF(event.target.value))}
            error={erroCampo}
          />

          <button type="submit" disabled={enviando} className={botaoClasses}>
            {enviando ? 'Enviando...' : 'Enviar código'}
          </button>
        </form>
      ) : (
        <form
          onSubmit={handleSubmitCodigo}
          className="mt-6 flex flex-col gap-4"
          noValidate
        >
          <FormField
            label="Código de verificação"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="000000"
            value={codigo}
            onChange={(event) =>
              setCodigo(somenteDigitos(event.target.value, 6))
            }
            error={erroCampo}
          />

          <button
            type="submit"
            disabled={enviando || codigoExpirado || codigo.length !== 6}
            className={botaoClasses}
          >
            {enviando ? 'Verificando...' : 'Confirmar código'}
          </button>

          <button
            type="button"
            onClick={pedirCodigo}
            disabled={enviando || segundosRestantes > 0}
            className="text-sm font-medium text-emerald-700 hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
          >
            {segundosRestantes > 0
              ? `Reenviar código em ${segundosRestantes}s`
              : 'Reenviar código'}
          </button>

          <button
            type="button"
            onClick={voltarParaCpf}
            className="text-sm text-gray-600 hover:underline"
          >
            Informar outro CPF
          </button>
        </form>
      )}

      <p className="mt-6 text-sm text-gray-600">
        Lembrou a senha?{' '}
        <Link
          to="/login"
          className="font-medium text-emerald-700 hover:underline"
        >
          Voltar ao login
        </Link>
      </p>
    </AuthLayout>
  );
}

export default RecuperarAcesso;
