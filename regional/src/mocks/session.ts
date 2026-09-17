/**
 * MOCK — dados do administrador regional autenticado.
 *
 * Futuramente deve vir do contexto real de autenticação/login.
 * A região aqui é a mesma exibida hoje no Header (regiaoLabel), para
 * manter a UI consistente enquanto não existe um contexto de sessão real.
 *
 * IMPORTANTE: o administrador regional nunca escolhe a região de uma
 * clínica — ela é sempre derivada deste valor.
 */
export const CURRENT_REGIONAL_ADMIN = {
  name: 'Carla Ribeiro',
  role: 'Admin. Regional',
  region: 'Centro-Sul/SP',
};
