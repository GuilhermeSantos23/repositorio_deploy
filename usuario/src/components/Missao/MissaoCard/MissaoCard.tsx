import type { LucideIcon } from 'lucide-react';

interface MissionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

// Card reutilizável usado para exibir Missão, Visão e Valores.
// Recebe um ícone, um título e uma descrição, mantendo o mesmo
// padrão visual entre os três blocos.
function MissionCard({ icon: Icon, title, description }: MissionCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
        <Icon size={22} strokeWidth={2} />
      </div>

      <div>
        <h3 className="text-sm font-bold tracking-wide text-emerald-900">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          {description}
        </p>
      </div>
    </div>
  );
}

export default MissionCard;
