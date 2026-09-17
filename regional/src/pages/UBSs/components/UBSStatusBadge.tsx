import type { UBSStatus } from '../../../types/ubs';
import { UBS_STATUS_BADGE_CLASSES, UBS_STATUS_LABELS } from '../../../utils/ubsStatus';

interface UBSStatusBadgeProps {
  status: UBSStatus;
}

function UBSStatusBadge({ status }: UBSStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${UBS_STATUS_BADGE_CLASSES[status]}`}
    >
      {UBS_STATUS_LABELS[status]}
    </span>
  );
}

export default UBSStatusBadge;
