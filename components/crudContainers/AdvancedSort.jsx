import { createContext, isValidElement, useCallback, useContext, useEffect, useMemo, useState, Children } from 'react';
import { Button, useListContext, useResourceContext, useTranslateLabel } from 'react-admin';
import { Badge, Box, Button as MuiButton, useMediaQuery, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Stack, TextField, Typography } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { parseSort, serializeSort } from '@shared/utils/sortUtil';

export const MAX_SORT_LEVELS = 4;

// CommonList provides this; CommonDatagrid registers its sortable columns into it,
// and AdvancedSortButton (in the list toolbar) reads them as the dialog's options.
const SortColumnsContext = createContext(null);
const NO_EXTRA_OPTIONS = [];

export const SortColumnsProvider = ({ extraOptions = NO_EXTRA_OPTIONS, defaultSort, children }) => {
    const [columns, setColumns] = useState([]);
    const value = useMemo(() => ({
        options: dedupeByField([...columns, ...extraOptions]),
        setColumns,
        defaultSort,
    }), [columns, extraOptions, defaultSort]);

    return <SortColumnsContext.Provider value={value}>{children}</SortColumnsContext.Provider>;
};

const dedupeByField = (options) => options.filter((option, index) =>
    options.findIndex(({ field }) => field === option.field) === index);

// A column can be sorted the same way its header sorts it: by `sortBy` when
// set (e.g. ReferenceField sortBy="klass.name"), else by `source`.
export const getSortableColumns = (children) => Children.toArray(children)
    .filter((child) => isValidElement(child) && child.props.source && child.props.sortable !== false)
    .map(({ props }) => ({
        field: props.sortBy ?? props.source,
        source: props.source,
        label: typeof props.label === 'string' ? props.label : undefined,
    }));

export const useRegisterSortColumns = (children) => {
    const context = useContext(SortColumnsContext);
    const columns = getSortableColumns(children);
    const key = JSON.stringify(columns);

    useEffect(() => {
        context?.setColumns(columns);
    }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
};

const ORDER_LABELS = { ASC: 'עולה (א→ת, 1→9)', DESC: 'יורד (ת→א, 9→1)' };

export const AdvancedSortButton = () => {
    const context = useContext(SortColumnsContext);
    const { sort, setSort } = useListContext();
    const resource = useResourceContext();
    const translateLabel = useTranslateLabel();
    const [open, setOpen] = useState(false);
    const [levels, setLevels] = useState([]);
    const isSmall = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    const currentLevels = parseSort(sort);
    const options = context?.options ?? [];

    const getLabel = useCallback((option) => translateLabel({
        label: option.label,
        source: option.source ?? option.field,
        resource,
    }), [translateLabel, resource]);

    // The current sort may be on a field that has no column (e.g. the default 'id').
    const allOptions = useMemo(() => dedupeByField([
        ...options,
        ...levels.map(({ field }) => ({ field })),
    ]), [options, levels]);

    if (!options.length) {
        return null;
    }

    const handleOpen = () => {
        setLevels(currentLevels);
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    const updateLevel = (index, patch) =>
        setLevels(levels.map((level, i) => (i === index ? { ...level, ...patch } : level)));
    const moveLevel = (index, offset) => {
        const next = [...levels];
        [next[index], next[index + offset]] = [next[index + offset], next[index]];
        setLevels(next);
    };
    const removeLevel = (index) => setLevels(levels.filter((_, i) => i !== index));
    const unusedOption = options.find(({ field }) => !levels.some((level) => level.field === field));
    const addLevel = () => setLevels([...levels, { field: unusedOption.field, order: 'ASC' }]);

    const handleApply = () => {
        setSort(levels.length ? serializeSort(levels) : (context.defaultSort ?? { field: 'id', order: 'ASC' }));
        setOpen(false);
    };

    return (
        <>
            {/* On phones react-admin's Button shows only the icon, so the level count is also a badge there. */}
            <Button
                label={currentLevels.length > 1 ? `מיון (${currentLevels.length})` : 'מיון'}
                onClick={handleOpen}
            >
                {isSmall && currentLevels.length > 1
                    ? <Badge badgeContent={currentLevels.length} color="primary"><SortIcon /></Badge>
                    : <SortIcon />}
            </Button>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>מיון מתקדם</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ pt: 1 }}>
                        {levels.map((level, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'grid',
                                    gap: 1,
                                    alignItems: 'center',
                                    gridTemplateColumns: { xs: '1fr', sm: '64px minmax(0, 1fr) 200px auto' },
                                }}
                            >
                                <Typography variant="body2">
                                    {index === 0 ? 'מיין לפי' : 'ואז לפי'}
                                </Typography>
                                <TextField
                                    select
                                    size="small"
                                    label="עמודה"
                                    value={level.field}
                                    onChange={(e) => updateLevel(index, { field: e.target.value })}
                                >
                                    {allOptions.map((option) => (
                                        <MenuItem
                                            key={option.field}
                                            value={option.field}
                                            disabled={option.field !== level.field && levels.some((l) => l.field === option.field)}
                                        >
                                            {getLabel(option)}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    select
                                    size="small"
                                    label="כיוון"
                                    value={level.order}
                                    onChange={(e) => updateLevel(index, { order: e.target.value })}
                                >
                                    {Object.entries(ORDER_LABELS).map(([value, label]) => (
                                        <MenuItem key={value} value={value}>{label}</MenuItem>
                                    ))}
                                </TextField>
                                <Stack direction="row">
                                    <IconButton size="small" aria-label="הזז למעלה" disabled={index === 0} onClick={() => moveLevel(index, -1)}>
                                        <ArrowUpwardIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" aria-label="הזז למטה" disabled={index === levels.length - 1} onClick={() => moveLevel(index, 1)}>
                                        <ArrowDownwardIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" aria-label="הסר רמה" onClick={() => removeLevel(index)}>
                                        <DeleteOutlineIcon fontSize="small" />
                                    </IconButton>
                                </Stack>
                            </Box>
                        ))}
                        {!levels.length && (
                            <Typography variant="body2" color="text.secondary">
                                אין רמות מיון. הרשימה תוצג במיון ברירת המחדל.
                            </Typography>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-between' }}>
                    <MuiButton onClick={addLevel} disabled={levels.length >= MAX_SORT_LEVELS || !unusedOption}>
                        הוסף רמה
                    </MuiButton>
                    <Stack direction="row" spacing={1}>
                        <MuiButton onClick={handleClose}>ביטול</MuiButton>
                        <MuiButton variant="contained" onClick={handleApply}>החל</MuiButton>
                    </Stack>
                </DialogActions>
            </Dialog>
        </>
    );
};
