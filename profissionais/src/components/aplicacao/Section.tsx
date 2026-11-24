import type { ReactNode } from 'react';

/** Bloco com borda discreta e título, usado em todas as etapas. */
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-md border border-gray-200 bg-white">
      <h2 className="border-b border-gray-200 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-gray-700">
        {title}
      </h2>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function DataList({ items }: { items: { label: string; value: string }[] }) {
  return (
    <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="text-xs uppercase tracking-wide text-gray-500">{item.label}</dt>
          <dd className="mt-0.5 text-sm font-medium text-gray-900">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-1 text-xs text-red-600" role="alert">{message}</p> : null;
}

export function FieldLabel({ htmlFor, children, required }: { htmlFor?: string; children: ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-gray-700">
      {children}
      {required && <span className="text-red-600"> *</span>}
    </label>
  );
}

export const primaryButton =
  'rounded-md bg-emerald-800 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60';
export const secondaryButton =
  'rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60';
export const inputClass = (hasError: boolean) =>
  `w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-600 ${hasError ? 'border-red-400' : 'border-gray-300'}`;
