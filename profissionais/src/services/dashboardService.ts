import { MOCK_APPLICATIONS } from '../data/mockApplications';
import { LAST_APPLICATIONS, type LastApplication } from '../data/mockDashboard';
import { MOCK_HISTORY } from '../data/mockHistory';
import { getApplications } from './applicationService';
import { getLots } from './lotService';
import { getVaccineStock, STOCK_CRITICAL_THRESHOLD } from '../utils/stockRules';

const CADERNETA_EVENTS_KEY = 'vacmais-profissionais-caderneta-events';

interface CadernetaEvent {
  id: string;
  date: string;
}

export interface DashboardData {
  vacinasHoje: number;
  cadernetasSemana: number;
  vacinasMes: number;
  lastApplications: LastApplication[];
  criticalStock: { vaccine: string; currentStock: number }[];
}

/**
 * Centraliza os dados usados pela Home.
 * Hoje mistura os mocks iniciais com os registros feitos neste navegador.
 * Quando o backend estiver pronto, este é um dos pontos que será substituído pelas consultas da API.
 */
export function getDashboardData(today = new Date()): DashboardData {
  const applications = [...MOCK_APPLICATIONS, ...getApplications()];
  const todayKey = formatDateKey(today);
  const monthKey = todayKey.slice(0, 7);

  const vacinasHoje = applications.filter(
    (application) => application.applicationDate === todayKey,
  ).length;

  const vacinasMes = applications.filter(
    (application) => application.applicationDate.startsWith(monthKey),
  ).length;

  const cadernetasSemana = getCadernetasRegistradasNaSemana(today);

  const dynamicApplications = applications.map((application) => ({
    id: application.id,
    dateTime: formatApplicationDate(application.applicationDate),
    patientName: application.patientName,
    vaccine: application.vaccineName,
    dose: application.doseLabel,
    professional: application.professionalName,
  }));

  const lastApplications = [...dynamicApplications, ...LAST_APPLICATIONS]
    .filter((item, index, list) => list.findIndex((other) => other.id === item.id) === index)
    .slice(0, 5);

  const lots = getLots();
  const stockByVaccine = new Map<string, { vaccine: string; currentStock: number }>();

  lots.forEach((lot) => {
    const currentStock = getVaccineStock(lots, lot.vaccineId);
    stockByVaccine.set(lot.vaccineId, {
      vaccine: lot.vaccineName,
      currentStock,
    });
  });

  const criticalStock = Array.from(stockByVaccine.values()).filter(
    (item) => item.currentStock < STOCK_CRITICAL_THRESHOLD,
  );

  return {
    vacinasHoje,
    cadernetasSemana,
    vacinasMes,
    lastApplications,
    criticalStock,
  };
}

export function registerCadernetaRegistration(date = new Date()): void {
  const events = readCadernetaEvents();
  events.push({ id: `caderneta-${Date.now()}`, date: formatDateKey(date) });
  localStorage.setItem(CADERNETA_EVENTS_KEY, JSON.stringify(events));
}

function getCadernetasRegistradasNaSemana(today: Date): number {
  const start = new Date(today);
  const day = start.getDay();
  const distanceFromMonday = day === 0 ? 6 : day - 1;
  start.setDate(start.getDate() - distanceFromMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(today);
  end.setHours(23, 59, 59, 999);

  const localEvents = readCadernetaEvents().filter((event) => {
    const eventDate = new Date(`${event.date}T00:00:00`);
    return eventDate >= start && eventDate <= end;
  }).length;

  const mockEvents = MOCK_HISTORY.filter(
    (entry) => entry.action === 'cadastrou-caderneta' && entry.timestamp.startsWith('Hoje'),
  ).length;

  return localEvents + mockEvents;
}

function readCadernetaEvents(): CadernetaEvent[] {
  const saved = localStorage.getItem(CADERNETA_EVENTS_KEY);
  if (!saved) return [];

  try {
    return JSON.parse(saved) as CadernetaEvent[];
  } catch {
    return [];
  }
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatApplicationDate(date: string): string {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}
