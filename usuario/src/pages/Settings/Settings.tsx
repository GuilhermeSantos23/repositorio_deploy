import { Tabs } from 'antd';
import ProfileTab from './tabs/ProfileTab';
import SecurityTab from './tabs/SecurityTab';
import DevicesTab from './tabs/DeviceTab';
import PermissionsTab from './tabs/PermissionsTab';
import PreferencesTab from './tabs/PreferencesTab';

const tabItems = [
  { key: 'profile', label: 'Perfil', children: <ProfileTab /> },
  { key: 'security', label: 'Segurança', children: <SecurityTab /> },
  { key: 'devices', label: 'Dispositivos', children: <DevicesTab /> },
  { key: 'permissions', label: 'Permissões', children: <PermissionsTab /> },
  { key: 'preferences', label: 'Preferências', children: <PreferencesTab /> },
];

function Settings() {
  return (
    <div>
      <p className="text-sm text-gray-500">Conta &amp; Segurança</p>
      <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
      <p className="mt-1 text-sm text-gray-500">
        Gerencie seu perfil, segurança e preferências do sistema.
      </p>

      <Tabs items={tabItems} className="mt-6" />
    </div>
  );
}

export default Settings;
