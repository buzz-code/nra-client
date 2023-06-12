import { useState, useRef, forwardRef, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { Button, ListContextProvider, useDataProvider, useList, useTranslate, useNotify, ReferenceInput, Form, AutocompleteInput } from 'react-admin';
import Upload from '@mui/icons-material/FileUpload';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import LinearProgress from '@mui/material/LinearProgress';
import { useMutation } from 'react-query';
import { useIsAdmin } from '@shared/utils/permissionsUtil';
import { handleError } from '@shared/utils/notifyUtil';

export const ImportButton = ({ resource, refetch, fields, datagrid, ...props }) => {
    const [uploadedData, setUploadedData] = useState(null);
    const [fileName, setFileName] = useState(null);
    const fileSelector = useRef();
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const isAdmin = useIsAdmin();

    const { mutate, isLoading } = useMutation({
        mutationFn: (data) => dataProvider.importFile(resource, data, fileName),
        onSuccess: (res) => {
            setUploadedData(null);
            setFileName(null);

            notify('ra.message.import_success', { type: 'info' });
            refetch();
        },
        onError: handleError(notify)
    });

    const handleFileSelect = useCallback((e) => {
        e.preventDefault();
        fileSelector.current.click();
    }, []);

    const handleDataParse = useCallback(({ name, data }) => {
        setUploadedData(data);
        setFileName(name);
    }, [setUploadedData, setFileName]);

    const handlePreviewClose = useCallback((isSave, userId) => {
        if (isSave) {
            if (isAdmin && userId) {
                uploadedData.forEach(item => {
                    item.userId = userId;
                });
            }
            mutate(uploadedData);
        } else {
            setUploadedData(null);
            setFileName(null);
        }
    }, [uploadedData, mutate, setUploadedData, setFileName]);

    return <>
        <Button onClick={handleFileSelect} label={'ra.action.import'} startIcon={<Upload />} {...props} />
        <ExcelImportInput ref={fileSelector} fields={fields} onDataParsed={handleDataParse} />
        <PreviewListDialog
            isAdmin={isAdmin}
            data={uploadedData} isLoading={isLoading}
            datagrid={datagrid} onDialogClose={handlePreviewClose} />
    </>
}

const ExcelImportInput = forwardRef(({ fields, onDataParsed }, ref) => {
    const processFile = useCallback(file => {
        var name = file.name;
        const reader = new FileReader();
        reader.onload = (evt) => { // evt = on_file_select event
            /* Parse data */
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws, { header: fields, range: 1 });
            /* Update state */
            onDataParsed({ name, data });
        };
        reader.readAsBinaryString(file);
    }, [fields, onDataParsed]);

    const handleFileUpload = useCallback(e => {
        const { files } = e.target;
        if (files && files.length) {
            processFile(files[0]);
        }
        e.target.value = null;
    }, [processFile]);

    return (
        <input
            type='file' accept='.csv, .xls, .xlsx' style={{ display: 'none' }}
            ref={ref} onChange={handleFileUpload} />
    )
});

const PreviewListDialog = ({ isAdmin, data, isLoading, datagrid, onDialogClose }) => {
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
                    <Form toolbar={false}>
                        <ReferenceInput source="userId" reference="user" >
                            <AutocompleteInput onChange={setUserId} />
                        </ReferenceInput>
                    </Form>
                )}
                <ListContextProvider value={listContext}>
                    <Datagrid rowClick={null} bulkActionButtons={null} />
                </ListContextProvider>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog} autoFocus disabled={isLoading} label={translate('ra.action.cancel')} />
                <Button onClick={importAndCloseDialog} disabled={isLoading} label={translate('ra.action.import')} />
            </DialogActions>
        </Dialog>
    )
}