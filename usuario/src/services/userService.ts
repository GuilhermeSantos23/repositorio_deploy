import type { AuthResult, RegisterData, User } from '../types/user';

// Chave usada para guardar a lista de usuários cadastrados.
const CHAVE_USUARIOS = 'vacmais-usuarios';

// Chave usada para lembrar qual usuário está logado no momento.
const CHAVE_USUARIO_LOGADO = 'vacmais-usuario-logado';

// Lê a lista de usuários cadastrados no localStorage.
// Se ainda não existir nada salvo, retorna uma lista vazia.
function buscarUsuarios(): User[] {
  const dadosSalvos = localStorage.getItem(CHAVE_USUARIOS);

  if (!dadosSalvos) {
    return [];
  }

  try {
    return JSON.parse(dadosSalvos) as User[];
  } catch {
    return [];
  }
}

// Salva a lista completa de usuários no localStorage.
function salvarUsuarios(usuarios: User[]): void {
  localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
}

// Procura um usuário pelo CPF. Retorna o usuário encontrado ou null.
function encontrarUsuarioPorCpf(cpf: string): User | null {
  const usuarios = buscarUsuarios();

  for (const usuarioAtual of usuarios) {
    if (usuarioAtual.cpf === cpf) {
      return usuarioAtual;
    }
  }

  return null;
}

// Verifica se o CPF já está cadastrado.
export async function cpfJaCadastrado(cpf: string): Promise<boolean> {
  const usuarioEncontrado = encontrarUsuarioPorCpf(cpf);
  return usuarioEncontrado !== null;
}

// CPF do usuário de teste pré-cadastrado, usado para facilitar os
// testes manuais do sistema sem precisar passar pela tela de Cadastro.
const CPF_USUARIO_TESTE = '111.111.111-11';

// Garante que exista um usuário de teste já cadastrado no localStorage.
// Se ele ainda não existir (ex: primeira vez que o app abre em um
// navegador novo), cria o usuário. Se já existir, não faz nada, para
// não sobrescrever alterações que o próprio usuário de teste já tenha
// feito (ex: troca de região ou de senha).
export function garantirUsuarioDeTeste(): void {
  const usuarioTesteJaExiste = encontrarUsuarioPorCpf(CPF_USUARIO_TESTE);

  if (usuarioTesteJaExiste) {
    return;
  }

  const usuarioDeTeste: User = {
    firstName: 'João',
    lastName: 'da Silva Santos',
    fullName: 'João da Silva Santos',
    cpf: CPF_USUARIO_TESTE,
    password: '123',
    region: 'Guarulhos',
    avatarId: null,
    email: 'joao.santos@email.com',
    phone: '(11) 91234-5678',
    susCard: '123456789012345',
  };

  const usuarios = buscarUsuarios();
  usuarios.push(usuarioDeTeste);
  salvarUsuarios(usuarios);
}

// Cadastra um novo usuário no localStorage.
// A intenção é manter a separação Página -> Service -> localStorage,
// para futuramente trocar o localStorage por uma API real.
export async function cadastrarUsuario(
  dadosCadastro: RegisterData,
): Promise<AuthResult> {
  try {
    if (!dadosCadastro.acceptedTerms) {
      return {
        success: false,
        message: 'É necessário aceitar os Termos de Uso para se cadastrar.',
      };
    }

    const cpfDuplicado = await cpfJaCadastrado(dadosCadastro.cpf);

    if (cpfDuplicado) {
      return {
        success: false,
        message: 'Já existe uma conta cadastrada com este CPF.',
      };
    }

    const nomeCompleto = `${dadosCadastro.firstName} ${dadosCadastro.lastName}`.trim();

    const novoUsuario: User = {
      firstName: dadosCadastro.firstName,
      lastName: dadosCadastro.lastName,
      fullName: nomeCompleto,
      cpf: dadosCadastro.cpf,
      password: dadosCadastro.password,
      region: 'Não informada',
      avatarId: null,
      email: dadosCadastro.email,
      phone: dadosCadastro.phone,
      susCard: dadosCadastro.susCard,
    };

    const usuarios = buscarUsuarios();
    usuarios.push(novoUsuario);
    salvarUsuarios(usuarios);

    return { success: true, message: 'Cadastro efetuado com sucesso.' };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Não foi possível concluir o cadastro. Tente novamente.',
    };
  }
}

