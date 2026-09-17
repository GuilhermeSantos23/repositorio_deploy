import { createContext } from 'react';
import type { RegisterData } from '../types/user';

// Campos que a aba Perfil pode alterar.
export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  susCard: string;
  region: string;
}

export interface UserContextValue {
  // Autenticação
  isAuthenticated: boolean;
  login: (
    cpf: string,
    senha: string,
  ) => Promise<{ success: boolean; message: string }>;
  register: (
    dados: RegisterData,
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;

  // Dados do usuário logado.
  // "userName" continua existindo (mesmo nome de antes) para não quebrar
  // o Header e o UserAvatar, mas agora representa o firstName, conforme
  // a regra: o primeiro nome é o que aparece no Header e no avatar.
  userName: string;
  firstName: string;
  lastName: string;
  fullName: string;
  cpf: string;
  region: string;
  avatarId: string | null;
  email: string;
  phone: string;
  susCard: string;

  // Ações usadas pela página de Configurações.
  setAvatarId: (id: string | null) => void;
  // Salva todos os campos do Perfil de uma vez só. É importante que
  // seja uma única função: se cada campo fosse salvo separadamente,
  // uma alteração acabaria apagando a outra, porque todas partem do
  // mesmo usuário que está guardado no estado.
  updateProfile: (dados: ProfileData) => void;
  // Troca a senha do usuário logado (confere a senha atual, confere a
  // confirmação e salva no localStorage).
  changePassword: (
    senhaAtual: string,
    novaSenha: string,
    confirmacaoNovaSenha: string,
  ) => Promise<{ success: boolean; message: string }>;
}

export const UserContext = createContext<UserContextValue | undefined>(
  undefined,
);
