import { CheckOutlined } from '@ant-design/icons';

export const APPLICATION_STEPS = ['Identificação', 'Vacina e dose', 'Dados da aplicação', 'Revisão e registro'];

/** Indicador de etapas. `current` é o índice (base 0) da etapa atual. */
export default function StepIndicator({ current, steps = APPLICATION_STEPS }: { current: number; steps?: string[] }) {
  return (
    <ol className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2">
      {steps.map((label, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={label} className="flex items-center gap-2" aria-current={active ? 'step' : undefined}>
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                done ? 'bg-emerald-700 text-white' : active ? 'bg-emerald-950 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {done ? <CheckOutlined className="text-[10px]" /> : index + 1}
            </span>
            <span className={`text-sm ${active ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>{label}</span>
            {index < steps.length - 1 && <span className="mx-1 h-px w-6 bg-gray-300" />}
          </li>
        );
      })}
    </ol>
  );
}
