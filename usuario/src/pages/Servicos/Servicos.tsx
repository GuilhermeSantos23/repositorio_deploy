interface Service {
  title: string;
  description: string;
}

const services: Service[] = [
  {
    title: 'CADERNETA VACINAL DIGITAL',
    description:
      'Histórico completo, integrado entre UBSs e clínicas privadas. Acesse pelo CPF a qualquer momento.',
  },
  {
    title: 'ESTOQUE ATUALIZADO',
    description:
      'Veja quais vacinas estão disponíveis perto de você antes de sair de casa.',
  },
  {
    title: 'INFORMAÇÕES VACINAIS',
    description:
      'Conteúdo oficial contra desinformação vacinal, validado por especialistas.',
  },
  {
    title: 'SURTOS EPIDEMIOLÓGICOS',
    description: 'Monitoramento em tempo real de surtos e alertas regionais.',
  },
  {
    title: 'LEMBRETES INTELIGENTES',
    description:
      'Notificações automáticas das próximas doses, campanhas e reforços recomendados.',
  },
  {
    title: 'CALENDÁRIO VACINAL',
    description:
      'Plano completo por idade e grupo: crianças, gestantes, idosos, viajantes e mais.',
  },
];

function Servicos() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">
        Tudo o que a Vac+ oferece
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        O Vac+ é uma plataforma completa com o objetivo de cuidar da sua
        imunização e da sua família
      </p>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        {services.map((service) => (
          <div
            key={service.title}
            className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm"
          >
            <h2 className="text-sm font-bold tracking-wide text-gray-800">
              {service.title}
            </h2>
            <p className="mt-2 text-sm text-gray-500">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Servicos;
