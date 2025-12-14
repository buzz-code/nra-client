import { useCallback } from 'react';
import { Button, Form, useTranslate, SaveButton, useStore, useResourceContext, useRefresh } from 'react-admin';
import DownloadingIcon from '@mui/icons-material/Downloading';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import { ActionOrDialogButton } from './ActionOrDialogButton';

export const BulkRequestButton = ({ label, name, mutate, isLoading, icon, defaultRequestValues = {}, requestValues = {}, reloadOnEnd = false, dialogTitle, children }) => {
    const translate = useTranslate();
    const resource = useResourceContext();
    const refresh = useRefresh();
    const [cachedRequestValues, setRequestValues] = useStore('common.BulkRequestButton.' + resource + '.' + name, defaultRequestValues);
    const defaultDialogTitle = translate('ra.bulk_request.params_dialog_title');

    const doMutation = useCallback(async (dataToSend) => {
        await mutate(dataToSend);
        if (reloadOnEnd) {
            refresh();
        }
    }, [mutate, reloadOnEnd, refresh]);

    const handleSubmit = useCallback((formValues, onClose) => {
        setRequestValues(formValues);
        onClose();
        const requestData = {
            ...formValues,
            ...requestValues,
        };
        const dataToSend = Object.fromEntries(Object.entries(requestData).map(([key, value]) => (['extra.' + key, value])));
        doMutation(dataToSend);
    }, [requestValues, setRequestValues, doMutation]);

    return (
        <ActionOrDialogButton
            label={label}
            disabled={isLoading}
            icon={isLoading ? loader : icon}
            title={dialogTitle ?? defaultDialogTitle}
            onClick={() => doMutation({})}
            dialogContent={children && (({ onClose }) => (
                <Form onSubmit={(values) => handleSubmit(values, onClose)} defaultValues={cachedRequestValues}>
                    <DialogContent>
                        <Stack>
                            {children}
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose} label={translate('ra.action.cancel')} />
                        <SaveButton alwaysEnable autoFocus variant='text' icon={null} label={translate('ra.action.confirm')} />
                    </DialogActions>
                </Form>
            ))}
        />
    );
}

const loader = <DownloadingIcon />;
