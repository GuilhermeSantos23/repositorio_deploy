import type { Professional } from '../types/professional';
import { MOCK_PROFESSIONALS } from '../data/mockProfessionals';

/**
 * Boundary for the future CRM lookup API.
 *
 * The current implementation uses the project's fictional professionals.
 * Replace the body with the external CRM request when that integration is approved.
 */
export async function findProfessionalByCofen(cofen: string): Promise<Professional | null> {
  const normalized = cofen.replace(/\D/g, '');

  return MOCK_PROFESSIONALS.find((professional) => professional.cofen === normalized) ?? null;
}
