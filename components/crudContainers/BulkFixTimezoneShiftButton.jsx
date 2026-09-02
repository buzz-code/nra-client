import { useIsAdmin } from '@shared/utils/permissionsUtil';
import { BulkActionButton } from './BulkActionButton';

// Admin-only: corrects createdAt/updatedAt on the selected rows for records
// written before the mysql connection was pinned to UTC (nra-server#44).
export const BulkFixTimezoneShiftButton = ({ label = 'תיקון שעון (UTC)' }) => {
    const isAdmin = useIsAdmin();
    if (!isAdmin) return null;

    return <BulkActionButton name="fixTimezoneShift" label={label} reloadOnEnd />;
};
