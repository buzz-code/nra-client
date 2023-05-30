import { useCallback, useState } from 'react';
import { Button, Form, useTranslate, SaveButton } from 'react-admin';
import DownloadingIcon from '@mui/icons-material/Downloading';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';

export const BulkRequestButton = ({ label, mutate, isLoading, icon, children }) => {
    const [showDialog, setShowDialog] = useState(false);
    const translate = useTranslate();

    const handleButtonClick = useCallback(() => {
        if (!children) {
            mutate({});
        } else {
            setShowDialog(true);
        }
    }, [children, mutate, setShowDialog]);
    const handleDialogClose = useCallback(() => {
        setShowDialog(false);
    }, [setShowDialog]);
    const handleSubmit = useCallback((formValues) => {
        handleDialogClose();
        const dataToSend = Object.fromEntries(Object.entries(formValues).map(([key, value]) => (['extra.' + key, value])));
        mutate(dataToSend);
    }, [handleDialogClose, mutate]);

    return <>
        <Button label={label} onClick={handleButtonClick} disabled={isLoading}>
            {isLoading ? loader : icon}
        </Button>

        <Dialog onClose={handleDialogClose} open={showDialog}>
            <DialogTitle>
                {translate('ra.bulk_request.params_dialog_title')}
            </DialogTitle>
            <Form onSubmit={handleSubmit}>
                <DialogContent>
                    <Stack>
                        {children}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} label={translate('ra.action.cancel')} />
                    <SaveButton alwaysEnable autoFocus variant='text' icon={null} label={translate('ra.action.confirm')} />
                </DialogActions>
            </Form>
        </Dialog>
    </>
}

const loader = <DownloadingIcon />;
