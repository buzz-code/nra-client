import React, { useCallback, useState } from "react";
import { Button, Form, ListContextProvider, ReferenceInput, useList, useTranslate } from "react-admin";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import LinearProgress from '@mui/material/LinearProgress';
import CommonAutocompleteInput from '../fields/CommonAutocompleteInput';

export const PreviewListDialog = ({ isAdmin, data, isLoading, tryAgain, datagrid, onDialogClose }) => {
    const listContext = useList({ data });
    const translate = useTranslate();
    const [userId, setUserId] = useState(null);
    const Datagrid = datagrid;

    const closeDialog = useCallback(() => {
        onDialogClose(false);
    }, [onDialogClose]);

    const importAndCloseDialog = useCallback(() => {
        onDialogClose(true, userId);
    }, [onDialogClose, userId]);

    return (
        <Dialog
            open={!!data} onClose={closeDialog}
            scroll='paper' dir='rtl' fullWidth>
            <DialogTitle>
                {translate('ra.message.import_title')}
            </DialogTitle>
            <DialogContent>
                {isLoading && <LinearProgress />}
                {isAdmin && (
                    <Form>
                        <ReferenceInput source="userId" reference="user" >
                            <CommonAutocompleteInput onChange={setUserId} />
                        </ReferenceInput>
                    </Form>
                )}
                <ListContextProvider value={listContext}>
                    <Datagrid readonly />
                </ListContextProvider>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog} autoFocus disabled={isLoading} label={translate('ra.action.cancel')} />
                <Button onClick={importAndCloseDialog} disabled={isLoading} label={tryAgain ? translate('ra.action.import_again') : translate('ra.action.import')} />
            </DialogActions>
        </Dialog>
    )
}