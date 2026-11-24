import type { InputHTMLAttributes, ReactNode } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  // Elemento opcional mostrado dentro do campo, à direita (ex: botão de
  // mostrar/ocultar senha).
  rightElement?: ReactNode;
}

function FormField({
  label,
  error,
  rightElement,
  id,
  className,
  ...inputProps
}: FormFieldProps) {
  const fieldId = id ?? `campo-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={className}>
      <label
        htmlFor={fieldId}
        className="mb-1 block text-sm font-medium text-gray-900"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={fieldId}
          className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-900 outline-none focus:border-emerald-500 ${
            rightElement ? 'pr-10' : ''
          } ${error ? 'border-red-400' : 'border-gray-300'}`}
          {...inputProps}
        />
        {rightElement}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default FormField;
