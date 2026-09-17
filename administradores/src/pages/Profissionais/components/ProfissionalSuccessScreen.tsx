// Mesmo padrão visual do SuccessScreen usado no fluxo de UBSs (Regional).
// Mantido como cópia local para não criar uma dependência entre a área de
// Administradores e a área de Regional.

interface ProfissionalSuccessScreenProps {
  message: string;
  onDone: () => void;
  doneLabel?: string;
}

function ProfissionalSuccessScreen({
  message,
  onDone,
  doneLabel = 'Voltar para Profissionais',
}: ProfissionalSuccessScreenProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <svg
        viewBox="0 0 52 52"
        className="h-16 w-16"
        fill="none"
        stroke="#059669"
        strokeWidth="3"
      >
        <circle cx="26" cy="26" r="23" />
        <path d="M15 27 L23 35 L38 18" />
      </svg>
      <p className="text-lg font-semibold text-gray-900">{message}</p>
      <button
        type="button"
        onClick={onDone}
        className="mt-2 rounded-lg bg-emerald-700 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
      >
        {doneLabel}
      </button>
    </div>
  );
}

export default ProfissionalSuccessScreen;
