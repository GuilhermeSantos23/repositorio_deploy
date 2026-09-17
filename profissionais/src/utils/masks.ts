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

// Remove tudo que não for dígito e limita a quantidade de caracteres.
// Usado em campos como código da unidade e código de verificação, que
// aceitam só números.
export function maskNumeric(value: string, maxLength: number): string {
  return value.replace(/\D/g, '').slice(0, maxLength);
}
