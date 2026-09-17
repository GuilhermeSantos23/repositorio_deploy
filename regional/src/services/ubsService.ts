import type { UBS, UBSFormData, UBSSearchCriterion, UBSStatus } from '../types/ubs';
import { CURRENT_REGIONAL_ADMIN } from '../mocks/session';
import { onlyDigits } from '../utils/masks';

/**
 * Serviço de UBSs (Unidades Básicas de Saúde).
 *
 * MOCK — os dados abaixo são fictícios e existem apenas para demonstrar
 * o funcionamento do módulo. Nenhuma informação aqui é real.
 *
 * Segue o mesmo padrão de src/services/clinicService.ts: a camada de UI
 * conversa apenas com as funções exportadas deste arquivo. Quando o
 * backend estiver disponível, cada função pode ser reescrita para chamar
 * a API real (ex.: GET/POST/PUT /ubs) mantendo a mesma assinatura, sem
 * exigir mudanças nas telas.
 */

function delay<T>(value: T, ms = 500): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

let mockUBSs: UBS[] = [
  {
    id: 'ubs-1',
    code: 'UBS-001',
    name: 'UBS Jardim Paulista',
    address: 'Rua Haddock Lobo, 595, Jardim Paulista',
    city: 'São Paulo',
    region: CURRENT_REGIONAL_ADMIN.region,
    phone: '(11) 3062-1145',
    email: 'ubs.jardimpaulista@saude.prefsp.gov.br',
    status: 'operando',
    administrators: [
      {
        id: 'ubs-1-admin-1',
        name: 'Carlos Mendes',
        cpf: '234.567.890-12',
        email: 'carlos.mendes@saude.prefsp.gov.br',
        phone: '(11) 98765-4321',
        temporaryPassword: 'Ubs@2026',
        login: '23456789012',
      },
    ],
    history: [
      { id: 'ubs-1-hist-1', action: 'UBS cadastrada', performedBy: CURRENT_REGIONAL_ADMIN.name },
    ],
  },
  {
    id: 'ubs-2',
    code: 'UBS-002',
    name: 'UBS Vila Mariana',
    address: 'Rua Domingos de Morais, 2200, Vila Mariana',
    city: 'São Paulo',
    region: CURRENT_REGIONAL_ADMIN.region,
    phone: '(11) 5573-2288',
    email: 'ubs.vilamariana@saude.prefsp.gov.br',
    status: 'interditada',
    administrators: [
      {
        id: 'ubs-2-admin-1',
        name: 'Patrícia Lima',
        cpf: '345.678.901-23',
        email: 'patricia.lima@saude.prefsp.gov.br',
        phone: '(11) 98888-2222',
        temporaryPassword: 'Ubs@2026',
        login: '34567890123',
      },
    ],
    history: [
      { id: 'ubs-2-hist-1', action: 'UBS cadastrada', performedBy: CURRENT_REGIONAL_ADMIN.name },
      { id: 'ubs-2-hist-2', action: 'UBS interditada para reforma', performedBy: CURRENT_REGIONAL_ADMIN.name },
    ],
  },
  {
    id: 'ubs-3',
    code: 'UBS-003',
    name: 'UBS Itaim Bibi',
    address: 'Rua Joaquim Floriano, 100, Itaim Bibi',
    city: 'São Paulo',
    region: CURRENT_REGIONAL_ADMIN.region,
    phone: '(11) 3168-4477',
    email: 'ubs.itaimbibi@saude.prefsp.gov.br',
    status: 'operando',
    administrators: [
      {
        id: 'ubs-3-admin-1',
        name: 'Roberto Alves',
        cpf: '456.789.012-34',
        email: 'roberto.alves@saude.prefsp.gov.br',
        phone: '(11) 97777-3333',
        temporaryPassword: 'Ubs@2026',
        login: '45678901234',
      },
    ],
    history: [
      { id: 'ubs-3-hist-1', action: 'UBS cadastrada', performedBy: CURRENT_REGIONAL_ADMIN.name },
    ],
  },
  {
    id: 'ubs-4',
    code: 'UBS-004',
    name: 'UBS Pinheiros',
    address: 'Rua Teodoro Sampaio, 1500, Pinheiros',
    city: 'São Paulo',
    region: CURRENT_REGIONAL_ADMIN.region,
    phone: '(11) 3819-2233',
    email: 'ubs.pinheiros@saude.prefsp.gov.br',
    status: 'operando',
    administrators: [
      {
        id: 'ubs-4-admin-1',
        name: 'Lúcia Ferreira',
        cpf: '567.890.123-45',
        email: 'lucia.ferreira@saude.prefsp.gov.br',
        phone: '(11) 96666-4444',
        temporaryPassword: 'Ubs@2026',
        login: '56789012345',
      },
      {
        id: 'ubs-4-admin-2',
        name: 'Bruno Martins',
        cpf: '111.222.333-44',
        email: 'bruno.martins@saude.prefsp.gov.br',
        phone: '(11) 96666-5555',
        temporaryPassword: 'Ubs@2026',
        login: '11122233344',
      },
    ],
    history: [
      { id: 'ubs-4-hist-1', action: 'UBS cadastrada', performedBy: CURRENT_REGIONAL_ADMIN.name },
    ],
  },
  {
    id: 'ubs-5',
    code: 'UBS-005',
    name: 'UBS Santana',
    address: 'Avenida Cruzeiro do Sul, 1200, Santana',
    city: 'São Paulo',
    region: CURRENT_REGIONAL_ADMIN.region,
    phone: '(11) 2950-1122',
    email: 'ubs.santana@saude.prefsp.gov.br',
    status: 'operacoes_encerradas',
    administrators: [
      {
        id: 'ubs-5-admin-1',
        name: 'Joana Souza',
        cpf: '678.901.234-56',
        email: 'joana.souza@saude.prefsp.gov.br',
        phone: '(11) 98111-2222',
        temporaryPassword: 'Ubs@2026',
        login: '67890123456',
      },
    ],
    history: [
      { id: 'ubs-5-hist-1', action: 'UBS cadastrada', performedBy: CURRENT_REGIONAL_ADMIN.name },
      { id: 'ubs-5-hist-2', action: 'Unidade encerrou definitivamente as atividades', performedBy: CURRENT_REGIONAL_ADMIN.name },
    ],
  },
  {
    id: 'ubs-6',
    code: 'UBS-006',
    name: 'UBS Tatuapé',
    address: 'Rua Antônio Bicudo, 340, Tatuapé',
    city: 'São Paulo',
    region: CURRENT_REGIONAL_ADMIN.region,
    phone: '(11) 2098-3344',
    email: 'ubs.tatuape@saude.prefsp.gov.br',
    status: 'operando',
    administrators: [
      {
        id: 'ubs-6-admin-1',
        name: 'Fernando Costa',
        cpf: '789.012.345-67',
        email: 'fernando.costa@saude.prefsp.gov.br',
        phone: '(11) 98222-3333',
        temporaryPassword: 'Ubs@2026',
        login: '78901234567',
      },
    ],
    history: [
      { id: 'ubs-6-hist-1', action: 'UBS cadastrada', performedBy: CURRENT_REGIONAL_ADMIN.name },
    ],
  },
  {
    id: 'ubs-7',
    code: 'UBS-007',
    name: 'UBS Campo Belo',
    address: 'Avenida Santo Amaro, 3200, Campo Belo',
    city: 'São Paulo',
    region: CURRENT_REGIONAL_ADMIN.region,
    phone: '(11) 5044-7788',
    email: 'ubs.campobelo@saude.prefsp.gov.br',
    status: 'fechada',
    administrators: [
      {
        id: 'ubs-7-admin-1',
        name: 'Marina Rocha',
        cpf: '890.123.456-78',
        email: 'marina.rocha@saude.prefsp.gov.br',
        phone: '(11) 98333-4444',
        temporaryPassword: 'Ubs@2026',
        login: '89012345678',
      },
    ],
    history: [
      { id: 'ubs-7-hist-1', action: 'UBS cadastrada', performedBy: CURRENT_REGIONAL_ADMIN.name },
      { id: 'ubs-7-hist-2', action: 'Unidade encerrou operações (falência)', performedBy: CURRENT_REGIONAL_ADMIN.name },
    ],
  },
];

