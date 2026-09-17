import type { Profissional } from '../types/profissional';

// Dados fictícios de profissionais, usados apenas para demonstrar a tela
// enquanto não existe uma API real.
// Ver `services/profissionalService.ts` para as funções que operam sobre
// esses dados (listar, pesquisar, cadastrar, editar, excluir/bloquear).
//
// Os 4 profissionais abaixo são os MESMOS registros de
// `profissionais/src/data/mockProfessionals.ts` (mesmos `id` e `name`,
// só que aqui separados em firstName/lastName). Isso é proposital: dá a
// sensação de que os apps Usuario → Profissional → Administrador →
// Regional trabalham sobre os mesmos dados, mesmo sem um backend real.
//
// Como os dois apps são projetos Vite/TS separados (cada um com seu
// próprio node_modules/tsconfig), não é possível fazer um `import`
// literal do arquivo de lá para cá sem criar um pacote/workspace
// compartilhado — o que fugiria do escopo (nenhuma arquitetura nova).
// Por isso os valores são reproduzidos aqui, com os campos extras que
// só a tela de Administradores usa (CPF é gerado à parte, COREN vem do
// `crm` original, cargo/status/admissão são fictícios coerentes).
//
// `crm` -> `coren`: os números originais (123456, 54321, 67890, 24680)
// já têm entre 4 e 7 dígitos, então foram mantidos como estão, só
// migrando o nome do campo.
export const professionalsMock: Profissional[] = [
  {
    id: 'prof-001',
    firstName: 'Ana Paula',
    lastName: 'Santos',
    coren: '123456',
    cep: '07243-000',
    estado: 'SP',
    cidade: 'Guarulhos',
    birthDate: '22/06/1991',
    phone: '(11) 98888-1001',
    email: 'ana.santos@vacmais.com.br',
    cargo: 'enfermeiro',
    status: 'ativo',
    admissionDate: '2024-02-10',
    responsavelId: 'adm-1',
    responsavelNome: 'Carla Ribeiro',
    origem: 'cadastro',
    unit: 'UBS Pimentas',
  },
  {
    // Título "Dra." do registro original não faz parte de firstName/lastName
    // aqui (a tela de Administradores não tem campo de título).
    id: 'prof-002',
    firstName: 'Helena',
    lastName: 'Ramos',
    coren: '54321',
    cep: '07230-110',
    estado: 'SP',
    cidade: 'Guarulhos',
    birthDate: '05/11/1987',
    phone: '(11) 98888-1002',
    email: 'helena.ramos@vacmais.com.br',
    cargo: 'tecnico',
    status: 'inativo',
    admissionDate: '2023-09-01',
    responsavelId: 'adm-1',
    responsavelNome: 'Carla Ribeiro',
    origem: 'cadastro',
    unit: 'UBS Pimentas',
  },
  {
    // Título "Dr." também removido pelo mesmo motivo do registro acima.
    id: 'prof-003',
    firstName: 'Carlos',
    lastName: 'Souza',
    coren: '67890',
    cep: '07252-260',
    estado: 'SP',
    cidade: 'Guarulhos',
    birthDate: '17/03/1985',
    phone: '(11) 98888-1003',
    email: 'carlos.souza@vacmais.com.br',
    cargo: 'auxiliar',
    status: 'bloqueado',
    admissionDate: '2022-03-03',
    responsavelId: 'adm-2',
    responsavelNome: 'João Pedro Alves',
    origem: 'cadastro',
    motivoExclusao: 'Desligamento a pedido do próprio profissional.',
    unit: 'UBS Pimentas',
  },
  {
    id: 'prof-004',
    firstName: 'Mariana',
    lastName: 'Costa',
    coren: '24680',
    cep: '07220-005',
    estado: 'SP',
    cidade: 'Guarulhos',
    birthDate: '30/01/1994',
    phone: '(11) 98888-1004',
    email: 'mariana.costa@vacmais.com.br',
    cargo: 'enfermeiro',
    status: 'ativo',
    admissionDate: '2024-08-14',
    responsavelId: 'adm-2',
    responsavelNome: 'João Pedro Alves',
    origem: 'cadastro',
    unit: 'UBS Pimentas',
  },
];