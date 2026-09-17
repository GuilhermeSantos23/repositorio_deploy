interface InstitutionalSectionProps {
  title: string;
  paragraphs: string[];
}

// Seção institucional exibida abaixo dos cards de Missão, Visão e Valores.
// Recebe um título e uma lista de parágrafos para manter o texto flexível
// e fácil de atualizar futuramente.
function InstitutionalSection({
  title,
  paragraphs,
}: InstitutionalSectionProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
      <h2 className="text-sm font-bold tracking-wide text-emerald-900">
        {title}
      </h2>

      <div className="mt-4 flex flex-col gap-4">
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-sm leading-relaxed text-gray-600">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}

export default InstitutionalSection;
