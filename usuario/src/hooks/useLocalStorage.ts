import { useEffect, useState } from 'react';

// Guarda um valor no localStorage e o recupera automaticamente quando
// o usuário volta ao sistema. Usado pelas preferências de Settings
// Ex: tema, brilho e áudio-descrição.
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    if (stored === null) {
      return initialValue;
    }

    try {
      return JSON.parse(stored) as T;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
