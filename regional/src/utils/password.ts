import { generate } from 'generate-password-browser';

/**
 * Gera uma senha provisória segura para um administrador de clínica.
 *
 * Usa a biblioteca `generate-password-browser` (segura para rodar no
 * navegador) em vez de uma implementação caseira com Math.random().
 *
 * A senha nunca é digitada pelo usuário — apenas exibida para consulta
 * e, futuramente, enviada ao backend junto com o cadastro do
 * administrador.
 */
export function generateTemporaryPassword(): string {
  return generate({
    length: 12,
    numbers: true,
    symbols: true,
    uppercase: true,
    lowercase: true,
    strict: true,
    excludeSimilarCharacters: true,
  });
}
