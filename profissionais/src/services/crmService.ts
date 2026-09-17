import type { Professional } from '../types/professional';
import { MOCK_PROFESSIONALS } from '../data/mockProfessionals';

/**
 * Boundary for the future CRM lookup API.
 *
 * The current implementation uses the project's fictional professionals.
 * Replace the body with the external CRM request when that integration is approved.
 */
export async function findProfessionalByCrm(crm: string): Promise<Professional | null> {
  const normalized = crm.replace(/\D/g, '');

  return MOCK_PROFESSIONALS.find((professional) => professional.crm === normalized) ?? null;
}
