import { useState } from 'react';
import { Switch, Alert } from 'antd';

interface PermissionItem {
  key: string;
  label: string;
}

// Lista exata de permissões definida para o Vac+.
const PERMISSIONS: PermissionItem[] = [
  { key: 'realtimeLocation', label: 'Localização em tempo real' },
  { key: 'shareData', label: 'Compartilhar dados' },
  { key: 'sensitiveData', label: 'Acesso a dados sensíveis' },
  { key: 'emailAlerts', label: 'Receber alertas via E-mail' },
  { key: 'whatsappAlerts', label: 'Receber alertas via WhatsApp' },
  { key: 'exportReport', label: 'Exportar relatório pessoal' },
];

type PermissionState = Record<string, boolean>;

const INITIAL_STATE: PermissionState = {
  realtimeLocation: false,
  shareData: false,
  sensitiveData: false,
  emailAlerts: false,
  whatsappAlerts: false,
  exportReport: false,
};

function PermissionsTab() {
  const [permissions, setPermissions] =
    useState<PermissionState>(INITIAL_STATE);
  const [locationMessage, setLocationMessage] = useState('');

  // Usa a Geolocation API do navegador para capturar a posição do usuário.
  // As coordenadas serão enviadas ao backend futuramente, quando a
  // funcionalidade "Unidades Próximas" for integrada com as rotas reais.
  function requestLocation() {
    if (!navigator.geolocation) {
      setLocationMessage('Seu navegador não suporta localização.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocationMessage(
          `Localização capturada (${latitude.toFixed(4)}, ${longitude.toFixed(4)}).`,
        );
      },
      () => {
        setLocationMessage(
          'Para acessar funcionalidades como Unidades Próximas, permita o acesso à sua localização.',
        );
      },
    );
  }

  function handleToggle(key: string, checked: boolean) {
    setPermissions((current) => ({ ...current, [key]: checked }));

    if (key === 'realtimeLocation' && checked) {
      requestLocation();
    }
  }

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold tracking-wide text-gray-800">
        Permissões do Perfil
      </h2>

      <ul className="mt-4 flex flex-col gap-3">
        {PERMISSIONS.map((permission) => (
          <li
            key={permission.key}
            className="flex items-center justify-between rounded-lg border border-gray-100 p-4"
          >
            <span className="text-sm font-medium text-gray-700">
              {permission.label}
            </span>
            <Switch
              checked={permissions[permission.key]}
              onChange={(checked) => handleToggle(permission.key, checked)}
            />
          </li>
        ))}
      </ul>

      {locationMessage && (
        <Alert
          type="info"
          message={locationMessage}
          showIcon
          className="mt-4"
        />
      )}
    </div>
  );
}

export default PermissionsTab;