// Confere CPF e senha e retorna o usuário encontrado, se estiverem
// corretos. Segue o fluxo descrito no mega prompt:
// procura CPF -> encontrou? -> confere senha -> confere.
export async function autenticarUsuario(
  cpf: string,
  senha: string,
): Promise<{ resultado: AuthResult; usuario: User | null }> {
  try {
    const usuarioEncontrado = encontrarUsuarioPorCpf(cpf);

    if (!usuarioEncontrado) {
      return {
        resultado: { success: false, message: 'Usuário ou senha incorreto.' },
        usuario: null,
      };
    }

    if (usuarioEncontrado.password !== senha) {
      return {
        resultado: { success: false, message: 'Usuário ou senha incorreto.' },
        usuario: null,
      };
    }

    return {
      resultado: { success: true, message: 'Login realizado com sucesso.' },
      usuario: usuarioEncontrado,
    };
  } catch (error) {
    console.error(error);
    return {
      resultado: {
        success: false,
        message: 'Não foi possível fazer login. Tente novamente.',
      },
      usuario: null,
    };
  }
}

// Atualiza os dados de um usuário já cadastrado (ex: região, avatar,
// nome). Encontra o usuário pelo CPF e substitui o registro salvo.
export async function atualizarUsuario(usuarioAtualizado: User): Promise<void> {
  const usuarios = buscarUsuarios();
  const novaLista: User[] = [];

  for (const usuarioAtual of usuarios) {
    if (usuarioAtual.cpf === usuarioAtualizado.cpf) {
      novaLista.push(usuarioAtualizado);
    } else {
      novaLista.push(usuarioAtual);
    }
  }

  salvarUsuarios(novaLista);
}

// Guarda/lê/remove o CPF do usuário que está logado agora, para que o
// login continue "lembrado" se a página for recarregada.
export function salvarUsuarioLogado(cpf: string): void {
  localStorage.setItem(CHAVE_USUARIO_LOGADO, cpf);
}

export function buscarCpfLogado(): string | null {
  return localStorage.getItem(CHAVE_USUARIO_LOGADO);
}

export function removerUsuarioLogado(): void {
  localStorage.removeItem(CHAVE_USUARIO_LOGADO);
}

export function buscarUsuarioPorCpfPublico(cpf: string): User | null {
  return encontrarUsuarioPorCpf(cpf);
}

// Troca a senha do usuário logado. Confere a senha atual, confere se a
// nova senha e a confirmação são iguais e só então salva a nova senha
// no localStorage.
export async function alterarSenha(
  cpf: string,
  senhaAtual: string,
  novaSenha: string,
  confirmacaoNovaSenha: string,
): Promise<AuthResult> {
  try {
    const usuarioEncontrado = encontrarUsuarioPorCpf(cpf);

    if (!usuarioEncontrado) {
      return { success: false, message: 'Usuário não encontrado.' };
    }

    if (usuarioEncontrado.password !== senhaAtual) {
      return { success: false, message: 'Senha atual incorreta.' };
    }

    if (!novaSenha.trim() || !confirmacaoNovaSenha.trim()) {
      return { success: false, message: 'Preencha a nova senha e a confirmação.' };
    }

    if (novaSenha !== confirmacaoNovaSenha) {
      return { success: false, message: 'A nova senha e a confirmação não coincidem.' };
    }

    const usuarioComNovaSenha: User = {
      ...usuarioEncontrado,
      password: novaSenha,
    };

    await atualizarUsuario(usuarioComNovaSenha);

    return { success: true, message: 'Senha alterada com sucesso.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Não foi possível alterar a senha.' };
  }
}
