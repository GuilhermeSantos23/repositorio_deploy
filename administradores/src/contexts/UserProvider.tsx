import { useState, type ReactNode } from 'react';
import { UserContext } from './userContext';
import { CURRENT_UNIT_ADMIN } from '../mocks/session';

interface UserProviderProps {
  children: ReactNode;
}

// O nome e o avatar abaixo são apenas o estado inicial.
// Futuramente virão do backend, assim que a autenticação do usuário existir.
function UserProvider({ children }: UserProviderProps) {
  const [userName, setUserName] = useState(
    `${CURRENT_UNIT_ADMIN.firstName} ${CURRENT_UNIT_ADMIN.lastName}`.trim(),
  );
  const [avatarId, setAvatarId] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ userName, setUserName, avatarId, setAvatarId }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
