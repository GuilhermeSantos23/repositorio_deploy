import type {
  Clinic,
  ClinicFormData,
  ClinicSearchCriterion,
  ClinicStatus,
} from '../types/clinic';
import { CURRENT_REGIONAL_ADMIN } from '../mocks/session';
import { onlyDigits } from '../utils/masks';

/**
 * Serviço de Clínicas Privadas.
 *
 * MOCK — os dados abaixo são fictícios e existem apenas para demonstrar
 * o funcionamento do módulo. Nenhuma informação aqui é real.
 *
 * A camada de UI conversa apenas com as funções exportadas deste arquivo.
 * Quando o backend estiver disponível, cada função pode ser reescrita
 * para chamar a API real (ex.: GET/POST/PUT /clinicas) mantendo a mesma
 * assinatura, sem exigir mudanças nas telas.
 */

function delay<T>(value: T, ms = 500): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

function generateMockCode(sequence: number): string {
  return `CLN-${String(sequence).padStart(6, '0')}`;
}

let mockClinics: Clinic[] = [
  {
    id: 'clinic-1',
    code: generateMockCode(1),
    name: 'Clínica Vida Nova',
    cnpj: '12.345.678/0001-90',
    cep: '07000-000',
    street: 'Avenida Guapira',
    number: '450',
    city: 'Guarulhos',
    region: CURRENT_REGIONAL_ADMIN.region,
    phone: '(11) 3456-7890',
    email: 'contato@vidanova.com.br',
    status: 'operando',
    administrators: [
      {
        id: 'clinic-1-admin-1',
        name: 'Mauro Andrade',
        cpf: '234.567.890-12',
        email: 'mauro.andrade@vidanova.com.br',
        phone: '(11) 98765-4321',
        temporaryPassword: 'Vida@2026',
        login: '23456789012',
      },
    ],
    history: [
      { id: 'clinic-1-hist-1', action: 'Clínica cadastrada', performedBy: CURRENT_REGIONAL_ADMIN.name },
    ],
  },
  {
    id: 'clinic-2',
    code: generateMockCode(2),
    name: 'Clínica BioVita',
    cnpj: '23.456.789/0001-01',
    cep: '04538-133',
    street: 'Avenida Brigadeiro Faria Lima',
    number: '1200',
    city: 'São Paulo',
    region: CURRENT_REGIONAL_ADMIN.region,
    phone: '(11) 3222-1100',
    email: 'contato@biovita.com.br',
    status: 'interditada',
    administrators: [
      {
        id: 'clinic-2-admin-1',
        name: 'Helena Rocha',
        cpf: '345.678.901-23',
        email: 'helena.rocha@biovita.com.br',
        phone: '(11) 98888-2222',
        temporaryPassword: 'Bio@2026',
        login: '34567890123',
      },
      {
        id: 'clinic-2-admin-2',
        name: 'Igor Mello',
        cpf: '456.789.012-34',
        email: 'igor.mello@biovita.com.br',
        phone: '(11) 97777-3333',
        temporaryPassword: 'Bio@2026',
        login: '45678901234',
      },
    ],
    history: [
      { id: 'clinic-2-hist-1', action: 'Clínica cadastrada', performedBy: CURRENT_REGIONAL_ADMIN.name },
      { id: 'clinic-2-hist-2', action: 'Clínica alterada', performedBy: CURRENT_REGIONAL_ADMIN.name },
    ],
  },
  {
    id: 'clinic-3',
    code: generateMockCode(3),
    name: 'Centro VacinAção',
    cnpj: '34.567.890/0001-12',
    cep: '02011-000',
    street: 'Avenida Engenheiro Caetano Álvares',
    number: '980',
    city: 'São Paulo',
    region: CURRENT_REGIONAL_ADMIN.region,
    phone: '(11) 3555-9090',
    email: 'contato@vacinacao.com.br',
    status: 'fechada',
    administrators: [
      {
        id: 'clinic-3-admin-1',
        name: 'Caio Lopes',
        cpf: '567.890.123-45',
        email: 'caio.lopes@vacinacao.com.br',
        phone: '(11) 96666-4444',
        temporaryPassword: 'Vac@2026',
        login: '56789012345',
      },
    ],
    history: [
      { id: 'clinic-3-hist-1', action: 'Clínica cadastrada', performedBy: CURRENT_REGIONAL_ADMIN.name },
    ],
  },
  // --- MOCK adicional -------------------------------------------------
  // As clínicas abaixo existem apenas para permitir testar a paginação
  // da tabela (mais de uma página de resultados). Não representam
  // unidades reais e podem ser reduzidas/removidas quando o backend
  // estiver disponível.
  {
    id: 'clinic-4',
    code: generateMockCode(4),
    name: 'Clínica Saúde Plena',
    cnpj: '45.678.901-0001-23',
    cep: '05001-000',
    street: 'Rua Cardoso de Almeida',
    number: '210',
    city: 'São Paulo',
    region: CURRENT_REGIONAL_ADMIN.region,
    phone: '(11) 3111-2222',
    email: 'contato@saudeplena.com.br',
    status: 'operando',
    administrators: [
      { id: 'clinic-4-admin-1', name: 'Carla Nogueira', cpf: '678.901.234-56', email: 'carla.nogueira@saudeplena.com.br', phone: '(11) 98111-2222', temporaryPassword: 'Plena@2026', login: '67890123456' },
    ],
    history: [{ id: 'clinic-4-hist-1', action: 'Clínica cadastrada', performedBy: CURRENT_REGIONAL_ADMIN.name }],
  },
  {
    id: 'clinic-5',
    code: generateMockCode(5),
    name: 'Clínica Bem Estar',
    cnpj: '56.789.012-0001-34',
    cep: '05407-000',
    street: 'Rua Teodoro Sampaio',
    number: '800',
    city: 'São Paulo',
    region: CURRENT_REGIONAL_ADMIN.region,
    phone: '(11) 3222-3333',
    email: 'contato@bemestar.com.br',
    status: 'operando',
    administrators: [
      { id: 'clinic-5-admin-1', name: 'João Pereira', cpf: '789.012.345-67', email: 'joao.pereira@bemestar.com.br', phone: '(11) 98222-3333', temporaryPassword: 'Bem@2026', login: '78901234567' },
    ],
    history: [{ id: 'clinic-5-hist-1', action: 'Clínica cadastrada', performedBy: CURRENT_REGIONAL_ADMIN.name }],
  },
  {
    id: 'clinic-6',
    code: generateMockCode(6),
    name: 'Clínica Vitalis',
    cnpj: '67.890.123-0001-45',
    cep: '05422-000',
    street: 'Avenida Rebouças',
    number: '1500',
    city: 'São Paulo',
    region: CURRENT_REGIONAL_ADMIN.region,
    phone: '(11) 3333-4444',
    email: 'contato@vitalis.com.br',
    status: 'operando',
    administrators: [
      { id: 'clinic-6-admin-1', name: 'Renata Souza', cpf: '890.123.456-78', email: 'renata.souza@vitalis.com.br', phone: '(11) 98333-4444', temporaryPassword: 'Vit@2026', login: '89012345678' },
    ],
    history: [{ id: 'clinic-6-hist-1', action: 'Clínica cadastrada', performedBy: CURRENT_REGIONAL_ADMIN.name }],
  },
  {
    id: 'clinic-7',
    code: generateMockCode(7),
    name: 'Clínica Renovar Saúde',
    cnpj: '78.901.234-0001-56',
    cep: '03102-000',
    street: 'Rua da Mooca',
    number: '640',
    city: 'São Paulo',
    region: CURRENT_REGIONAL_ADMIN.region,
    phone: '(11) 3444-5555',
    email: 'contato@renovarsaude.com.br',
    status: 'operando',
    administrators: [
      { id: 'clinic-7-admin-1', name: 'Bruno Castro', cpf: '901.234.567-89', email: 'bruno.castro@renovarsaude.com.br', phone: '(11) 98444-5555', temporaryPassword: 'Ren@2026', login: '90123456789' },
      { id: 'clinic-7-admin-2', name: 'Patrícia Lima', cpf: '012.345.678-90', email: 'patricia.lima@renovarsaude.com.br', phone: '(11) 98555-6666', temporaryPassword: 'Ren@2026', login: '01234567890' },
    ],
    history: [{ id: 'clinic-7-hist-1', action: 'Clínica cadastrada', performedBy: CURRENT_REGIONAL_ADMIN.name }],
  },
  {
    id: 'clinic-8',
    code: generateMockCode(8),
    name: 'Instituto Prevenir',
    cnpj: '89.012.345-0001-67',
    cep: '01310-000',
    street: 'Avenida Paulista',
    number: '900',
    city: 'São Paulo',
    region: CURRENT_REGIONAL_ADMIN.region,
    phone: '(11) 3555-6666',
    email: 'contato@institutoprevenir.com.br',
    status: 'operando',
    administrators: [
      { id: 'clinic-8-admin-1', name: 'Felipe Araújo', cpf: '123.456.789-01', email: 'felipe.araujo@institutoprevenir.com.br', phone: '(11) 98666-7777', temporaryPassword: 'Prev@2026', login: '12345678901' },
    ],
    history: [{ id: 'clinic-8-hist-1', action: 'Clínica cadastrada', performedBy: CURRENT_REGIONAL_ADMIN.name }],
  },
  {
    id: 'clinic-9',
    code: generateMockCode(9),
    name: 'Clínica Nova Era',
    cnpj: '90.123.456-0001-78',
    cep: '04005-000',
    street: 'Rua Vergueiro',
    number: '1200',
    city: 'São Paulo',
    region: CURRENT_REGIONAL_ADMIN.region,
    phone: '(11) 3666-7777',
    email: 'contato@novaera.com.br',
    status: 'interditada',
    administrators: [
      { id: 'clinic-9-admin-1', name: 'Camila Duarte', cpf: '234.567.891-02', email: 'camila.duarte@novaera.com.br', phone: '(11) 98777-8888', temporaryPassword: 'Nova@2026', login: '23456789102' },
    ],
    history: [{ id: 'clinic-9-hist-1', action: 'Clínica cadastrada', performedBy: CURRENT_REGIONAL_ADMIN.name }],
  },
  {
    id: 'clinic-10',
    code: generateMockCode(10),
    name: 'Clínica Viva Bem',
    cnpj: '01.234.567-0001-89',
    cep: '02071-000',
    street: 'Avenida Cruzeiro do Sul',
    number: '2100',
    city: 'São Paulo',
    region: CURRENT_REGIONAL_ADMIN.region,
    phone: '(11) 3777-8888',
    email: 'contato@vivabem.com.br',
    status: 'operando',
    administrators: [
      { id: 'clinic-10-admin-1', name: 'Diego Farias', cpf: '345.678.912-03', email: 'diego.farias@vivabem.com.br', phone: '(11) 98888-9999', temporaryPassword: 'Viva@2026', login: '34567891203' },
    ],
    history: [{ id: 'clinic-10-hist-1', action: 'Clínica cadastrada', performedBy: CURRENT_REGIONAL_ADMIN.name }],
  },
  {
    id: 'clinic-11',
    code: generateMockCode(11),
    name: 'Clínica Cuidar Mais',
    cnpj: '12.345.670-0001-90',
    cep: '03310-000',
    street: 'Rua Bresser',
    number: '340',
    city: 'São Paulo',
    region: CURRENT_REGIONAL_ADMIN.region,
    phone: '(11) 3888-9999',
    email: 'contato@cuidarmais.com.br',
    status: 'operando',
    administrators: [
      { id: 'clinic-11-admin-1', name: 'Larissa Moura', cpf: '456.789.123-04', email: 'larissa.moura@cuidarmais.com.br', phone: '(11) 98999-0000', temporaryPassword: 'Cuid@2026', login: '45678912304' },
    ],
    history: [{ id: 'clinic-11-hist-1', action: 'Clínica cadastrada', performedBy: CURRENT_REGIONAL_ADMIN.name }],
  },
  {
    id: 'clinic-12',
    code: generateMockCode(12),
    name: 'Clínica Vitta',
    cnpj: '23.456.701-0001-01',
    cep: '04547-000',
    street: 'Avenida Chucri Zaidan',
    number: '560',
    city: 'São Paulo',
    region: CURRENT_REGIONAL_ADMIN.region,
    phone: '(11) 3999-0000',
    email: 'contato@vitta.com.br',
    status: 'fechada',
    administrators: [
      { id: 'clinic-12-admin-1', name: 'Rodrigo Teixeira', cpf: '567.891.234-05', email: 'rodrigo.teixeira@vitta.com.br', phone: '(11) 99000-1111', temporaryPassword: 'Vitta@2026', login: '56789123405' },
    ],
    history: [{ id: 'clinic-12-hist-1', action: 'Clínica cadastrada', performedBy: CURRENT_REGIONAL_ADMIN.name }],
  },
  {
    id: 'clinic-13',
    code: generateMockCode(13),
    name: 'Clínica Saúde Total',
    cnpj: '34.567.012-0001-12',
    cep: '05651-000',
    street: 'Avenida Giovanni Gronchi',
    number: '3000',
    city: 'São Paulo',
    region: CURRENT_REGIONAL_ADMIN.region,
    phone: '(11) 3000-1111',
    email: 'contato@saudetotal.com.br',
    status: 'operando',
    administrators: [
      { id: 'clinic-13-admin-1', name: 'Vanessa Cardoso', cpf: '678.912.345-06', email: 'vanessa.cardoso@saudetotal.com.br', phone: '(11) 99111-2222', temporaryPassword: 'Total@2026', login: '67891234506' },
    ],
    history: [{ id: 'clinic-13-hist-1', action: 'Clínica cadastrada', performedBy: CURRENT_REGIONAL_ADMIN.name }],
  },
  {
    id: 'clinic-14',
    code: generateMockCode(14),
    name: 'Clínica Amparo Saúde',
    cnpj: '45.670.123-0001-23',
    cep: '02710-000',
    street: 'Avenida Ordem e Progresso',
    number: '150',
    city: 'São Paulo',
    region: CURRENT_REGIONAL_ADMIN.region,
    phone: '(11) 3111-3333',
    email: 'contato@amparosaude.com.br',
    status: 'operando',
    administrators: [
      { id: 'clinic-14-admin-1', name: 'Eduardo Nunes', cpf: '789.123.456-07', email: 'eduardo.nunes@amparosaude.com.br', phone: '(11) 99222-3333', temporaryPassword: 'Amp@2026', login: '78912345607' },
    ],
    history: [{ id: 'clinic-14-hist-1', action: 'Clínica cadastrada', performedBy: CURRENT_REGIONAL_ADMIN.name }],
  },
  {
    id: 'clinic-15',
    code: generateMockCode(15),
    name: 'Clínica Origem Saúde',
    cnpj: '56.701.234-0001-34',
    cep: '05088-000',
    street: 'Avenida Pompeia',
    number: '780',
    city: 'São Paulo',
    region: CURRENT_REGIONAL_ADMIN.region,
    phone: '(11) 3222-4444',
    email: 'contato@origemsaude.com.br',
    status: 'operando',
    administrators: [
      { id: 'clinic-15-admin-1', name: 'Aline Ferraz', cpf: '891.234.567-08', email: 'aline.ferraz@origemsaude.com.br', phone: '(11) 99333-4444', temporaryPassword: 'Orig@2026', login: '89123456708' },
    ],
    history: [{ id: 'clinic-15-hist-1', action: 'Clínica cadastrada', performedBy: CURRENT_REGIONAL_ADMIN.name }],
  },
  {
    id: 'clinic-16',
    code: generateMockCode(16),
    name: 'Clínica Horizonte Vida',
    cnpj: '67.012.345-0001-45',
    cep: '03684-000',
    street: 'Avenida Águia de Haia',
    number: '2200',
    city: 'São Paulo',
    region: CURRENT_REGIONAL_ADMIN.region,
    phone: '(11) 3333-5555',
    email: 'contato@horizontevida.com.br',
    status: 'operando',
    administrators: [
      { id: 'clinic-16-admin-1', name: 'Marcelo Vieira', cpf: '912.345.678-09', email: 'marcelo.vieira@horizontevida.com.br', phone: '(11) 99444-5555', temporaryPassword: 'Hori@2026', login: '91234567809' },
    ],
    history: [{ id: 'clinic-16-hist-1', action: 'Clínica cadastrada', performedBy: CURRENT_REGIONAL_ADMIN.name }],
  },
  {
    id: 'clinic-17',
    code: generateMockCode(17),
    name: 'Clínica Essência Saúde',
    cnpj: '78.123.456-0001-56',
    cep: '04563-000',
    street: 'Avenida Santo Amaro',
    number: '1450',
    city: 'São Paulo',
    region: CURRENT_REGIONAL_ADMIN.region,
    phone: '(11) 3444-6666',
    email: 'contato@essenciasaude.com.br',
    status: 'operando',
    administrators: [
      { id: 'clinic-17-admin-1', name: 'Fernanda Rocha', cpf: '023.456.789-10', email: 'fernanda.rocha@essenciasaude.com.br', phone: '(11) 99555-6666', temporaryPassword: 'Ess@2026', login: '02345678910' },
    ],
    history: [{ id: 'clinic-17-hist-1', action: 'Clínica cadastrada', performedBy: CURRENT_REGIONAL_ADMIN.name }],
  },
];

