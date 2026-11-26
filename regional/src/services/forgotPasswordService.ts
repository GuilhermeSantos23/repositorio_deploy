/**
 * Serviço de recuperação de senha.
 *
 * MOCK — ainda não existe backend para recuperação de senha. Este
 * serviço simula as duas etapas do fluxo (CPF -> código), sem enviar
 * e-mail real e sem validar um código de verdade. Depois que o código
 * é aceito, o usuário entra no sistema — não há redefinição de senha.
 *
 * Fluxo futuro esperado, quando o backend existir:
 *
 *   CPF
 *    -> POST /forgot-password
 *    -> backend localiza o administrador e envia um código ao e-mail
 *       cadastrado
 *
 *   Código
 *    -> POST /verify-code
 *    -> backend valida o código enviado por e-mail e libera o acesso
 *
 * Os endpoints acima são apenas uma representação arquitetural do
 * fluxo — o contrato real será definido quando o backend existir. A
 * troca de cada mock pela chamada real deve exigir apenas reescrever
 * o corpo da função correspondente, mantendo a mesma assinatura.
 */

function delay<T>(value: T, ms = 800): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

/**
 * MOCK — como ainda não existe backend, o código "enviado por
 * e-mail" não é validado de verdade: qualquer código com 6 dígitos
 * preenchido é aceito. O objetivo aqui é simular a experiência do
 * fluxo real, não validar um código de verdade. Este valor nunca é
 * exibido na interface.
 */
const MOCK_ACCEPTED_CODE_LENGTH = 6;

export interface PasswordRecoveryResult {
  success: boolean;
}

export interface VerifyRecoveryCodeResult {
  success: boolean;
}

/**
 * Inicia a recuperação de senha a partir do CPF informado.
 * Em produção, esta etapa é responsável por localizar o administrador
 * e disparar o e-mail com o código de verificação.
 * TODO(backend): substituir por uma chamada real (ex.: POST /forgot-password).
 */
export function requestPasswordRecovery(cpf: string): Promise<PasswordRecoveryResult> {
  return delay({ success: cpf.replace(/\D/g, '').length === 11 });
}

/**
 * Reenvia o código de verificação para o e-mail cadastrado.
 * Reaproveita a mesma operação mock de envio.
 * TODO(backend): substituir por uma chamada real (ex.: POST /forgot-password).
 */
export function resendRecoveryCode(cpf: string): Promise<PasswordRecoveryResult> {
  return requestPasswordRecovery(cpf);
}

/**
 * Valida o código de verificação informado pelo usuário.
 * TODO(backend): substituir por uma chamada real (ex.: POST /verify-code).
 */
export function verifyRecoveryCode(
  cpf: string,
  code: string,
): Promise<VerifyRecoveryCodeResult> {
  const digits = code.replace(/\D/g, '');
  return delay({
    success:
      cpf.replace(/\D/g, '').length === 11 &&
      digits.length === MOCK_ACCEPTED_CODE_LENGTH,
  });
}