export function listUBSs(): Promise<UBS[]> {
  return delay([...mockUBSs]);
}

export function searchUBSs(
  query: string,
  criterion: UBSSearchCriterion = 'ubs',
): Promise<UBS[]> {
  const term = query.trim().toLowerCase();

  if (!term) {
    return delay([...mockUBSs]);
  }

  // Termo normalizado (apenas dígitos) para permitir buscar o
  // administrador também pelo CPF, formatado ou não.
  const digitsTerm = onlyDigits(query);

  const filtered = mockUBSs.filter((ubs) => {
    if (criterion === 'administrator') {
      return ubs.administrators.some((admin) => {
        const nameMatches = admin.name.toLowerCase().includes(term);
        const cpfMatches =
          digitsTerm.length > 0 && onlyDigits(admin.cpf).includes(digitsTerm);
        return nameMatches || cpfMatches;
      });
    }
    return ubs.name.toLowerCase().includes(term) || ubs.code.toLowerCase().includes(term);
  });

  return delay(filtered);
}

export function getUBSById(id: string): Promise<UBS | null> {
  return delay(mockUBSs.find((ubs) => ubs.id === id) ?? null);
}

export function getUBSStats(): Promise<{
  total: number;
  operando: number;
  interditada: number;
  fechada: number;
  operacoesEncerradas: number;
}> {
  function countByStatus(status: UBSStatus): number {
    return mockUBSs.filter((ubs) => ubs.status === status).length;
  }

  return delay({
    total: mockUBSs.length,
    operando: countByStatus('operando'),
    interditada: countByStatus('interditada'),
    fechada: countByStatus('fechada'),
    operacoesEncerradas: countByStatus('operacoes_encerradas'),
  });
}