let codeSequence = mockClinics.length;

export function listClinics(): Promise<Clinic[]> {
  return delay([...mockClinics]);
}

export function searchClinics(
  query: string,
  criterion: ClinicSearchCriterion = 'clinic',
): Promise<Clinic[]> {
  const term = query.trim().toLowerCase();

  if (!term) {
    return delay([...mockClinics]);
  }

  // Termo normalizado (apenas dígitos) para permitir buscar o
  // administrador também pelo CPF, formatado ou não.
  const digitsTerm = onlyDigits(query);

  const filtered = mockClinics.filter((clinic) => {
    if (criterion === 'administrator') {
      return clinic.administrators.some((admin) => {
        const nameMatches = admin.name.toLowerCase().includes(term);
        const cpfMatches =
          digitsTerm.length > 0 && onlyDigits(admin.cpf).includes(digitsTerm);
        return nameMatches || cpfMatches;
      });
    }
    return clinic.name.toLowerCase().includes(term);
  });

  return delay(filtered);
}

export function getClinicById(id: string): Promise<Clinic | null> {
  return delay(mockClinics.find((clinic) => clinic.id === id) ?? null);
}

export function getClinicStats(): Promise<{
  total: number;
  operando: number;
  interditada: number;
  fechada: number;
  operacoesEncerradas: number;
  totalClinics: number;
  totalAdministrators: number;
  closedClinics: number;
}> {
  function countByStatus(status: ClinicStatus): number {
    return mockClinics.filter((clinic) => clinic.status === status).length;
  }

  const totalClinics = mockClinics.length;
  const totalAdministrators = mockClinics.reduce(
    (sum, clinic) => sum + clinic.administrators.length,
    0,
  );
  const closedClinics = countByStatus('fechada');

  return delay({
    total: totalClinics,
    operando: countByStatus('operando'),
    interditada: countByStatus('interditada'),
    fechada: countByStatus('fechada'),
    operacoesEncerradas: countByStatus('operacoes_encerradas'),
    totalClinics,
    totalAdministrators,
    closedClinics,
  });
}

