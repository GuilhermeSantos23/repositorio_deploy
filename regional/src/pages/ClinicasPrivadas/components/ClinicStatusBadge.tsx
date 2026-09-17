import type { ClinicStatus } from '../../../types/clinic';
import {
  CLINIC_STATUS_BADGE_CLASSES,
  CLINIC_STATUS_LABELS,
} from '../../../utils/clinicStatus';

interface ClinicStatusBadgeProps {
  status: ClinicStatus;
}

function ClinicStatusBadge({ status }: ClinicStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${CLINIC_STATUS_BADGE_CLASSES[status]}`}
    >
      {CLINIC_STATUS_LABELS[status]}
    </span>
  );
}

export default ClinicStatusBadge;