/**
 * Cadastra uma nova UBS.
 * TODO(backend): substituir corpo por POST /ubs.
 */
export function createUBS(data: UBSFormData): Promise<UBS> {
  const id = `ubs-${Date.now()}`;

  const newUBS: UBS = {
    id,
    code: data.code,
    name: data.name,
    address: data.address,
    city: data.city,
    region: data.region,
    phone: data.phone,
    email: data.email,
    status: data.status,
    administrators: data.administrators.map((admin, index) => ({
      id: `${id}-admin-${index + 1}`,
      ...admin,
    })),
    history: [
      {
        id: `${id}-hist-1`,
        action: 'UBS cadastrada',
        performedBy: CURRENT_REGIONAL_ADMIN.name,
      },
    ],
  };

  mockUBSs = [newUBS, ...mockUBSs];

  return delay(newUBS, 700);
}

/**
 * Altera uma UBS existente.
 * TODO(backend): substituir corpo por PUT /ubs/{id}.
 */
export function updateUBS(id: string, data: UBSFormData): Promise<UBS | null> {
  const index = mockUBSs.findIndex((ubs) => ubs.id === id);

  if (index === -1) {
    return delay(null);
  }

  const existing = mockUBSs[index];

  const updated: UBS = {
    ...existing,
    code: data.code,
    name: data.name,
    address: data.address,
    city: data.city,
    region: data.region,
    phone: data.phone,
    email: data.email,
    status: data.status,
    administrators: data.administrators.map((admin, i) => ({
      id: existing.administrators[i]?.id ?? `${id}-admin-${i + 1}`,
      ...admin,
    })),
    history: [
      ...existing.history,
      {
        id: `${id}-hist-${existing.history.length + 1}`,
        action: 'UBS alterada',
        performedBy: CURRENT_REGIONAL_ADMIN.name,
      },
    ],
  };

  mockUBSs = [
    ...mockUBSs.slice(0, index),
    updated,
    ...mockUBSs.slice(index + 1),
  ];

  return delay(updated, 700);
}

/**
 * Remove uma UBS.
 * TODO(backend): substituir corpo por DELETE /ubs/{id}.
 */
export function deleteUBS(id: string): Promise<boolean> {
  const existedBefore = mockUBSs.some((ubs) => ubs.id === id);
  mockUBSs = mockUBSs.filter((ubs) => ubs.id !== id);
  return delay(existedBefore, 400);
}
