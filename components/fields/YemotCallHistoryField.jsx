import React from 'react';
import { useRecordContext } from 'react-admin';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const YemotCallHistoryField = ({ source }) => {
    const record = useRecordContext();
    if (!record || !record[source]) return null;

    return (
        <List dense>
            {record[source].map((item, index) => (
                <ListItem key={index}>
                    <ListItemText
                        primary={`Response: ${item.response}`}
                        secondary={`Time: ${item.time}`}
                    />
                </ListItem>
            ))}
        </List>
    );
};

YemotCallHistoryField.defaultProps = {
    addLabel: true,
};

export default YemotCallHistoryField;
