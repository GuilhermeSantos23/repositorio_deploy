import InformacaoVacinalCard from '../../components/Infocards/informacaoVacinalCard';

const informacoes = [
  {
    id: 1,
    fake: {
      titulo: 'Vacinas causam autismo',
      descricao:
        'Estudos com milhões de crianças comprovam que não há nenhuma relação entre vacinas e autismo. O estudo original foi fraudado e retratado em 1998.',
    },
    verdade: {
      titulo: 'Vacinação previne doenças graves',
      descricao:
        'Vacinas evitam de 4 a 5 milhões de mortes por ano no mundo, segundo a OMS.',
    },
  },
  {
    id: 2,
    fake: {
      titulo: 'Vacina da Covid-19 altera o DNA',
      descricao:
        'As vacinas de mRNA não entram no núcleo das células e não interagem com o DNA. Elas ensinam o corpo a produzir uma proteína de defesa.',
    },
    verdade: {
      titulo: 'Posso tomar várias vacinas no mesmo dia',
      descricao:
        'Salvo exceções específicas, vacinas podem ser administradas simultaneamente sem perda de eficácia.',
    },
  },
  {
    id: 3,
    fake: {
      titulo: 'Vacinas têm microchip',
      descricao:
        'Não existe tecnologia para inserir microchips em líquidos vacinais. As agulhas são finas demais.',
    },
    verdade: {
      titulo: 'Gestantes podem se vacinar',
      descricao:
        'Vacinas como dTpa, Influenza e Hepatite B são recomendadas protegendo mãe e bebê.',
    },
  },
];

function InformacoesVacinais() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">
          Fake News vs Verdades sobre vacinas
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Nosso sistema disponibiliza informações confiáveis e baseadas em
          evidências científicas para combater a desinformação.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {informacoes.map((item) => (
          <div key={item.id} className="flex flex-col gap-4 lg:flex-row">
            <InformacaoVacinalCard
              tipo="FAKE"
              titulo={item.fake.titulo}
              descricao={item.fake.descricao}
            />
            <InformacaoVacinalCard
              tipo="VERDADE"
              titulo={item.verdade.titulo}
              descricao={item.verdade.descricao}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default InformacoesVacinais;
