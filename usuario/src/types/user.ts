// Estrutura de dados do usuário (cidadão) do Vac+.
// firstName e lastName são os campos digitados pelo usuário no cadastro.
// fullName é sempre calculado a partir dos dois (nunca digitado direto).
export interface User {
  firstName: string;
  lastName: string;
  fullName: string;
  cpf: string;
  password: string;
  region: string;
  avatarId: string | null;
  // Campos que já existiam no formulário de Cadastro antes deste
  // mega prompt. Continuam opcionais para não obrigar quem já estava
  // usando o tipo User sem eles.
  email?: string;
  phone?: string;
  susCard?: string;
}

// Dados que o formulário de Cadastro precisa coletar.
// A senha aqui ainda não está criptografada porque o projeto usa
// localStorage nesta versão (sem backend).
export interface RegisterData {
  firstName: string;
  lastName: string;
  cpf: string;
  password: string;
  acceptedTerms: boolean;
  email?: string;
  phone?: string;
  susCard?: string;
}

// Resultado padrão devolvido pelos serviços de autenticação, para a
// página saber se deu certo e qual mensagem mostrar ao usuário.
export interface AuthResult {
  success: boolean;
  message: string;
}
