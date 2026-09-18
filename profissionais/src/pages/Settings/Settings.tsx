import { Tabs } from 'antd';
import ProfileTab from './tabs/ProfileTab';
import DeviceTab from './tabs/DeviceTab';
import PreferencesTab from './tabs/PreferencesTab';

const tabItems = [
  { key: 'profile', label: 'Perfil', children: <ProfileTab /> },
  { key: 'devices', label: 'Dispositivos', children: <DeviceTab /> },
  { key: 'preferences', label: 'Preferências', children: <PreferencesTab /> },
];

function Settings() {
  return (
    <div>
      <p className="text-sm text-gray-500">Conta</p>
      <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
      <p className="mt-1 text-sm text-gray-500">
        Gerencie seu perfil e as preferências do sistema. A alteração de senha é feita pelo
        fluxo de &quot;Esqueci minha senha&quot;, na tela de login.
      </p>

      <Tabs items={tabItems} className="mt-6" />
    </div>
  );
}

export default Settings;
