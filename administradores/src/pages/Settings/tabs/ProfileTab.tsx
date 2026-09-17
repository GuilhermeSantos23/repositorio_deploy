import { useState } from 'react';
import FormField from '../../../components/form/FormField/FormField';
import { CURRENT_UNIT_ADMIN } from '../../../mocks/session';
import { maskCPF, maskPhone } from '../../../utils/masks';

// Os dados abaixo são fictícios e servem apenas para a demonstração do
// frontend. Futuramente serão carregados do perfil do administrador da
// unidade autenticado pelo backend.
function ProfileTab() {
  const [name, setName] = useState(CURRENT_UNIT_ADMIN.name);
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  function handleSave() {
    // TODO(backend): futuramente enviar esses dados para a API.
  }

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold tracking-wide text-gray-800">Perfil</h2>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Nome" value={name} onChange={(e) => setName(e.target.value)} />
        <FormField
          label="CPF"
          inputMode="numeric"
          placeholder="123.456.789-00"
          value={cpf}
          onChange={(e) => setCpf(maskCPF(e.target.value))}
        />
        <FormField
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormField
          label="Telefone"
          inputMode="numeric"
          placeholder="(11) 98765-4321"
          value={phone}
          onChange={(e) => setPhone(maskPhone(e.target.value))}
        />
        <FormField
          label="Unidade"
          value={CURRENT_UNIT_ADMIN.unit}
          readOnly
          disabled
          className="cursor-not-allowed"
        />
        <FormField label="Cargo" value={CURRENT_UNIT_ADMIN.role} readOnly disabled className="cursor-not-allowed" />
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          Salvar alterações
        </button>
      </div>
    </div>
  );
}

export default ProfileTab;
