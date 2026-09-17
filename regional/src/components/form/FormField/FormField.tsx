import type { InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

function FormField({
  label,
  error,
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
      <input
        id={fieldId}
        className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-900 outline-none focus:border-emerald-500 ${
          error ? 'border-red-400' : 'border-gray-300'
        }`}
        {...inputProps}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default FormField;
