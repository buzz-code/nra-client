import Typography from '@mui/material/Typography';
import { useListContext } from 'react-admin';
import { useIsAdmin } from '@shared/utils/permissionsUtil';
import { BulkActionButton } from './BulkActionButton';

// Admin-only: corrects createdAt/updatedAt on the selected rows for records
// written before the mysql connection was pinned to UTC (nra-server#44).
// Confirms first: running this on rows that were already written correctly
// (after that fix) would shift them the wrong way.
export const BulkFixTimezoneShiftButton = ({ label = 'תיקון שעון (UTC)' }) => {
    const isAdmin = useIsAdmin();
    const { selectedIds } = useListContext();
    if (!isAdmin) return null;

    return (
        <BulkActionButton name="fixTimezoneShift" label={label} reloadOnEnd>
            <Typography>
                הפעולה תתקן את השעה השמורה ב-{selectedIds?.length ?? 0} הרשומות שנבחרו, בהנחה שנכתבו
                לפני תיקון אזור הזמן. הפעלה על רשומות שכבר תקינות תזיז את השעה שלהן בטעות. להמשיך?
            </Typography>
        </BulkActionButton>
    );
};
