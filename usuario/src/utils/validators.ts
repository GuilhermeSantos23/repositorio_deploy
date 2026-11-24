// Validações usadas nas telas de Cadastro, Login e Recuperação de acesso.
// Cada função recebe o texto digitado e devolve true/false (ou uma
// mensagem de erro, quando o motivo da falha precisa ser explicado).

// CPF com 11 dígitos, não repetidos, e dígitos verificadores corretos.
export function cpfValido(cpf: string): boolean {
  const digitos = cpf.replace(/\D/g, '');

  if (digitos.length !== 11 || /^(\d)\1{10}$/.test(digitos)) {
    return false;
  }

  function calcularDigito(quantidade: number): number {
    let soma = 0;
    for (let i = 0; i < quantidade; i++) {
      soma += Number(digitos[i]) * (quantidade + 1 - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  }

  return (
    calcularDigito(9) === Number(digitos[9]) &&
    calcularDigito(10) === Number(digitos[10])
  );
}

// Apenas confere se o CPF está completo (11 dígitos). Usado no Login,
// que não deve barrar contas já existentes por causa do cálculo do dígito.
export function cpfCompleto(cpf: string): boolean {
  return cpf.replace(/\D/g, '').length === 11;
}

// Valida uma data no formato DD/MM/AAAA. Devolve a mensagem de erro ou
// uma string vazia quando a data é válida.
export function validarDataNascimento(texto: string): string {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(texto)) {
    return 'Informe a data no formato DD/MM/AAAA.';
  }

  const [dia, mes, ano] = texto.split('/').map(Number);
  const data = new Date(ano, mes - 1, dia);

  const dataExiste =
    data.getFullYear() === ano &&
    data.getMonth() === mes - 1 &&
    data.getDate() === dia;

  if (!dataExiste || ano < 1900) {
    return 'Informe uma data de nascimento válida.';
  }

  if (data.getTime() > Date.now()) {
    return 'A data de nascimento não pode ser no futuro.';
  }

  return '';
}

// Converte DD/MM/AAAA para AAAA-MM-DD (formato de data padrão para APIs).
// Só deve ser chamada depois de validarDataNascimento.
export function dataParaIso(texto: string): string {
  const [dia, mes, ano] = texto.split('/');
  return `${ano}-${mes}-${dia}`;
}

export function emailValido(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function cepValido(cep: string): boolean {
  return cep.replace(/\D/g, '').length === 8;
}

// Regra de senha usada no cadastro: mínimo de 8 caracteres, com pelo
// menos uma letra e um número. Devolve a mensagem de erro ou ''.
// ATENÇÃO: a regra oficial deve ser confirmada com o backend.
export function validarSenha(senha: string): string {
  if (senha.length < 8) {
    return 'A senha deve ter pelo menos 8 caracteres.';
  }
  if (!/[A-Za-z]/.test(senha) || !/\d/.test(senha)) {
    return 'A senha deve ter letras e números.';
  }
  return '';
}
