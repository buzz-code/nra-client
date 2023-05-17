import { useCallback, useState } from 'react';
import { Button, useTranslate } from 'react-admin';
import DownloadingIcon from '@mui/icons-material/Downloading';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

export const BulkRequestButton = ({ label, mutate, isLoading, icon, children }) => {
    const [showDialog, setShowDialog] = useState(false);
    const translate = useTranslate();

    const handleButtonClick = useCallback(() => {
        if (!children) {
            mutate();
        } else {
            setShowDialog(true);
        }
    });
    const handleDialogClose = useCallback(() => {
        setShowDialog(false);
    });
    const handleDialogCloseWithConfirm = useCallback(() => {
        handleDialogClose();
        mutate();
    })

    return <>
        <Button label={label} onClick={handleButtonClick} disabled={isLoading}>
            {isLoading ? loader : icon}
        </Button>

        <Dialog onClose={handleDialogClose} open={showDialog}>
            <DialogTitle>
                {translate('ra.bulk_request.params_dialog_title')}
            </DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogClose}>
                    {translate('ra.action.cancel')}
                </Button>
                <Button onClick={handleDialogCloseWithConfirm} autoFocus>
                    {translate('ra.action.confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    </>
}

const loader = <DownloadingIcon />;
