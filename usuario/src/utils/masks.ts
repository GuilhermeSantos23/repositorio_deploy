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
