import { TextField, TextInput, useNotify, useRecordContext, useRefresh, useUpdate } from 'react-admin';
import { useState, useCallback, useRef } from 'react';
import { handleError } from '@shared/utils/notifyUtil';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

/**
 * A true inline-editable cell for React-Admin Datagrids.
 *
 * Renders a read-only TextField by default. On click, it switches to an
 * editable TextInput. On Enter or blur, it saves via `useUpdate`. On
 * Escape, it reverts to the original value.
 *
 * @param {string} source - The field source key.
 * @param {string} [label] - Optional label (passed to TextField).
 * @param {function} [validate] - Optional validation function: (value) => string | undefined.
 * @param {function} [transform] - Optional transform: (value, record) => data object for update.
 *        Defaults to { [source]: value }.
 * @param {boolean} [sortable] - Whether the column is sortable. Defaults to true.
 */
export const InlineEditCell = ({
    source,
    label,
    validate,
    transform,
    sortable = true,
}) => {
    const record = useRecordContext();
    const notify = useNotify();
    const refresh = useRefresh();
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(record?.[source] ?? '');
    const [error, setError] = useState(undefined);
    const inputRef = useRef(null);

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

    const originalValue = record?.[source] ?? '';

    const handleSave = useCallback(() => {
        if (validate) {
            const validationError = validate(value);
            if (validationError) {
                setError(validationError);
                return;
            }
        }
        setError(undefined);
        const data = transform ? transform(value, record) : { [source]: value };
        update(record.id, { data, previousData: record });
        setIsEditing(false);
    }, [value, record, source, transform, validate, update]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            setValue(originalValue);
            setError(undefined);
            setIsEditing(false);
        }
    }, [handleSave, originalValue]);

    const handleBlur = useCallback(() => {
        if (value !== originalValue) {
            handleSave();
        } else {
            setIsEditing(false);
        }
    }, [value, originalValue, handleSave]);

    const handleClick = useCallback((e) => {
        e.stopPropagation();
        setIsEditing(true);
    }, []);

    if (isEditing) {
        return (
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                <TextInput
                    source={source}
                    label={false}
                    defaultValue={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    error={!!error}
                    helperText={error}
                    autoFocus
                    sx={{ '& .MuiInputBase-input': { padding: '4px 8px' } }}
                />
                {isLoading && <CircularProgress size={16} />}
            </Box>
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