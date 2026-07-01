import { Button, Form, SaveButton, useCreate, useNotify, useRecordContext, useRefresh, useTranslate, useUpdate } from 'react-admin';
import { useState, useCallback } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import CircularProgress from '@mui/material/CircularProgress';
import { handleError } from '@shared/utils/notifyUtil';

/**
 * A reusable dialog-based inline edit button for React-Admin Datagrids.
 *
 * Renders an edit button as a Datagrid column. Clicking it opens a dialog
 * with the given input components as children. On save, it calls `useUpdate`
 * (if the record already has an override id) or `useCreate` (to create a new override).
 *
 * @param {string} resource - The API resource name to update/create.
 * @param {ReactNode} children - Input components to render in the dialog (e.g. <TextInput source="value" />).
 * @param {function} [getUpdateData] - (record, formData) => data for update. Defaults to formData.
 * @param {function} [getCreateData] - (record, formData) => data for create. Defaults to formData.
 * @param {function} [getUpdateId] - (record) => id to update, or null/undefined to create.
 * @param {string} [label='עריכה'] - Button label.
 * @param {ReactNode} [icon] - Button icon. Defaults to <EditIcon />.
 * @param {ReactNode} [loader] - Loading indicator. Defaults to <CircularProgress size={16} />.
 */
export const InlineEditButton = ({
    resource,
    children,
    getUpdateData = (_record, data) => data,
    getCreateData = (_record, data) => data,
    getUpdateId = (record) => record.overrideTextId,
    label = 'עריכה',
    icon,
    loader,
}) => {
    const record = useRecordContext();
    const notify = useNotify();
    const refresh = useRefresh();
    const translate = useTranslate();
    const [showDialog, setShowDialog] = useState(false);

    const handleSuccess = useCallback(() => {
        notify('ra.notification.updated', {
            type: 'info',
            messageArgs: { smart_count: 1 },
        });
        refresh();
    }, [notify, refresh]);

    const [create, createResponse] = useCreate(undefined, undefined, {
        onSuccess: handleSuccess,
        onError: handleError(notify),
    });
    const [update, updateResponse] = useUpdate(undefined, undefined, {
        onSuccess: handleSuccess,
        onError: handleError(notify),
    });

    const handleSave = useCallback((data) => {
        const updateId = getUpdateId(record);
        if (updateId) {
            update(resource, {
                id: updateId,
                data: getUpdateData(record, data),
                previousData: record,
            });
        } else {
            create(resource, {
                data: getCreateData(record, data),
            });
        }
    }, [record, resource, update, create, getUpdateId, getUpdateData, getCreateData]);

    const handleButtonClick = useCallback((e) => {
        e.stopPropagation();
        setShowDialog(true);
    }, []);

    const handleDialogClose = useCallback(() => {
        setShowDialog(false);
    }, []);

    const handleSubmit = useCallback((data) => {
        handleDialogClose();
        handleSave(data);
    }, [handleDialogClose, handleSave]);

    const isLoading = createResponse.isLoading || updateResponse.isLoading;

    return <>
        <Button label={label} onClick={handleButtonClick} disabled={isLoading}>
            {isLoading ? (loader || <CircularProgress size={16} />) : (icon || <EditIcon />)}
        </Button>

        <Dialog onClose={handleDialogClose} open={showDialog}>
            <Form onSubmit={handleSubmit}>
                <DialogContent>
                    <Stack>
                        {children}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} label={translate('ra.action.cancel')} />
                    <SaveButton alwaysEnable autoFocus variant='text' icon={null} />
                </DialogActions>
            </Form>
        </Dialog>
    </>
}

export default InlineEditButton;