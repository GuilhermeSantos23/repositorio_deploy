/**
 * Serviço de consulta de endereço por CEP.
 *
 * MOCK — ainda não existe integração real com uma API de CEP (ex.: ViaCEP).
 * A função abaixo simula a latência e o formato de resposta esperados,
 * para que a troca futura pelo serviço real exija apenas reescrever
 * o corpo desta função, sem alterar quem a consome.
 */

export interface AddressLookupResult {
  street: string;
  city: string;
}

const MOCK_ADDRESS_BY_CEP: Record<string, AddressLookupResult> = {
  '07000000': { street: 'Avenida Guapira', city: 'Guarulhos' },
  '01310100': { street: 'Avenida Paulista', city: 'São Paulo' },
  '04538133': { street: 'Avenida Brigadeiro Faria Lima', city: 'São Paulo' },
  '05407002': { street: 'Rua Cardeal Arcoverde', city: 'São Paulo' },
  '02011000': { street: 'Avenida Engenheiro Caetano Álvares', city: 'São Paulo' },
};

const FALLBACK_ADDRESS: AddressLookupResult = {
  street: 'Rua Exemplo (endereço mock)',
  city: 'São Paulo',
};

/**
 * Busca o endereço de um CEP.
 * TODO(backend): substituir por chamada real a uma API de CEP.
 */
export function lookupAddressByCep(cep: string): Promise<AddressLookupResult | null> {
  const digits = cep.replace(/\D/g, '');

  return new Promise((resolve) => {
    setTimeout(() => {
      if (digits.length !== 8) {
        resolve(null);
        return;
      }
      resolve(MOCK_ADDRESS_BY_CEP[digits] ?? FALLBACK_ADDRESS);
    }, 500);
  });
}
