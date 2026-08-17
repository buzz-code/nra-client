import { useState } from 'react';
import { useGetIdentity, useDataProvider, useAuthProvider, useNotify } from 'react-admin';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';

const DAY_MS = 24 * 60 * 60 * 1000;
const URGENT_DAYS_LEFT = 7;

// yemotUrlMigrated is server-driven (flips based on which URL the last call
// actually used), so the confirm button is just an optimistic shortcut - it
// self-corrects on the next call if the ext.ini wasn't really updated.
export const YemotMigrationBanner = () => {
    const { data: identity } = useGetIdentity();
    const dataProvider = useDataProvider();
    const authProvider = useAuthProvider();
    const notify = useNotify();
    const [saving, setSaving] = useState(false);

    const usesYemot = Boolean(identity?.phoneNumber);
    if (!usesYemot || identity.additionalData?.yemotUrlMigrated) {
        return null;
    }

    const handleConfirm = async () => {
        setSaving(true);
        try {
            await dataProvider.updateSettings({ data: { yemotUrlMigrated: true } });
            await authProvider.getIdentity(true);
        } catch (e) {
            notify('העדכון נכשל, נסו שוב', { type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const deadline = identity.yemotLegacyRouteDeadline ? new Date(identity.yemotLegacyRouteDeadline) : null;
    const daysLeft = deadline ? Math.ceil((deadline.getTime() - Date.now()) / DAY_MS) : null;
    const severity = daysLeft !== null && daysLeft <= URGENT_DAYS_LEFT ? 'error' : 'warning';

    let deadlineText = null;
    if (daysLeft !== null) {
        deadlineText = daysLeft > 0
            ? ` הקישור הישן יפסיק לעבוד בעוד ${daysLeft} ${daysLeft === 1 ? 'יום' : 'ימים'} (${deadline.toLocaleDateString('he-IL')}).`
            : ' הקישור הישן כבר הפסיק לעבוד!';
    }

    return (
        <Box paddingY={2}>
            <Alert
                severity={severity}
                variant="outlined"
                action={
                    <Button color={severity} size="small" disabled={saving} onClick={handleConfirm}>
                        עדכנתי
                    </Button>
                }
            >
                יש לעדכן את קובץ ה-<code>ext.ini</code> במערכת ימות המשיח לקישור המאובטח האישי שלכם.{deadlineText}{' '}
                <Link href="/tutorial" target="_blank">הוראות מלאות כאן</Link>.
            </Alert>
        </Box>
    );
};
