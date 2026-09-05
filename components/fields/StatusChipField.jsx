import { useRecordContext, useTranslate } from 'react-admin';
import get from 'lodash/get';
import Chip from '@mui/material/Chip';

// Pill-styled replacement for BooleanField's plain check/X icon - colors the
// status instead of relying on an icon alone.
const StatusChipField = ({ source, trueColor = 'success', falseColor = 'default' }) => {
    const record = useRecordContext();
    const translate = useTranslate();
    const value = get(record, source);

    return (
        <Chip
            size="small"
            label={translate(value ? 'ra.boolean.true' : 'ra.boolean.false')}
            color={value ? trueColor : falseColor}
            variant={value ? 'filled' : 'outlined'}
        />
    );
};

export default StatusChipField;
