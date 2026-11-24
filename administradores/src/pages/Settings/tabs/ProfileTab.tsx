import { useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import UserAvatar from '../../../components/common/UserAvatar/UserAvatar';
import AvatarPickerModal from '../../../components/common/AvatarPickerModal/AvatarPickerModal';
import { CURRENT_UNIT_ADMIN } from '../../../mocks/session';

interface InfoFieldProps {
  label: string;
  value: string;
}

// Mostra "Não informado" sempre que o dado estiver vazio, nulo ou não
// cadastrado, para nunca expor undefined/null/texto técnico na tela.
function getDisplayValue(value: string): string {
  return value.trim() ? value : 'Não informado';
}

function InfoField({ label, value }: InfoFieldProps) {
  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      <p className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900">
        {getDisplayValue(value)}
      </p>
    </div>
  );
}

// Os dados abaixo partem do administrador da unidade logado (mock de
// sessão). Futuramente serão carregados do backend. Os campos cadastrais
// são somente leitura: apenas a foto de perfil pode ser alterada nesta tela.
function ProfileTab() {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const firstName = CURRENT_UNIT_ADMIN.firstName;
  const lastName = CURRENT_UNIT_ADMIN.lastName;
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
        <div>
          <p className="font-semibold text-gray-900">{getDisplayValue(fullName)}</p>
          <p className="text-xs text-gray-500">Somente a foto de perfil pode ser alterada aqui.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoField label="Nome" value={firstName} />
        <InfoField label="Sobrenome" value={lastName} />
        <InfoField label="CPF" value={CURRENT_UNIT_ADMIN.cpf} />
        <InfoField label="E-mail" value={CURRENT_UNIT_ADMIN.email} />
        <InfoField label="Telefone" value={CURRENT_UNIT_ADMIN.phone} />
        <InfoField label="Unidade" value={CURRENT_UNIT_ADMIN.unit} />
      </div>

      <p className="mt-6 text-xs text-gray-500">
        Os dados cadastrais são somente para consulta.
      </p>

      <AvatarPickerModal open={isPickerOpen} onClose={() => setIsPickerOpen(false)} />
    </div>
  );
}

export default ProfileTab;
