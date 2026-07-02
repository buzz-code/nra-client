import { Button, Form, SaveButton, TextField, TextInput, useNotify, useRecordContext, useRefresh, useResourceContext, useTranslate, useUpdate } from 'react-admin';
import { useState, useCallback } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { handleError } from '@shared/utils/notifyUtil';

/**
 * A single-field inline edit cell for React-Admin Datagrids.
 *
 * Renders a read-only TextField. Clicking it opens a small dialog with one
 * TextInput for `source`, following the same Dialog + Form + SaveButton
 * pattern as InlineEditButton: Enter-to-submit and Escape-to-close come
 * from the Form/Dialog themselves, not from custom key handling.
 *
 * Unlike InlineEditButton, this always updates the record's own id on its
 * own resource - it has no create/override path, since editing one field
 * of the current row is the only thing it's for.
 *
 * @param {string} source - The field source key.
 * @param {string} [resource] - The API resource name to update. Defaults to the ambient resource context.
 * @param {string} [label] - Optional label (passed to TextField and the dialog's TextInput).
 * @param {function|function[]} [validate] - react-admin validator(s) for the input.
 * @param {function} [transform] - Optional transform: (value, record) => data object for update.
 *        Defaults to { [source]: value }.
 * @param {boolean} [sortable] - Whether the column is sortable. Defaults to true.
 */
export const InlineEditCell = ({
    source,
    resource,
    label,
    validate,
    transform,
    sortable = true,
}) => {
    const record = useRecordContext();
    const contextResource = useResourceContext();
    const notify = useNotify();
    const refresh = useRefresh();
    const translate = useTranslate();
    const [showDialog, setShowDialog] = useState(false);

    const [update, { isLoading }] = useUpdate(undefined, undefined, {
        onSuccess: () => {
            notify('ra.notification.updated', {
                type: 'info',
                messageArgs: { smart_count: 1 },
            });
            refresh();
        },
        onError: handleError(notify),
    });

    const handleClick = useCallback((e) => {
        e.stopPropagation();
        setShowDialog(true);
    }, []);

    const handleDialogClose = useCallback(() => {
        setShowDialog(false);
    }, []);

    const handleSubmit = useCallback((formData) => {
        handleDialogClose();
        const data = transform ? transform(formData[source], record) : { [source]: formData[source] };
        update(resource ?? contextResource, { id: record.id, data, previousData: record });
    }, [record, source, transform, update, resource, contextResource, handleDialogClose]);

    return <>
        <Box
            component="span"
            onClick={handleClick}
            sx={{
                cursor: 'pointer',
                display: 'inline-block',
                width: '100%',
                '&:hover': { backgroundColor: 'action.hover', borderRadius: 0.5 },
            }}
        >
            <TextField source={source} label={label} sortable={sortable} />
            {isLoading && <CircularProgress size={14} sx={{ verticalAlign: 'middle', ml: 0.5 }} />}
        </Box>

        <Dialog onClose={handleDialogClose} open={showDialog} fullWidth maxWidth="sm">
            <Form record={record} onSubmit={handleSubmit}>
                <DialogContent>
                    <TextInput source={source} label={label} validate={validate} autoFocus />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} label={translate('ra.action.cancel')} />
                    <SaveButton alwaysEnable autoFocus variant='text' icon={null} />
                </DialogActions>
            </Form>
        </Dialog>
    </>
};

export default InlineEditCell;
