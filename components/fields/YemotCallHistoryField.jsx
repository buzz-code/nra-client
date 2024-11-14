import React, { useMemo } from 'react';
import { useRecordContext, ArrayField, ChipField, SingleFieldList } from 'react-admin';
import Chip from '@mui/material/Chip';

const YemotCallHistoryField = ({ source }) => (
    <ArrayField source="history">
        <SingleFieldList>
            <YemotCallHistoryItem />
        </SingleFieldList>
    </ArrayField>
);

const YemotCallHistoryItem = () => {
    const record = useRecordContext();
    if (!record || !record.response) {
        return null;
    }

    const parsedResponse = useMemo(() => {
        return record.response?.split('&')
            .map((item) => {
                const [key, value] = item.split('=');
                return { key, value };
            })
            .filter(({ key, value }) => Boolean(value))
            .map(({ key, value }) => {
                const [type, text] = value.split('-');
                return text ?? value;
            })
            .join(', ');
    }, [record.response]);

    if (!parsedResponse) {
        return null;
    }

    return (
        <Chip label={parsedResponse} />
    );
}

YemotCallHistoryField.defaultProps = {
    addLabel: true,
};

export default YemotCallHistoryField;
