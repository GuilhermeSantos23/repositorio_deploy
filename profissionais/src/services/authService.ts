// Controla a sessão do profissional logado usando localStorage, já que o
// projeto ainda não tem backend/autenticação real. Isso garante que:
// - o botão "Sair" realmente encerra a sessão;
// - páginas protegidas (dentro do MainLayout) não continuam acessíveis
//   pelo botão "voltar" do navegador depois do logout;
// - ao recarregar a página logado, a sessão continua válida.
const SESSION_KEY = 'vacmais:session';

export function login(): void {
  localStorage.setItem(SESSION_KEY, 'true');
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function isAuthenticated(): boolean {
  return localStorage.getItem(SESSION_KEY) === 'true';
}

// ---------------------------------------------------------------------------
// Recuperação de acesso por código (simulada até o backend existir)
// ---------------------------------------------------------------------------

// Código aceito pela simulação. Com o backend, o código é gerado e enviado
// por email, e a conferência passa a ser feita no servidor.
const MOCK_ACCESS_CODE = '123456';

export async function requestAccessCode(_cpf: string, _unitCode: string): Promise<void> {
  // Futuramente: pedir ao backend o envio do código para o email do profissional.
}

export async function verifyAccessCode(_cpf: string, _unitCode: string, code: string): Promise<boolean> {
  return code === MOCK_ACCESS_CODE;
}
