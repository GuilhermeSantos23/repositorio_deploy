import { Tabs } from 'antd';
import DeviceTab from './tabs/DeviceTab';
import PreferencesTab from './tabs/PreferencesTab';

const tabItems = [
  { key: 'devices', label: 'Dispositivos conectados', children: <DeviceTab /> },
  { key: 'preferences', label: 'Preferências', children: <PreferencesTab /> },
];

function Settings() {
  return (
    <div>
      <p className="text-sm text-gray-500">Conta &amp; segurança</p>
      <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
      <p className="mt-1 text-sm text-gray-500">
        Gerencie os dispositivos conectados e as preferências do sistema.
      </p>

      <Tabs items={tabItems} className="mt-6" />
    </div>
  );
}

export default Settings;