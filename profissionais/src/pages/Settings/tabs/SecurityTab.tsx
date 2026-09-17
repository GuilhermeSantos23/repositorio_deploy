import { useState } from 'react';
import { Switch, Input, Alert } from 'antd';

function SecurityTab() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  function handleChangePassword() {
    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas não coincidem.');
      return;
    }

    setPasswordError('');
    // TODO: futuramente enviar currentPassword/newPassword para o backend via Axios.
  }

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold tracking-wide text-gray-800">Segurança da Conta</h2>

      <div className="mt-4 mb-6 flex items-center justify-between rounded-lg border border-gray-100 p-4">
        <div>
          <p className="text-sm font-medium text-gray-900">Autenticação em duas etapas</p>
          <p className="text-sm text-gray-500">Receba um código de verificação a cada login.</p>
        </div>
        <Switch checked={twoFactorEnabled} onChange={setTwoFactorEnabled} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Senha Atual</span>
          <Input.Password
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
          />
        </label>

        <div />

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Nova Senha</span>
          <Input.Password
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">
            Confirmar Nova Senha
          </span>
          <Input.Password
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </label>
      </div>

      {passwordError && <Alert type="error" message={passwordError} showIcon className="mt-4" />}

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleChangePassword}
          className="rounded-lg bg-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400"
        >
          Alterar Senha
        </button>
      </div>
    </div>
  );
}

export default SecurityTab;
