export function maskCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function maskCNPJ(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 14);

  return digits
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

export function maskCEP(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);

  return digits.replace(/(\d{5})(\d{1,3})$/, '$1-$2');
}

export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d{1,4})$/, '$1-$2');
  }

  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
}

/**
 * Normaliza um CPF (com ou sem máscara) para uso como login do
 * administrador: apenas os dígitos, sem pontuação.
 */
export function cpfToLogin(cpf: string): string {
  return cpf.replace(/\D/g, '');
}

/**
 * Remove qualquer caractere não numérico de um valor.
 * Usado para normalizar CPFs (e outros campos numéricos) antes de
 * comparações, já que o usuário pode digitar com ou sem pontuação.
 */
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Mantém apenas dígitos em um campo controlado, limitando a
 * quantidade de caracteres quando informado (ex.: código de
 * verificação de 6 dígitos).
 */
export function maskNumeric(value: string, maxLength?: number): string {
  const digits = onlyDigits(value);
  return typeof maxLength === 'number' ? digits.slice(0, maxLength) : digits;
}
