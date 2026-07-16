import React, { useCallback, useState } from 'react';
import { Button, useTranslate } from 'react-admin';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import * as XLSX from 'xlsx';

export const ImportFieldsInfo = ({ resource, fields }: { resource: string; fields: string[] }) => {
    const translate = useTranslate();
    const [open, setOpen] = useState(false);

    const openDialog = useCallback(() => setOpen(true), []);
    const closeDialog = useCallback(() => setOpen(false), []);

    const labels = fields.map(field => translate(`resources.${resource}.fields.${field}`, { _: field }));

    const downloadTemplate = useCallback(() => {
        const worksheet = XLSX.utils.aoa_to_sheet([labels]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, `${resource}.xlsx`);
    }, [labels, resource]);

    if (!fields?.length) {
        return null;
    }

    return (
        <>
            <Tooltip title={translate('ra.action.import_fields_info')}>
                <IconButton size="small" onClick={openDialog}>
                    <InfoOutlinedIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            <Dialog open={open} onClose={closeDialog} dir="rtl" fullWidth maxWidth="xs">
                <DialogTitle>{translate('ra.action.import_fields_info')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{translate('ra.message.import_fields_description')}</DialogContentText>
                    <List dense>
                        {labels.map((label, index) => (
                            <ListItem key={fields[index]} disableGutters>
                                <ListItemText primary={`${index + 1}. ${label}`} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={downloadTemplate} label="ra.action.download_template" />
                    <Button onClick={closeDialog} label="ra.action.cancel" />
                </DialogActions>
            </Dialog>
        </>
    );
};
