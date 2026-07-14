import React, { useState } from 'react';
import { Box, Chip, IconButton, Typography } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useWatch } from 'react-hook-form';
import { ArrayInput, SimpleFormIterator, TextInput, useGetResourceLabel, useSimpleFormIteratorItem } from 'react-admin';
import { CommonSettingsAccordion } from './CommonSettingsAccordion';

// resource/yearFilterType/filter used to be hand-typed here, including a raw
// JSON filter field - nobody actually used it, and yearFilterType's "regular
// vs extended" choice meant nothing without reading the query code. Cards are
// created from a list's own filter UI instead (see AddToDashboardButton),
// which already produces valid resource+filter values. This is management
// only: rename, reorder, remove.
//
// SimpleForm here has no `record`, so SimpleFormIterator rows carry no
// RecordContext - read each row's live values via its form path instead.
const DashboardItemRow = () => {
    const { index } = useSimpleFormIteratorItem();
    const record = useWatch({ name: `dashboardItems.${index}` });
    const getResourceLabel = useGetResourceLabel();
    const [editing, setEditing] = useState(false);
    if (!record?.resource) return null;

    const hasYearFilter = record.yearFilterType && record.yearFilterType !== 'none';
    const hasExtraFilter = record.filter && Object.keys(record.filter).length > 0;

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'nowrap', flex: 1, minWidth: 0 }}>
            <Chip size="small" label={getResourceLabel(record.resource, 2)} sx={{ flexShrink: 0 }} />
            {hasYearFilter && <Chip size="small" variant="outlined" label="מסונן לפי שנה" sx={{ flexShrink: 0 }} />}
            {hasExtraFilter && <Chip size="small" variant="outlined" label="עם סינון נוסף" sx={{ flexShrink: 0 }} />}
            {editing ? (
                <TextInput
                    source="title"
                    label={false}
                    helperText={false}
                    autoFocus
                    onBlur={() => setEditing(false)}
                    sx={{ margin: 0, flex: 1, minWidth: 100 }}
                />
            ) : (
                <Typography variant="body2" noWrap sx={{ flex: 1, minWidth: 0 }}>
                    {record.title}
                </Typography>
            )}
            <IconButton size="small" onClick={() => setEditing((prev) => !prev)} sx={{ flexShrink: 0 }}>
                <EditOutlinedIcon fontSize="small" />
            </IconButton>
        </Box>
    );
};

export function DashboardItemsInput() {
    return (
        <CommonSettingsAccordion
            id="dashboard-items"
            title="הגדרות תמונת מצב"
            subtitle="כרטיסי נתונים שנוספו מתוך רשימות - ניתן לשנות שם, לסדר ולהסיר"
        >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                כדי להוסיף כרטיס חדש, סננו כל רשימה כרצונכם ולחצו על "הוסף לתמונת מצב" בסרגל הכלים
                שלה.
            </Typography>
            <ArrayInput source="dashboardItems" label={false}>
                <SimpleFormIterator disableAdd>
                    <DashboardItemRow />
                </SimpleFormIterator>
            </ArrayInput>
        </CommonSettingsAccordion>
    );
}

export default DashboardItemsInput;
