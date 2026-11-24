import type { ReactNode } from 'react';
import { Section } from './Section';

interface Props {
  title?: string;
  /** Frase que resume o que acontecerá ao confirmar. */
  summary: ReactNode;
  groups: { title: string; items: { label: string; value: string }[] }[];
  children?: ReactNode;
}

/** Resumo final em linhas de rótulo e valor, para conferência antes de confirmar. */
export default function ApplicationReview({ title = 'Revisão e registro', summary, groups, children }: Props) {
  return (
    <Section title={title}>
      <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">{summary}</p>

      <div className="mt-5 flex flex-col gap-5">
        {groups.map((group) => (
          <div key={group.title}>
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-600">{group.title}</h3>
            <dl className="divide-y divide-gray-100 rounded-md border border-gray-200">
              {group.items.map((item) => (
                <div key={item.label} className="flex flex-col gap-0.5 px-4 py-2 text-sm sm:flex-row sm:gap-4">
                  <dt className="text-gray-600 sm:w-56 sm:shrink-0">{item.label}</dt>
                  <dd className="font-medium text-gray-900">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
      {children}
    </Section>
  );
}
