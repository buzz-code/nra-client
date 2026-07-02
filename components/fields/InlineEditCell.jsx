import { Form, TextField, TextInput, useNotify, useRecordContext, useRefresh, useResourceContext, useUpdate } from 'react-admin';
import { useFormContext } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { handleError } from '@shared/utils/notifyUtil';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const EditingInput = ({ source, validate, isLoading, onSave }) => {
    const { handleSubmit, formState } = useFormContext();
    const submit = handleSubmit(onSave);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            submit();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            onSave(null);
        }
    }, [submit, onSave]);

    const handleBlur = useCallback(() => {
        if (formState.isDirty) {
            submit();
        } else {
            onSave(null);
        }
    }, [formState.isDirty, submit, onSave]);

    return (
        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
            <TextInput
                source={source}
                label={false}
                validate={validate}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                autoFocus
                sx={{ '& .MuiInputBase-input': { padding: '4px 8px' } }}
            />
            {isLoading && <CircularProgress size={16} />}
        </Box>
    );
};

/**
 * A true inline-editable cell for React-Admin Datagrids: click a single
 * field to edit it in place, without opening a dialog or a full form.
 *
 * Renders a read-only TextField by default. On click, it switches to a real
 * react-admin <Form>/<TextInput> (so validation, Enter-to-submit and error
 * display all come from react-hook-form, the same as everywhere else).
 * Escape or an unchanged blur cancels without saving.
 *
 * Unlike InlineEditButton, this always updates the record's own id on its
 * own resource - it has no create/override path, since editing one field
 * of the current row is the only thing it's for.
 *
 * @param {string} source - The field source key.
 * @param {string} [resource] - The API resource name to update. Defaults to the ambient resource context.
 * @param {string} [label] - Optional label (passed to TextField).
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
    const [isEditing, setIsEditing] = useState(false);

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
        setIsEditing(true);
    }, []);

    // formData is null for cancel (Escape / unchanged blur), the submitted
    // values otherwise.
    const handleSave = useCallback((formData) => {
        setIsEditing(false);
        if (!formData) {
            return;
        }
        const data = transform ? transform(formData[source], record) : { [source]: formData[source] };
        update(resource ?? contextResource, { id: record.id, data, previousData: record });
    }, [record, source, transform, update, resource, contextResource]);

    if (isEditing) {
        return (
            <Form record={record} onSubmit={handleSave}>
                <EditingInput source={source} validate={validate} isLoading={isLoading} onSave={handleSave} />
            </Form>
        );
    }

    return (
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
    );
};

export default InlineEditCell;
