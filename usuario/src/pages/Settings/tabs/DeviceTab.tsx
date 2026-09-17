import { DesktopOutlined, MobileOutlined } from '@ant-design/icons';

interface ConnectedDevice {
  id: string;
  name: string;
  browser: string;
  location: string;
  lastActive: string;
  type: 'desktop' | 'mobile';
}

// Dispositivos de exemplo, só para a interface ter algo para mostrar.
// Futuramente essa lista virá do backend (sessões reais do usuário).
const EXAMPLE_DEVICES: ConnectedDevice[] = [
  {
    id: '1',
    name: 'MacBook Pro',
    browser: 'Chrome',
    location: 'São Paulo, SP',
    lastActive: 'agora',
    type: 'desktop',
  },
  {
    id: '2',
    name: 'iPhone 15',
    browser: 'Safari',
    location: 'São Paulo, SP',
    lastActive: 'há 2h',
    type: 'mobile',
  },
  {
    id: '3',
    name: 'iPad Air',
    browser: 'Edge',
    location: 'Campinas, SP',
    lastActive: 'há 1 dia',
    type: 'mobile',
  },
];

function DevicesTab() {
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold tracking-wide text-gray-800">
        Dispositivos Conectados
      </h2>

      <ul className="mt-4 flex flex-col gap-3">
        {EXAMPLE_DEVICES.map((device) => (
          <li
            key={device.id}
            className="flex items-center gap-3 rounded-lg border border-gray-100 p-4"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              {device.type === 'desktop' ? (
                <DesktopOutlined />
              ) : (
                <MobileOutlined />
              )}
            </span>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {device.name} · {device.browser}
              </p>
              <p className="text-sm text-gray-500">
                {device.location} · {device.lastActive}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DevicesTab;
