import { useState, type ReactNode } from 'react';
import { UserContext } from './userContext';

interface UserProviderProps {
  children: ReactNode;
}

// O nome e o avatar abaixo são apenas o estado inicial.
// Futuramente virão do backend, assim que a autenticação do usuário existir.
function UserProvider({ children }: UserProviderProps) {
  const [userName, setUserName] = useState('Helena Ramos');
  const [avatarId, setAvatarId] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ userName, setUserName, avatarId, setAvatarId }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
