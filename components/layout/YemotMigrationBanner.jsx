import { useState } from 'react';
import { useGetIdentity, useDataProvider, useAuthProvider, useNotify } from 'react-admin';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';

/**
 * Nags users still calling the legacy, unauthenticated Yemot webhook URL to
 * switch to their personal token-secured one (see Tutorial.jsx).
 *
 * `additionalData.yemotUrlMigrated` is the source of truth and is driven by
 * real call traffic (server flips it on every call, based on which URL the
 * call actually arrived on) - the button below just gives an optimistic,
 * immediate "I did it" while waiting for the next real call to confirm it.
 * If the ext.ini wasn't actually updated, the next call re-flips it to
 * false and the banner comes back.
 */
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

    return (
        <Box paddingY={2}>
            <Alert
                severity="warning"
                variant="outlined"
                action={
                    <Button color="warning" size="small" disabled={saving} onClick={handleConfirm}>
                        עדכנתי
                    </Button>
                }
            >
                יש לעדכן את קובץ ה-<code>ext.ini</code> במערכת ימות המשיח לקישור המאובטח האישי שלכם.{' '}
                <Link href="/tutorial" target="_blank">הוראות מלאות כאן</Link>.
            </Alert>
        </Box>
    );
};
