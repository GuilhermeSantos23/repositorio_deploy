import { useState } from 'react';

/**
 * Hook simples para persistir um valor no localStorage.
 * Usado apenas para preferências puramente de frontend (tema, brilho, etc.),
 * que não dependem do backend.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  function updateValue(next: T) {
    setValue(next);
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // Armazenamento indisponível (ex.: modo privado) — ignora silenciosamente.
    }
  }

  return [value, updateValue] as const;
}
