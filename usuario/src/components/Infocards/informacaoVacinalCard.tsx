import { XCircle, CheckCircle2 } from 'lucide-react';

type TipoInformacao = 'FAKE' | 'VERDADE';

interface InformacaoVacinalCardProps {
  tipo: TipoInformacao;
  titulo: string;
  descricao: string;
}

// Card reutilizável usado tanto para exibir uma informação FAKE
// quanto uma informação VERDADE. O estilo (cor, ícone e rótulo)
// muda de acordo com a prop "tipo".
function InformacaoVacinalCard({
  tipo,
  titulo,
  descricao,
}: InformacaoVacinalCardProps) {
  const isFake = tipo === 'FAKE';

  return (
    <div className="flex-1 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div
        className={`flex items-center gap-2 text-xs font-bold tracking-wide ${
          isFake ? 'text-red-600' : 'text-emerald-700'
        }`}
      >
        {isFake ? (
          <XCircle size={16} strokeWidth={2.5} />
        ) : (
          <CheckCircle2 size={16} strokeWidth={2.5} />
        )}
        {tipo}
      </div>

      <h3 className="mt-2 text-sm font-semibold text-gray-900">{titulo}</h3>

      <p className="mt-2 text-sm leading-relaxed text-gray-600">{descricao}</p>
    </div>
  );
}

export default InformacaoVacinalCard;
