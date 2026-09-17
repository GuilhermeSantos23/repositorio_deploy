import type { SelectHTMLAttributes } from 'react';

interface SelectFieldOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectFieldOption[];
  error?: string;
}

function SelectField({
  label,
  options,
  error,
  id,
  className,
  ...selectProps
}: SelectFieldProps) {
  const fieldId = id ?? `campo-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={className}>
      <label
        htmlFor={fieldId}
        className="mb-1 block text-sm font-medium text-gray-900"
      >
        {label}
      </label>
      <select
        id={fieldId}
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-emerald-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 ${
          error ? 'border-red-400' : 'border-gray-300'
        }`}
        {...selectProps}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default SelectField;
