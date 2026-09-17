import { useState, type ChangeEvent } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { useUser } from '../../../hooks/useUser';
import UserAvatar from '../../../components/common/UserAvatar/UserAvatar';
import AvatarPickerModal from '../../../components/common/AvatarPickerModal/AvatarPickerModal';
import { maskCartaoSus, maskTelefone } from '../../../utils/masks';

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  disabled?: boolean;
}

// Campo de formulário simples, reaproveitado pelos campos do Perfil.
function Field({ label, value, onChange, type = 'text', disabled }: FieldProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value);
  }

  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </span>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={handleChange}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-emerald-500 disabled:bg-gray-100 disabled:text-gray-500"
      />
    </label>
  );
}

// O campo de CPF é apenas de leitura, mas o componente Field sempre
// espera uma função onChange. Esta função existe só para isso.
function naoFazNada() {
  return;
}

// Tira tudo que não for número. Usada para guardar o Cartão SUS
// somente com os dígitos (a máscara com espaços é só visual).
function apenasNumeros(valor: string): string {
  return valor.replace(/\D/g, '');
}

// Os campos começam preenchidos com os dados do usuário logado (vindos
// do UserContext/localStorage) e são salvos de volta ao clicar em
// "Salvar Alterações". Ao salvar, os dados são atualizados no
// UserContext, que por sua vez atualiza o localStorage e reflete a
// mudança em qualquer outra tela que use os mesmos dados (ex: Header).
function ProfileTab() {
  const {
    firstName,
    lastName,
    fullName,
    cpf,
    email,
    phone,
    susCard,
    region,
    updateProfile,
  } = useUser();

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [mensagemDeSucesso, setMensagemDeSucesso] = useState('');

  function abrirSeletorDeAvatar() {
    setIsPickerOpen(true);
  }

  function fecharSeletorDeAvatar() {
    setIsPickerOpen(false);
  }

  const [firstNameField, setFirstNameField] = useState(firstName);
  const [lastNameField, setLastNameField] = useState(lastName);
  const [emailField, setEmailField] = useState(email);
  const [phoneField, setPhoneField] = useState(phone);
  // susCardField guarda somente os 15 dígitos (sem espaço). A máscara
  // "XXX XXXX XXXX XXXX" é aplicada só na hora de mostrar no input.
  const [susCardField, setSusCardField] = useState(susCard);
  const [regionField, setRegionField] = useState(region);

  function handleAlterarCartaoSus(valorDigitado: string) {
    const somenteNumeros = apenasNumeros(valorDigitado).slice(0, 15);
    setSusCardField(somenteNumeros);
  }

  function handleAlterarTelefone(valorDigitado: string) {
    setPhoneField(maskTelefone(valorDigitado));
  }

  // Salva tudo em uma única chamada. O updateProfile atualiza o usuário
  // logado no contexto e no localStorage, então o Header, o avatar e as
  // demais telas passam a usar os novos dados na hora.
  function handleSave() {
    updateProfile({
      firstName: firstNameField,
      lastName: lastNameField,
      email: emailField,
      phone: phoneField,
      susCard: susCardField,
      region: regionField,
    });

    setMensagemDeSucesso('Dados do perfil atualizados com sucesso.');
  }

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold tracking-wide text-gray-800">Perfil</h2>

      <div className="mt-4 mb-6 flex items-center gap-4">
        <button
          type="button"
          onClick={abrirSeletorDeAvatar}
          aria-label="Alterar avatar"
          className="relative"
        >
          <UserAvatar size={64} />
          <span className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-300 text-emerald-950">
            <EditOutlined className="text-xs" />
          </span>
        </button>
        <p className="font-semibold text-gray-900">{fullName || 'Usuário'}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Primeiro nome"
          value={firstNameField}
          onChange={setFirstNameField}
        />
        <Field
          label="Sobrenome"
          value={lastNameField}
          onChange={setLastNameField}
        />
        {/* CPF não pode ser editado aqui porque é a chave usada para
            encontrar o usuário no login. */}
        <Field label="CPF" value={cpf} onChange={naoFazNada} disabled />
        <Field
          label="Email"
          value={emailField}
          onChange={setEmailField}
          type="email"
        />
        <Field
          label="Telefone"
          value={phoneField}
          onChange={handleAlterarTelefone}
        />
        <Field
          label="Cartão SUS"
          value={maskCartaoSus(susCardField)}
          onChange={handleAlterarCartaoSus}
        />
        {/* Região é um campo de texto digitável, não uma lista de opções,
            conforme a regra do mega prompt. */}
        <Field label="Região" value={regionField} onChange={setRegionField} />
      </div>

      {mensagemDeSucesso && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {mensagemDeSucesso}
        </p>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400"
        >
          Salvar Alterações
        </button>
      </div>

      <AvatarPickerModal
        open={isPickerOpen}
        onClose={fecharSeletorDeAvatar}
      />
    </div>
  );
}

export default ProfileTab;
