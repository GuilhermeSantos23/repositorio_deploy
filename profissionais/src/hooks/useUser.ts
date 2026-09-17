import { useContext } from 'react';
import { UserContext } from '../contexts/userContext';

// Hook para ler/alterar o nome e o avatar do usuário atual.
// Usado pelo Header e pela página Settings, garantindo que os dois
// sempre mostrem o mesmo avatar.
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser precisa ser usado dentro de um UserProvider');
  }
  return context;
}
