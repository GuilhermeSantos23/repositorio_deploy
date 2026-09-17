import type { Patient } from '../types/patient';
import { MOCK_PROFESSIONALS } from './mockProfessionals';
import { MOCK_LOTS } from './mockLots';

export type { Patient } from '../types/patient';

export const MOCK_PATIENTS: Patient[] = [
  {
    cpfDigits: '10482573642',
    cpfFormatted: '104.825.736-42',
    name: 'Maria Ferreira',
    birthDate: '15/03/1988',
    age: 38,
    hasCaderneta: true,
    sensitiveCondition: 'Diabetes Mellitus',
    susCard: '700 0000 1234 5678',
    motherName: 'Ana Ferreira',
    fatherName: 'José Ferreira',
  },
  {
    cpfDigits: '52930718416',
    cpfFormatted: '529.307.184-16',
    name: 'Joana Nunes',
    birthDate: '02/07/1995',
    age: 31,
    hasCaderneta: true,
    susCard: '700 0000 2345 6789',
    motherName: 'Lúcia Nunes',
    fatherName: 'Paulo Nunes',
  },
  {
    cpfDigits: '41829653071',
    cpfFormatted: '418.296.530-71',
    name: 'Paulo Reis',
    birthDate: '20/11/2018',
    age: 7,
    hasCaderneta: false,
    susCard: 'Não informado',
  },
  {
    cpfDigits: '63821749005',
    cpfFormatted: '638.217.490-05',
    name: 'Lucas Almeida',
    birthDate: '11/05/2012',
    age: 14,
    hasCaderneta: true,
    sensitiveCondition: 'Imunossupressão',
    susCard: '700 0000 3456 7890',
    motherName: 'Carla Almeida',
    fatherName: 'Roberto Almeida',
  },
  {
    cpfDigits: '29184756032',
    cpfFormatted: '291.847.560-32',
    name: 'Helena Martins',
    birthDate: '09/08/1961',
    age: 65,
    hasCaderneta: true,
    susCard: '700 0000 4567 8901',
    motherName: 'Marta Martins',
    fatherName: 'João Martins',
  },
];

export const UNIT_NAME = 'UBS Pimentas';

// Aliases mantidos temporariamente para não quebrar as telas atuais.
// Os novos componentes devem preferir MOCK_PROFESSIONALS, MOCK_LOTS e UNIT_NAME.
export const MOCK_UNIDADES = [UNIT_NAME];
export const MOCK_PROFISSIONAIS = MOCK_PROFESSIONALS.map((professional) => professional.name);
export const MOCK_LOTES = MOCK_LOTS.map((lot) => lot.code);
