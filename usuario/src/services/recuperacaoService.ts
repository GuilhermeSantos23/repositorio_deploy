// Serviço da recuperação de acesso ("Esqueci minha senha").
//
// IMPORTANTE: o projeto ainda NÃO possui API de backend integrada nem
// endpoints de recuperação. Por isso estas funções NÃO simulam sucesso:
// elas devolvem o status 'nao_integrado'. As telas já tratam todos os
// status abaixo; quando o backend existir, só o corpo destas duas funções
// precisa ser trocado por chamadas à API.
//
// Os nomes dos status são internos do frontend (não são um contrato com
// o backend). O que o backend precisa fornecer está descrito no relatório
// de entrega, na seção de pendências.

export type SolicitacaoCodigoResultado =
  | { status: 'enviado' }
  // Reenvio pedido antes do intervalo permitido pelo backend.
  | { status: 'aguardar'; segundos: number }
  | { status: 'erro_conexao' }
  | { status: 'nao_integrado' };

export type ValidacaoCodigoResultado =
  // Só deve ser devolvido quando o backend confirmar o código e fornecer
  // a sessão/credencial de autenticação.
  | { status: 'ok' }
  | { status: 'invalido' }
  | { status: 'expirado' }
  | { status: 'tentativas_excedidas' }
  | { status: 'erro_conexao' }
  | { status: 'nao_integrado' };

// Pede ao backend o envio do código de 6 dígitos para o e-mail cadastrado
// na conta do CPF informado.
export async function solicitarCodigoRecuperacao(
  cpf: string,
): Promise<SolicitacaoCodigoResultado> {
  void cpf;
  return { status: 'nao_integrado' };
}

// Envia o código digitado ao backend, que é quem decide se ele é válido.
export async function validarCodigoRecuperacao(
  cpf: string,
  codigo: string,
): Promise<ValidacaoCodigoResultado> {
  void cpf;
  void codigo;
  return { status: 'nao_integrado' };
}
