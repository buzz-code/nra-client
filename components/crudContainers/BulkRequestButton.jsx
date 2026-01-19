import { useCallback } from 'react';
import { Button, Form, useTranslate, SaveButton, useStore, useResourceContext, useRefresh } from 'react-admin';
import DownloadingIcon from '@mui/icons-material/Downloading';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import { ActionOrDialogButton } from './ActionOrDialogButton';

const BulkRequestForm = ({ children, handleSubmit, onClose, defaultValues, isLoading, translate }) => (
    <Form onSubmit={(values) => handleSubmit(values, onClose)} defaultValues={defaultValues}>
        <DialogContent>
            <Stack>
                {children}
            </Stack>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} label={translate('ra.action.cancel')} disabled={isLoading} />
            <SaveButton alwaysEnable autoFocus variant='text' icon={null} label={translate('ra.action.confirm')} disabled={isLoading} />
        </DialogActions>
    </Form>
);

export const BulkRequestButton = ({
    label, name, mutate, isLoading, icon,
    defaultRequestValues = {}, requestValues = {},
    reloadOnEnd = false, dialogTitle, children,
    ...props
}) => {
    const translate = useTranslate();
    const resource = useResourceContext();
    const refresh = useRefresh();
    const [cachedRequestValues, setRequestValues] = useStore('common.BulkRequestButton.' + resource + '.' + name, defaultRequestValues);
    const defaultDialogTitle = translate('ra.bulk_request.params_dialog_title');

    const doMutation = useCallback((rawData) => {
        const requestData = {
            ...rawData,
            ...requestValues,
        };
        const dataToSend = Object.fromEntries(Object.entries(requestData).map(([key, value]) => (['extra.' + key, value])));

        mutate(dataToSend, {
            onSettled: () => {
                if (reloadOnEnd) {
                    refresh();
                }
            }
        });
    }, [mutate, reloadOnEnd, refresh, requestValues]);

    const handleSubmit = useCallback((formValues, onClose) => {
        setRequestValues(formValues);
        onClose();
        doMutation(formValues);
    }, [setRequestValues, doMutation]);

    return (
        <ActionOrDialogButton
            label={label}
            disabled={isLoading}
            icon={isLoading ? loader : icon}
            title={dialogTitle ?? defaultDialogTitle}
            onClick={() => doMutation({})}
            dialogContent={children && (({ onClose }) => (
                <BulkRequestForm
                    handleSubmit={handleSubmit}
                    onClose={onClose}
                    defaultValues={cachedRequestValues}
                    isLoading={isLoading}
                    translate={translate}
                >
                    {children}
                </BulkRequestForm>
            ))}
            {...props}
        />
    );
}

const loader = <DownloadingIcon />;
