export function maskCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function maskNumeric(value: string, maxLength: number): string {
  return value.replace(/\D/g, '').slice(0, maxLength);
}

export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}

// Usada no campo "Lote" da tela de Estoque. Os códigos já existentes no
// mock (ex.: INF-26A41, HPV-9921) misturam letras, números e hífen, então
// a máscara só normaliza (maiúsculas, remove caracteres inválidos e limita
// o tamanho) em vez de forçar um formato fixo.
export function maskLotCode(value: string): string {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, '')
    .slice(0, 20);
}
