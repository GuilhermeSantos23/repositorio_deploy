import { useState, type InputHTMLAttributes } from 'react';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import FormField from '../FormField/FormField';

interface PasswordFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
}

// Campo de senha com botão para mostrar/ocultar o que foi digitado.
// Usado no Login e no Cadastro.
function PasswordField(props: PasswordFieldProps) {
  const [visivel, setVisivel] = useState(false);

  return (
    <FormField
      {...props}
      type={visivel ? 'text' : 'password'}
      rightElement={
        <button
          type="button"
          onClick={() => setVisivel(!visivel)}
          aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-gray-500 hover:text-gray-700"
        >
          {visivel ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        </button>
      }
    />
  );
}

export default PasswordField;
