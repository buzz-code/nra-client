import { useCallback, useEffect, useState } from "react";
import { useDataProvider, useResourceContext } from "react-admin";

export const STATUSES = {
    pending: 'pending',
    success: 'success',
    error: 'error',
};

export interface PreSaveHookResult {
    updatedData?: any[];
    metadata?: any;
}

export type PreSaveHook = (data: any[]) => Promise<PreSaveHookResult | void>;

export const useSavableData = (
    resource: string, 
    fileName: string, 
    baseData: any[], 
    metadata?: any, 
    fileSource?: string,
    preSaveHook?: PreSaveHook
) => {
    const [data, setData] = useState<any[]>(baseData);
    const [fileId, setFileId] = useState<number>();
    const updateItem = useCallback((index: string, item: any) => {
        data[index] = { ...data[index], ...item };
        setData([...data]);
    }, [data]);
    const saveData = useSaveData(resource, data, fileName, fileId, updateItem, setFileId, metadata, fileSource, preSaveHook);

    useEffect(() => { setData(baseData) }, [baseData]);

    return { data, saveData };
}

const useSaveData = (
    resource: string, 
    data: any[], 
    fileName: string, 
    fileId: number, 
    updateDataItem: (index: string, item: any) => void, 
    setFileId: (fileId: number) => void, 
    metadata?: any, 
    fileSource?: string,
    preSaveHook?: PreSaveHook
) => {
    const resourceValue = useResourceContext({ resource });
    const { createItem, updateItem } = useCreateItem(resourceValue);

    const saveData = useCallback(async () => {
        let activeData = data;
        let activeMetadata = metadata;

        // Call pre-save hook if provided
        if (preSaveHook) {
            try {
                const hookResult = await preSaveHook(data);
                if (hookResult) {
                    if (hookResult.updatedData) {
                        activeData = hookResult.updatedData;
                    }
                    if (hookResult.metadata !== undefined) {
                        activeMetadata = hookResult.metadata;
                    }
                }
            } catch (e) {
                console.error('Pre-save hook failed:', e);
                // Return early if pre-save hook fails
                return { successCount: 0, errorCount: data.length };
            }
        }

        let successCount = 0, errorCount = 0;
        for (const index in activeData) {
            const item = activeData[index];
            if (item.status === STATUSES.pending || item.status === STATUSES.success) {
                continue;
            }
            updateDataItem(index, { status: STATUSES.pending });
            try {
                let res;
                if (item.id) {
                    res = await updateItem(item);
                } else {
                    res = await createItem(item);
                }
                updateDataItem(index, { id: res.data.id, status: STATUSES.success });
                successCount++;
            } catch (e) {
                const errorMessage = (e.body ?? e)?.message ?? 'שגיאה לא ידועה';
                updateDataItem(index, { status: STATUSES.error, error: errorMessage });
                errorCount++;
            }
        }

        const successEntities = activeData.filter(item => item.status === STATUSES.success);
        if (successEntities.length) {
            const isFullSuccess = successCount === activeData.length;
            if (fileId) {
                const dataToUpdate = {
                    id: fileId,
                    entityIds: successEntities.map(item => item.id),
                    fullSuccess: isFullSuccess,
                    metadata: activeMetadata || undefined,
                    // if fileSource was specified we update it as well
                    ...(fileSource ? { fileSource } : {}),
                };
                await updateItem(dataToUpdate, 'import_file');
            } else {
                const fileData = {
                    userId: activeData[0].userId,
                    fileName,
                    fileSource: fileSource || 'קובץ שהועלה',
                    entityName: resourceValue,
                    entityIds: successEntities.map(item => item.id),
                    fullSuccess: isFullSuccess,
                    response: 'נשמר',
                    metadata: activeMetadata || null,
                };
                const res = await createItem(fileData, 'import_file');
                setFileId(res.data.id);
            }
        }

        return { successCount, errorCount };
    }, [data, fileId, fileName, resourceValue, createItem, updateItem, updateDataItem, setFileId, metadata, fileSource, preSaveHook]);

    return saveData;
}

const useCreateItem = (resource: string) => {
    const dataProvider = useDataProvider();

    const createItem = useCallback(async (item: any, itemResource = resource) => {
        const res = await dataProvider.create(itemResource, { data: item });
        return res;
    }, [dataProvider, resource]);
    const updateItem = useCallback(async (item: any, itemResource = resource) => {
        const res = await dataProvider.update(itemResource, { id: item.id, data: item, previousData: {} });
        return res;
    }, [dataProvider, resource]);

    return { createItem, updateItem };
}
