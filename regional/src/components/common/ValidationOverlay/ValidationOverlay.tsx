interface ValidationOverlayProps {
  status: 'validating' | 'success';
  validatingText: string;
  successText: string;
}

function ValidationOverlay({
  status,
  validatingText,
  successText,
}: ValidationOverlayProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white">
      {status === 'validating' ? (
        <>
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
          <p className="text-sm font-medium text-gray-700">{validatingText}</p>
        </>
      ) : (
        <>
          <svg
            viewBox="0 0 52 52"
            className="h-14 w-14"
            fill="none"
            stroke="#059669"
            strokeWidth="3"
          >
            <circle
              cx="26"
              cy="26"
              r="23"
              className="animate-[draw-circle_0.4s_ease-out_forwards]"
              style={{ strokeDasharray: 145, strokeDashoffset: 145 }}
            />
            <path
              d="M15 27 L23 35 L38 18"
              className="animate-[draw-check_0.3s_ease-out_0.35s_forwards]"
              style={{ strokeDasharray: 40, strokeDashoffset: 40 }}
            />
          </svg>
          <p className="text-sm font-medium text-emerald-700">{successText}</p>
        </>
      )}
    </div>
  );
}

export default ValidationOverlay;
