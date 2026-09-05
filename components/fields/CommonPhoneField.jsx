import { useRecordContext } from 'react-admin';
import get from 'lodash/get';
import Typography from '@mui/material/Typography';

// Phone numbers are digits - force LTR and tabular figures so they don't
// flip/misalign inside an RTL table, dense rows included.
const CommonPhoneField = ({ source }) => {
    const record = useRecordContext();
    const value = get(record, source);
    if (!value) {
        return null;
    }

    return (
        <Typography
            component="span"
            variant="body2"
            dir="ltr"
            sx={{ fontVariantNumeric: 'tabular-nums', display: 'inline-block' }}
        >
            {value}
        </Typography>
    );
};

export default CommonPhoneField;
