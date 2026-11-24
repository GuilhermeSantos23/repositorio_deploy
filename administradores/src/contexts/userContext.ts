import { createContext } from 'react';

export interface UserContextValue {
  userName: string;
  setUserName: (name: string) => void;
  avatarId: string | null;
  setAvatarId: (id: string | null) => void;
}

export const UserContext = createContext<UserContextValue | undefined>(undefined);
