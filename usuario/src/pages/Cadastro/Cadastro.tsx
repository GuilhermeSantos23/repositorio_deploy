import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout/AuthLayout';
import FormField from '../../components/form/FormField/FormField';
import PasswordField from '../../components/form/PasswordField/PasswordField';
import ValidationOverlay from '../../components/common/ValidationOverlay/ValidationOverlay';
import {
  maskCEP,
  maskCPF,
  maskCartaoSus,
  maskData,
  maskTelefone,
} from '../../utils/masks';
import {
  cepValido,
  cpfValido,
  dataParaIso,
  emailValido,
  validarDataNascimento,
  validarSenha,
} from '../../utils/validators';
import { useUser } from '../../hooks/useUser';

interface CadastroErrors {
  firstName?: string;
  lastName?: string;
  cpf?: string;
  dataNascimento?: string;
  nomeMae?: string;
  nomePai?: string;
  cep?: string;
  email?: string;
  telefone?: string;
  cartaoSus?: string;
  senha?: string;
  termos?: string;
  privacidade?: string;
}

type Etapa = 'formulario' | 'enviando' | 'sucesso';

function Cadastro() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [nomeMae, setNomeMae] = useState('');
  const [nomePai, setNomePai] = useState('');
  const [cep, setCep] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cartaoSus, setCartaoSus] = useState('');
  const [senha, setSenha] = useState('');
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [cienteDaPrivacidade, setCienteDaPrivacidade] = useState(false);
  const [errors, setErrors] = useState<CadastroErrors>({});
  const [etapa, setEtapa] = useState<Etapa>('formulario');
  const [mensagemErroCadastro, setMensagemErroCadastro] = useState('');

  const { register } = useUser();
  const navigate = useNavigate();

  function validarFormulario(): CadastroErrors {
    const novosErros: CadastroErrors = {};

    if (!firstName.trim()) novosErros.firstName = 'Nome é obrigatório.';
    if (!lastName.trim()) novosErros.lastName = 'Sobrenome é obrigatório.';

    if (!cpf.trim()) {
      novosErros.cpf = 'CPF é obrigatório.';
    } else if (!cpfValido(cpf)) {
      novosErros.cpf = 'Informe um CPF válido.';
    }

    if (!dataNascimento.trim()) {
      novosErros.dataNascimento = 'Data de nascimento é obrigatória.';
    } else {
      const erroData = validarDataNascimento(dataNascimento);
      if (erroData) novosErros.dataNascimento = erroData;
    }

    if (!nomeMae.trim()) novosErros.nomeMae = 'Nome da mãe é obrigatório.';
    if (!nomePai.trim()) novosErros.nomePai = 'Nome do pai é obrigatório.';

    if (!cep.trim()) {
      novosErros.cep = 'CEP é obrigatório.';
    } else if (!cepValido(cep)) {
      novosErros.cep = 'Informe um CEP válido.';
    }

    if (!email.trim()) {
      novosErros.email = 'E-mail é obrigatório.';
    } else if (!emailValido(email)) {
      novosErros.email = 'Informe um e-mail válido.';
    }

    // Telefone e Cartão SUS são opcionais: só são conferidos se preenchidos.
    const digitosTelefone = telefone.replace(/\D/g, '');
    if (digitosTelefone && digitosTelefone.length < 10) {
      novosErros.telefone = 'Informe o telefone com DDD.';
    }
    if (cartaoSus && cartaoSus.length !== 15) {
      novosErros.cartaoSus = 'O Cartão SUS tem 15 números.';
    }

    if (!senha) {
      novosErros.senha = 'Senha é obrigatória.';
    } else {
      const erroSenha = validarSenha(senha);
      if (erroSenha) novosErros.senha = erroSenha;
    }

    if (!aceitouTermos) {
      novosErros.termos = 'É necessário aceitar os Termos de Uso.';
    }
    if (!cienteDaPrivacidade) {
      novosErros.privacidade =
        'É necessário declarar ciência da Política de Privacidade.';
    }

    return novosErros;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Evita envio duplicado enquanto a requisição está em andamento.
    if (etapa !== 'formulario') {
      return;
    }

    const novosErros = validarFormulario();
    setErrors(novosErros);
    setMensagemErroCadastro('');

    if (Object.keys(novosErros).length > 0) {
      return;
    }

    setEtapa('enviando');

    try {
      const resultado = await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        cpf,
        birthDate: dataParaIso(dataNascimento),
        motherName: nomeMae.trim(),
        fatherName: nomePai.trim(),
        cep,
        email: email.trim(),
        password: senha,
        acceptedTerms: aceitouTermos,
        acknowledgedPrivacyPolicy: cienteDaPrivacidade,
        phone: telefone,
        susCard: cartaoSus,
      });

      if (resultado.success) {
        setEtapa('sucesso');
        return;
      }

      setEtapa('formulario');
      if (resultado.code === 'cpf_duplicado') {
        setErrors({ cpf: resultado.message });
      } else {
        setMensagemErroCadastro(resultado.message);
      }
    } catch {
      setEtapa('formulario');
      setMensagemErroCadastro(
        'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
      );
    }
  }

  // Só chega aqui depois que o serviço confirmou o cadastro.
  useEffect(() => {
    if (etapa === 'sucesso') {
      const timer = setTimeout(() => {
        navigate('/login', { state: { cadastroSucesso: true } });
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [etapa, navigate]);

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
          <p
            role="alert"
            className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
          >
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
              label="Nome"
              type="text"
              autoComplete="given-name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              error={errors.firstName}
            />

            <FormField
              label="Sobrenome"
              type="text"
              autoComplete="family-name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              error={errors.lastName}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              label="Data de nascimento"
              type="text"
              inputMode="numeric"
              autoComplete="bday"
              placeholder="DD/MM/AAAA"
              value={dataNascimento}
              onChange={(event) =>
                setDataNascimento(maskData(event.target.value))
              }
              error={errors.dataNascimento}
            />
          </div>

          <FormField
            label="Nome da mãe"
            type="text"
            value={nomeMae}
            onChange={(event) => setNomeMae(event.target.value)}
            error={errors.nomeMae}
          />

          <FormField
            label="Nome do pai"
            type="text"
            value={nomePai}
            onChange={(event) => setNomePai(event.target.value)}
            error={errors.nomePai}
          />

          <FormField
            label="CEP"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="00000-000"
            value={cep}
            onChange={(event) => setCep(maskCEP(event.target.value))}
            error={errors.cep}
          />

          <FormField
            label="E-mail"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={errors.email}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Telefone (opcional)"
              type="tel"
              autoComplete="tel"
              placeholder="(00) 00000-0000"
              value={telefone}
              onChange={(event) =>
                setTelefone(maskTelefone(event.target.value))
              }
              error={errors.telefone}
            />

            <FormField
              label="Cartão SUS (opcional)"
              type="text"
              inputMode="numeric"
              value={maskCartaoSus(cartaoSus)}
              onChange={(event) =>
                setCartaoSus(event.target.value.replace(/\D/g, '').slice(0, 15))
              }
              error={errors.cartaoSus}
            />
          </div>

          <PasswordField
            label="Senha"
            autoComplete="new-password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            error={errors.senha}
          />
          <p className="-mt-3 text-xs text-gray-500">
            Mínimo de 8 caracteres, com letras e números.
          </p>

          <div className="flex flex-col gap-2">
            <label className="flex items-start gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={aceitouTermos}
                onChange={(event) => setAceitouTermos(event.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>
                Li e concordo com os{' '}
                <Link
                  to="/termos-de-uso"
                  target="_blank"
                  className="font-medium text-emerald-700 hover:underline"
                >
                  Termos de Uso
                </Link>
              </span>
            </label>
            {errors.termos && (
              <p className="text-xs text-red-500">{errors.termos}</p>
            )}

            <label className="flex items-start gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={cienteDaPrivacidade}
                onChange={(event) =>
                  setCienteDaPrivacidade(event.target.checked)
                }
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>
                Tenho ciência da{' '}
                <Link
                  to="/politica-de-privacidade"
                  target="_blank"
                  className="font-medium text-emerald-700 hover:underline"
                >
                  Política de Privacidade
                </Link>
              </span>
            </label>
            {errors.privacidade && (
              <p className="text-xs text-red-500">{errors.privacidade}</p>
            )}
          </div>

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
            disabled={etapa !== 'formulario'}
            className="mt-2 w-full rounded-lg bg-emerald-300 py-3 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {etapa === 'enviando' ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        {(etapa === 'enviando' || etapa === 'sucesso') && (
          <ValidationOverlay
            status={etapa === 'enviando' ? 'validating' : 'success'}
            validatingText="Validando cadastro..."
            successText="Cadastro efetuado com sucesso"
          />
        )}
      </div>
    </AuthLayout>
  );
}

export default Cadastro;
