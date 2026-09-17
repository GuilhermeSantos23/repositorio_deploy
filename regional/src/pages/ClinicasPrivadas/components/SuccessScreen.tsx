interface SuccessScreenProps {
  message: string;
  clinicCode?: string;
  onDone: () => void;
  doneLabel?: string;
}

function SuccessScreen({
  message,
  clinicCode,
  onDone,
  doneLabel = 'Voltar para Clínicas Privadas',
}: SuccessScreenProps) {
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
      {clinicCode && (
        <p className="text-sm text-gray-600">
          Código da clínica: <span className="font-semibold text-gray-900">{clinicCode}</span>
        </p>
      )}
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

export default SuccessScreen;
