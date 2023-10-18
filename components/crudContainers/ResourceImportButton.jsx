import { useState, useCallback } from 'react';
import { useNotify } from 'react-admin';
import { useMutation } from 'react-query';
import { handleError } from '@shared/utils/notifyUtil';
import { PreviewListDialog } from '../import/PreviewListDialog';
import { useSavableData } from '../import/util';
import { ImportButton } from '../import/ImportButton';

export const ResourceImportButton = ({ resource, refetch, fields, datagrid, ...props }) => {
    const [uploadedData, setUploadedData] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [tryAgain, setTryAgain] = useState(false);
    const { data, saveData } = useSavableData(fileName, uploadedData);
    const notify = useNotify();

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
        <ImportButton fields={fields} handleDataParse={handleDataParse} {...props} />
        <PreviewListDialog
            data={data} isLoading={isLoading} tryAgain={tryAgain}
            datagrid={datagrid} onDialogClose={handlePreviewClose} />
    </>
}
