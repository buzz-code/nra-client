import React from 'react';
import { useRecordContext } from 'react-admin';
import Typography from '@mui/material/Typography';

const YemotCallDataField = ({ source }) => {
    const record = useRecordContext();
    if (!record || !record[source]) return null;

    return (
        <Typography variant="body2" component="pre">
            {JSON.stringify(record[source], null, 2)}
        </Typography>
    );
};

YemotCallDataField.defaultProps = {
    addLabel: true,
};

export default YemotCallDataField;
