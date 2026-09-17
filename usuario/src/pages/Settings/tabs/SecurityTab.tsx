import { useState, type ChangeEvent } from 'react';
import { Switch, Input, Alert } from 'antd';
import { useUser } from '../../../hooks/useUser';

// A ativação real da autenticação em duas etapas (envio do código por
// email) depende do backend. Por enquanto guardamos só a preferência
// localmente, deixando o ponto de integração pronto para o futuro.
function SecurityTab() {
  const { changePassword } = useUser();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  function handleCurrentPasswordChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setCurrentPassword(event.target.value);
  }

  function handleNewPasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setNewPassword(event.target.value);
  }

  function handleConfirmPasswordChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setConfirmPassword(event.target.value);
  }

  // Confere a senha atual, confere se a nova senha bate com a
  // confirmação e só então salva a nova senha no localStorage, através
  // do userService (mesma arquitetura Página -> Service -> localStorage
  // usada pelo cadastro e pelo login).
  async function handleChangePassword() {
    setPasswordError('');
    setPasswordSuccess('');

    try {
      const resultado = await changePassword(
        currentPassword,
        newPassword,
        confirmPassword,
      );

      if (!resultado.success) {
        setPasswordError(resultado.message);
        return;
      }

      setPasswordSuccess(resultado.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error(error);
      setPasswordError('Não foi possível alterar a senha. Tente novamente.');
    }
  }

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold tracking-wide text-gray-800">
        Segurança da Conta
      </h2>

      <div className="mt-4 mb-6 flex items-center justify-between rounded-lg border border-gray-100 p-4">
        <div>
          <p className="text-sm font-medium text-gray-900">
            Autenticação em duas etapas
          </p>
          <p className="text-sm text-gray-500">
            Receba um código de verificação a cada login.
          </p>
        </div>
        <Switch checked={twoFactorEnabled} onChange={setTwoFactorEnabled} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">
            Senha Atual
          </span>
          <Input.Password
            value={currentPassword}
            onChange={handleCurrentPasswordChange}
          />
        </label>

        <div />

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">
            Nova Senha
          </span>
          <Input.Password
            value={newPassword}
            onChange={handleNewPasswordChange}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">
            Confirmar Nova Senha
          </span>
          <Input.Password
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
        </label>
      </div>

      {passwordError && (
        <Alert type="error" message={passwordError} showIcon className="mt-4" />
      )}

      {passwordSuccess && (
        <Alert
          type="success"
          message={passwordSuccess}
          showIcon
          className="mt-4"
        />
      )}

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
