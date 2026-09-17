import { useState } from 'react';

// Hook simples de persistência local para preferências que ainda não têm
// backend (ex.: tema, brilho). Quando o backend existir para esse tipo de
// dado, basta trocar a implementação interna — quem usa o hook não muda.
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  function setValue(value: T) {
    setStoredValue(value);
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignora falhas de escrita (ex.: localStorage indisponível).
    }
  }

  return [storedValue, setValue];
}
