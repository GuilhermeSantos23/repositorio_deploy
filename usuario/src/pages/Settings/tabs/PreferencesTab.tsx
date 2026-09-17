import { useEffect } from 'react';
import { Switch, Slider } from 'antd';
import { useLocalStorage } from '../../../hooks/useLocalStorage';

// As três preferências desta aba são só do frontend por enquanto,
// então usam localStorage em vez de backend, como pedido.
function PreferencesTab() {
  const [darkMode, setDarkMode] = useLocalStorage('vacmais:darkMode', false);
  const [brightness, setBrightness] = useLocalStorage(
    'vacmais:brightness',
    100,
  );
  const [audioDescription, setAudioDescription] = useLocalStorage(
    'vacmais:audioDescription',
    false,
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Aplica o brilho escolhido em toda a página.
  useEffect(() => {
    document.body.style.filter = `brightness(${brightness}%)`;
  }, [brightness]);

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold tracking-wide text-gray-800">
        Preferências do Sistema
      </h2>

      <div className="mt-4 flex flex-col gap-4">
        <div className="flex items-center justify-between rounded-lg border border-gray-100 p-4">
          <span className="text-sm font-medium text-gray-700">Tema claro</span>
          <Switch
            checked={!darkMode}
            onChange={(checked) => setDarkMode(!checked)}
          />
        </div>

        <div className="rounded-lg border border-gray-100 p-4">
          <span className="mb-2 block text-sm font-medium text-gray-700">
            Brilho
          </span>
          <Slider
            min={50}
            max={150}
            value={brightness}
            onChange={setBrightness}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-gray-100 p-4">
          <span className="text-sm font-medium text-gray-700">
            Áudio-descrição
          </span>
          <Switch checked={audioDescription} onChange={setAudioDescription} />
        </div>
      </div>
    </div>
  );
}

export default PreferencesTab;
