import { useState, type ReactNode } from 'react';
import { UserContext, type ProfileData } from './userContext';
import type { RegisterData, User } from '../types/user';
import {
  alterarSenha,
  autenticarUsuario,
  atualizarUsuario,
  buscarCpfLogado,
  buscarUsuarioPorCpfPublico,
  cadastrarUsuario,
  garantirUsuarioDeTeste,
  removerUsuarioLogado,
  salvarUsuarioLogado,
} from '../services/userService';

interface UserProviderProps {
  children: ReactNode;
}

// Usuário "vazio", usado apenas enquanto ninguém está logado, para que
// o resto do sistema não precise ficar checando "null" o tempo todo.
const USUARIO_VAZIO: User = {
  firstName: '',
  lastName: '',
  fullName: '',
  cpf: '',
  password: '',
  region: 'Não informada',
  avatarId: null,
};

// Verifica se já existe um CPF logado salvo no localStorage (login
// "lembrado" entre recarregamentos de página) e devolve o usuário
// correspondente, ou o usuário vazio, se não houver ninguém logado.
// Fica fora do componente e é usada como inicializador preguiçoso do
// useState, para não precisar de um useEffect só para ler o estado
// inicial (o que causaria uma renderização extra desnecessária).
function buscarEstadoInicial(): { usuario: User; autenticado: boolean } {
  garantirUsuarioDeTeste();

  const cpfLogado = buscarCpfLogado();

  if (cpfLogado) {
    const usuarioEncontrado = buscarUsuarioPorCpfPublico(cpfLogado);

    if (usuarioEncontrado) {
      return { usuario: usuarioEncontrado, autenticado: true };
    }
  }

  return { usuario: USUARIO_VAZIO, autenticado: false };
}

// Guarda o usuário logado e disponibiliza as ações de login, cadastro,
// logout e atualização de perfil para todo o sistema.
function UserProvider({ children }: UserProviderProps) {
  const [usuarioLogado, setUsuarioLogado] = useState<User>(
    () => buscarEstadoInicial().usuario,
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => buscarEstadoInicial().autenticado,
  );

  async function login(cpf: string, senha: string) {
    const { resultado, usuario } = await autenticarUsuario(cpf, senha);

    if (resultado.success && usuario) {
      setUsuarioLogado(usuario);
      setIsAuthenticated(true);
      salvarUsuarioLogado(usuario.cpf);
    }

    return resultado;
  }

  async function register(dados: RegisterData) {
    return await cadastrarUsuario(dados);
  }

  function logout() {
    removerUsuarioLogado();
    setUsuarioLogado(USUARIO_VAZIO);
    setIsAuthenticated(false);
  }

  // Altera um campo do usuário logado e salva a alteração no
  // localStorage, mantendo os dois sempre sincronizados.
  function atualizarCampo(usuarioComAlteracao: User) {
    setUsuarioLogado(usuarioComAlteracao);
    atualizarUsuario(usuarioComAlteracao);
  }

  function setAvatarId(novoAvatarId: string | null) {
    atualizarCampo({ ...usuarioLogado, avatarId: novoAvatarId });
  }

  // Salva TODOS os campos do Perfil de uma vez só.
  // Antes existiam três funções separadas (nome, contato e região) e
  // cada uma partia do mesmo usuário guardado no estado. Como o React
  // só atualiza o estado depois que a função termina, a segunda chamada
  // desfazia a primeira e a terceira desfazia a segunda: na prática, só
  // a última alteração era salva. Com uma função única isso não
  // acontece mais.
  function updateProfile(dados: ProfileData) {
    let regiaoFinal = dados.region.trim();

    if (regiaoFinal === '') {
      regiaoFinal = 'Não informada';
    }

    const primeiroNome = dados.firstName.trim();
    const sobrenome = dados.lastName.trim();
    const nomeCompleto = `${primeiroNome} ${sobrenome}`.trim();

    const usuarioAtualizado: User = {
      ...usuarioLogado,
      firstName: primeiroNome,
      lastName: sobrenome,
      fullName: nomeCompleto,
      email: dados.email,
      phone: dados.phone,
      susCard: dados.susCard,
      region: regiaoFinal,
    };

    atualizarCampo(usuarioAtualizado);
  }

  // Troca a senha do usuário logado.
  // O userService confere a senha atual e a confirmação; aqui, quando
  // dá certo, também atualizamos o usuário guardado no estado, para que
  // o restante do sistema não continue trabalhando com a senha antiga.
  async function changePassword(
    senhaAtual: string,
    novaSenha: string,
    confirmacaoNovaSenha: string,
  ) {
    const resultado = await alterarSenha(
      usuarioLogado.cpf,
      senhaAtual,
      novaSenha,
      confirmacaoNovaSenha,
    );

    if (resultado.success) {
      setUsuarioLogado({ ...usuarioLogado, password: novaSenha });
    }

    return resultado;
  }

  return (
    <UserContext.Provider
      value={{
        isAuthenticated,
        login,
        register,
        logout,
        userName: usuarioLogado.firstName || 'Usuário',
        firstName: usuarioLogado.firstName,
        lastName: usuarioLogado.lastName,
        fullName: usuarioLogado.fullName,
        cpf: usuarioLogado.cpf,
        region: usuarioLogado.region,
        avatarId: usuarioLogado.avatarId,
        email: usuarioLogado.email ?? '',
        phone: usuarioLogado.phone ?? '',
        susCard: usuarioLogado.susCard ?? '',
        setAvatarId,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
