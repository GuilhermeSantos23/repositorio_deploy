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
