import { useState } from 'react';
import { Slider, Segmented, Alert } from 'antd';
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  AimOutlined,
} from '@ant-design/icons';
import MiniMap from '../../components/common/MiniMap/MiniMap';

type UnitType = 'publica' | 'privada';
type TypeFilter = 'todas' | UnitType;

interface Unit {
  id: string;
  name: string;
  type: UnitType;
  distanceKm: number;
  address: string;
  hours: string;
  unavailableVaccines: string[];
}

// Unidades de exemplo, apenas para demonstrar a interface e os filtros.
// Futuramente essa lista virá do backend, a partir da localização real do
// usuário (raio máximo de 50 km).
const EXAMPLE_UNITS: Unit[] = [
  {
    id: '1',
    name: 'UBS Vila Nova',
    type: 'publica',
    distanceKm: 0.8,
    address: 'Rua das Flores',
    hours: 'Seg-Sex 7h-17h',
    unavailableVaccines: ['Influenza'],
  },
  {
    id: '2',
    name: 'Clínica Saúde+',
    type: 'privada',
    distanceKm: 1.4,
    address: 'Av. Paulista, 1500',
    hours: 'Seg-Sáb 8h-19h',
    unavailableVaccines: ['Influenza', 'Hepatite A', 'Febre Amarela'],
  },
  {
    id: '3',
    name: 'UBS Centro',
    type: 'publica',
    distanceKm: 2.1,
    address: 'Praça da República, 50',
    hours: 'Seg-Sex 7h-17h',
    unavailableVaccines: ['Hepatite A'],
  },
  {
    id: '4',
    name: 'Posto Móvel Aeroporto',
    type: 'publica',
    distanceKm: 0.7,
    address: 'Terminal 2, Saguão',
    hours: 'Diariamente 6h-22h',
    unavailableVaccines: ['Febre Amarela', 'Hepatite A'],
  },
];

const typeLabel: Record<UnitType, string> = {
  publica: 'Pública',
  privada: 'Privada',
};

function UnidadesProximas() {
  const [maxDistance, setMaxDistance] = useState(50);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('todas');
  const [locationMessage, setLocationMessage] = useState('');

  const filteredUnits = EXAMPLE_UNITS.filter((unit) => {
    const withinDistance = unit.distanceKm <= maxDistance;
    const matchesType = typeFilter === 'todas' || unit.type === typeFilter;
    return withinDistance && matchesType;
  });

  // Usa a Geolocation API do navegador para capturar a posição do usuário.
  // As coordenadas serão enviadas ao backend futuramente, para calcular as
  // unidades realmente próximas. Nenhuma chamada à API é feita aqui ainda.
  function handleUseLocation() {
    if (!navigator.geolocation) {
      setLocationMessage('Seu navegador não suporta localização.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocationMessage(
          `Localização capturada (${latitude.toFixed(4)}, ${longitude.toFixed(4)}). As unidades abaixo ainda são de demonstração.`,
        );
      },
      () => {
        setLocationMessage(
          'Para acessar esta funcionalidade, permita o acesso à sua localização.',
        );
      },
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">
        Encontre vacinas perto de você
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Veja em tempo real quais vacinas estão disponíveis nas unidades
        próximas.
      </p>

      <div className="mt-6 rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
        <button
          type="button"
          onClick={handleUseLocation}
          className="flex items-center gap-2 rounded-lg bg-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400"
        >
          <AimOutlined />
          Usar minha localização
        </button>

        {locationMessage && (
          <Alert
            type="info"
            message={locationMessage}
            showIcon
            className="mt-3"
          />
        )}

        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">
              Distância máxima: {maxDistance} km
            </p>
            <Slider
              min={1}
              max={50}
              value={maxDistance}
              onChange={setMaxDistance}
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">
              Tipo de unidade
            </p>
            <Segmented
              value={typeFilter}
              onChange={(value) => setTypeFilter(value as TypeFilter)}
              options={[
                { label: 'Todas', value: 'todas' },
                { label: 'Pública', value: 'publica' },
                { label: 'Privada', value: 'privada' },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filteredUnits.map((unit) => (
          <div
            key={unit.id}
            className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500">
                    {typeLabel[unit.type]}
                  </span>
                  <span className="text-xs font-semibold text-gray-500">
                    {unit.distanceKm.toFixed(1)}km
                  </span>
                </div>

                <h2 className="mt-2 text-base font-bold text-gray-900">
                  {unit.name}
                </h2>

                <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                  <EnvironmentOutlined />
                  {unit.address}
                </p>
                <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                  <ClockCircleOutlined />
                  {unit.hours}
                </p>

                <p className="mt-3 text-xs font-medium text-gray-500">
                  Estoque indisponível
                </p>
                <p className="mt-1 text-sm font-medium text-red-500">
                  {unit.unavailableVaccines.join(', ')}
                </p>
              </div>

              <MiniMap />
            </div>
          </div>
        ))}

        {filteredUnits.length === 0 && (
          <p className="text-sm text-gray-500 sm:col-span-2">
            Nenhuma unidade encontrada com os filtros selecionados.
          </p>
        )}
      </div>
    </div>
  );
}

export default UnidadesProximas;
