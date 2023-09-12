import { useState, useRef, useCallback } from 'react';
import { Button, useDataProvider, useNotify } from 'react-admin';
import Upload from '@mui/icons-material/FileUpload';
import { useMutation } from 'react-query';
import { useIsAdmin } from '@shared/utils/permissionsUtil';
import { handleError } from '@shared/utils/notifyUtil';
import { ExcelImportInput } from '../import/ExcelImportInput';
import { PreviewListDialog } from '../import/PreviewListDialog';

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
