import { Button, Form, maxLength, ReferenceField, required, SaveButton, TextField, TextInput, useCreate, useNotify, useRecordContext, useRefresh, useTranslate, useUpdate } from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { useState, useCallback } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import CircularProgress from '@mui/material/CircularProgress';
import { handleError } from '@shared/utils/notifyUtil';
import { adminUserFilter } from '@shared/components/fields/PermissionFilter';

const filters = [
    adminUserFilter,
    <TextInput source="name:$cont" alwaysOn />,
    <TextInput source="description:$cont" label="תיאור" />,
    <TextInput source="value:$cont" label="ערך" alwaysOn />,
    <TextInput source="filepath:$cont" label="נתיב קובץ שמע" />,
];

const Datagrid = ({ isAdmin, children, ...props }) => {
    return (
        <CommonDatagrid {...props}>
            {children}
            {isAdmin && <TextField source="id" />}
            {isAdmin && <ReferenceField source="userId" reference="user" emptyText='system' />}
            <TextField source="name" />
            <TextField source="description" />
            <TextField source="value" />
            <TextField source="filepath" />
            <EditTextButton label='עריכה' icon={<EditIcon />} loader={<CircularProgress size={16} />} />
        </CommonDatagrid>
    );
}

const resource = 'text';
const EditTextButton = ({ label, icon, loader }) => {
    const record = useRecordContext();
    const notify = useNotify();
    const refresh = useRefresh();
    const translate = useTranslate();
    const [showDialog, setShowDialog] = useState(false);

    const handleSuccess = () => {
        notify('ra.notification.updated', {
            type: 'info',
            messageArgs: { smart_count: 1 },
        });
        refresh();
    };
    const [create, createResponse] = useCreate(undefined, undefined, {
        onSuccess: handleSuccess,
        onError: handleError(notify),
    });
    const [update, updateResponse] = useUpdate(undefined, undefined, {
        onSuccess: handleSuccess,
        onError: handleError(notify),
    });
    const handleSave = (data) => {
        if (record.overrideTextId) {
            update(resource, {
                id: record.overrideTextId,
                data: {
                    value: data.value,
                    filepath: data.filepath,
                },
                previousData: {}
            });
        } else {
            create(resource, {
                data: {
                    userId: record.userId,
                    name: record.name,
                    description: record.description,
                    value: data.value,
                    filepath: data.filepath,
                }
            });
        }
    }

    const handleButtonClick = useCallback(() => {
        setShowDialog(true);
    }, [setShowDialog]);
    const handleDialogClose = useCallback(() => {
        setShowDialog(false);
    }, [setShowDialog]);
    const handleSubmit = useCallback(({ value, filepath }) => {
        handleDialogClose();
        handleSave({ value, filepath });
    }, [handleDialogClose, handleSave]);

    const isLoading = createResponse.isLoading || updateResponse.isLoading;

    return <>
        <Button label={label} onClick={handleButtonClick} disabled={isLoading}>
            {isLoading ? loader : icon}
        </Button>

        <Dialog onClose={handleDialogClose} open={showDialog}>
            <Form onSubmit={handleSubmit}>
                <DialogContent>
                    <Stack>
                        <TextInput source='value' label='ערך' validate={[required(), maxLength(10000)]} />
                        <TextInput 
                            source='filepath' 
                            validate={[maxLength(255)]} 
                            helperText="אופציונלי - אם מלא, ישלח קובץ במקום טקסט"
                        />
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

const entity = {
    Datagrid,
    filters,
};

export default getResourceComponents(entity);