/**
 * Cadastra uma nova clínica.
 * TODO(backend): substituir corpo por POST /clinicas.
 */
export function createClinic(data: ClinicFormData): Promise<Clinic> {
  const id = `clinic-${Date.now()}`;
  codeSequence += 1;

  const newClinic: Clinic = {
    id,
    code: generateMockCode(codeSequence),
    name: data.name,
    cnpj: data.cnpj,
    cep: data.cep,
    street: data.street,
    number: data.number,
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
        action: 'Clínica cadastrada',
        performedBy: CURRENT_REGIONAL_ADMIN.name,
      },
    ],
  };

  mockClinics = [newClinic, ...mockClinics];

  return delay(newClinic, 700);
}

/**
 * Altera uma clínica existente.
 * TODO(backend): substituir corpo por PUT /clinicas/{id}.
 */
export function updateClinic(
  id: string,
  data: ClinicFormData,
): Promise<Clinic | null> {
  const index = mockClinics.findIndex((clinic) => clinic.id === id);

  if (index === -1) {
    return delay(null);
  }

  const existing = mockClinics[index];

  const updated: Clinic = {
    ...existing,
    name: data.name,
    cnpj: data.cnpj,
    cep: data.cep,
    street: data.street,
    number: data.number,
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
        action: 'Clínica alterada',
        performedBy: CURRENT_REGIONAL_ADMIN.name,
      },
    ],
  };

  mockClinics = [
    ...mockClinics.slice(0, index),
    updated,
    ...mockClinics.slice(index + 1),
  ];

  return delay(updated, 700);
}

/**
 * Remove uma clínica.
 * TODO(backend): substituir corpo por DELETE /clinicas/{id}.
 */
export function deleteClinic(id: string): Promise<boolean> {
  const existedBefore = mockClinics.some((clinic) => clinic.id === id);
  mockClinics = mockClinics.filter((clinic) => clinic.id !== id);
  return delay(existedBefore, 400);
}
