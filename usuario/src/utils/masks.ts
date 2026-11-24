export function maskCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function maskTelefone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
}

// Máscara visual do Cartão SUS: 15 dígitos, agrupados como
// "XXX XXXX XXXX XXXX". Por dentro, o sistema guarda somente os
// números (sem espaço), e esta função só é usada para exibir o valor
// formatado na tela.
export function maskCartaoSus(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 15);

  return digits
    .replace(/(\d{3})(\d)/, '$1 $2')
    .replace(/(\d{4})(\d)/, '$1 $2')
    .replace(/(\d{4})(\d{1,4})$/, '$1 $2');
}

// Máscara de data de nascimento: DD/MM/AAAA.
export function maskData(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);

  return digits
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2');
}

// Máscara de CEP: 00000-000.
export function maskCEP(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);

  return digits.replace(/(\d{5})(\d)/, '$1-$2');
}

// Deixa somente números, com limite de tamanho. Usada no código de
// recuperação de acesso (6 dígitos), inclusive quando o código é colado.
export function somenteDigitos(value: string, limite: number): string {
  return value.replace(/\D/g, '').slice(0, limite);
}
