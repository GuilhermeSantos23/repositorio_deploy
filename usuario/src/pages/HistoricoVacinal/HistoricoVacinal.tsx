interface VaccineItem {
  name: string;
  info: string;
}

interface VaccineSection {
  title: string;
  items: VaccineItem[];
}

const sections: VaccineSection[] = [
  {
    title: 'VACINAS PENDENTES',
    items: [
      { name: 'Influenza 2026', info: 'Campanha até fevereiro 2026' },
      { name: 'Febre Amarela (reforço)', info: 'Campanha até abril 2026' },
      { name: 'dT (reforço a cada 10 anos)', info: 'Vence em 2028' },
    ],
  },
  {
    title: 'VACINAS EM ATRASO',
    items: [
      { name: 'Tríplice Viral (reforço)', info: 'Atrasada em 4 anos' },
      { name: 'Hepatite B (3ª dose)', info: 'Atrasada em 2 anos' },
    ],
  },
  {
    title: 'PRÓXIMAS VACINAS',
    items: [
      { name: 'COVID-19 (reforço)', info: 'Campanha em março 2027' },
      { name: 'HPV (reforço)', info: 'Prevista para 2030' },
    ],
  },
];

function HistoricoVacinal() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Olá, Carla Ribeiro!</h1>
      <p className="mt-1 text-sm text-gray-500">
        Aqui está suas vacinas pendentes , em atraso e suas próximas vacinas
      </p>

      <div className="mt-6 flex flex-col gap-5">
        {sections.map((section) => (
          <div
            key={section.title}
            className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm"
          >
            <h2 className="text-sm font-bold tracking-wide text-gray-800">
              {section.title}
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {section.items.map((item) => (
                <div key={item.name}>
                  <p className="text-sm font-semibold text-red-600">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">{item.info}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HistoricoVacinal;
