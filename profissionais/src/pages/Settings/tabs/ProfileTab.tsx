import { useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { useUser } from '../../../hooks/useUser';
import UserAvatar from '../../../components/common/UserAvatar/UserAvatar';
import AvatarPickerModal from '../../../components/common/AvatarPickerModal/AvatarPickerModal';

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}

function Field({ label, value, onChange, type = 'text' }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-emerald-500"
      />
    </label>
  );
}

// Os dados abaixo são fictícios e servem apenas para a demonstração do frontend.
// Futuramente serão carregados do perfil do profissional autenticado pelo backend.
function ProfileTab() {
  const { userName, setUserName } = useUser();
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const [firstName, setFirstName] = useState('Helena');
  const [lastName, setLastName] = useState('Ramos');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [crm, setCrm] = useState('54321');

  function handleSave() {
    const fullName = `${firstName} ${lastName}`.trim();
    setUserName(fullName || userName);
    // TODO: futuramente enviar esses dados para o backend via Axios.
  }

  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold tracking-wide text-gray-800">Perfil</h2>

      <div className="mt-4 mb-6 flex items-center gap-4">
        <button
          type="button"
          onClick={() => setIsPickerOpen(true)}
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
        <Field label="Nome" value={firstName} onChange={setFirstName} />
        <Field label="Sobrenome" value={lastName} onChange={setLastName} />
        <Field label="CPF" value={cpf} onChange={setCpf} />
        <Field label="Email" value={email} onChange={setEmail} type="email" />
        <Field label="Telefone" value={phone} onChange={setPhone} />
        <Field label="CRM" value={crm} onChange={setCrm} />
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400"
        >
          Salvar Alterações
        </button>
      </div>

      <AvatarPickerModal open={isPickerOpen} onClose={() => setIsPickerOpen(false)} />
    </div>
  );
}

export default ProfileTab;
