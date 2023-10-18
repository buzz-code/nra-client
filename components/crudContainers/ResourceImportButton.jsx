import { useState, useRef, useCallback } from 'react';
import { Button, useNotify } from 'react-admin';
import Upload from '@mui/icons-material/FileUpload';
import { useMutation } from 'react-query';
import { useIsAdmin } from '@shared/utils/permissionsUtil';
import { handleError } from '@shared/utils/notifyUtil';
import { ExcelImportInput } from '../import/ExcelImportInput';
import { PreviewListDialog } from '../import/PreviewListDialog';
import { useSavableData } from '../import/util';

export const ResourceImportButton = ({ resource, refetch, fields, datagrid, ...props }) => {
    const [uploadedData, setUploadedData] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [tryAgain, setTryAgain] = useState(false);
    const fileSelector = useRef();
    const { data, saveData } = useSavableData(fileName, uploadedData);
    const notify = useNotify();
    const isAdmin = useIsAdmin();

    const { mutate, isLoading } = useMutation({
        mutationFn: () => saveData(),
        onSuccess: ({ successCount, errorCount }) => {
            if (errorCount === 0 && successCount > 0) {
                setUploadedData(null);
                setFileName(null);

                notify('ra.message.import_success', { type: 'info' });
                refetch();
            } else if (successCount > 0) {
                notify('ra.message.import_partial_error', { type: 'warning' });
                refetch();
                setTryAgain(true);
            } else {
                notify('ra.message.import_error', { type: 'error' });
            }
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
            mutate();
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
            data={data} isLoading={isLoading} tryAgain={tryAgain}
            datagrid={datagrid} onDialogClose={handlePreviewClose} />
    </>
}
