import { useCallback, useEffect, useState } from "react";
import { useDataProvider, useResourceContext } from "react-admin";

export const STATUSES = {
    pending: 'pending',
    success: 'success',
    error: 'error',
};

export const useSavableData = (fileName: string, baseData: any[]) => {
    const [data, setData] = useState<any[]>(baseData);
    const [fileId, setFileId] = useState<number>();
    const updateItem = useCallback((index: string, item: any) => {
        setData(prevData => {
            const newData = [...prevData];
            newData[index] = { ...newData[index], ...item };
            return newData;
        });
    }, [setData]);
    const saveData = useSaveData(data, fileName, fileId, updateItem, setFileId);

    useEffect(() => { setData(baseData) }, [baseData]);

    return { data, saveData };
}

const useSaveData = (data: any[], fileName: string, fileId: number, updateDataItem: (index: string, item: any) => void, setFileId: (fileId: number) => void) => {
    const resource = useResourceContext();
    const { createItem, updateItem } = useCreateItem(resource);

    const saveData = useCallback(async () => {
        let successCount = 0, errorCount = 0;
        for (const index in data) {
            const item = data[index];
            if (item.id) {
                continue;
            }
            updateDataItem(index, { status: STATUSES.pending });
            try {
                const res = await createItem(item);
                updateDataItem(index, { id: res.data.id, status: STATUSES.success });
                successCount++;
            } catch (e) {
                const errorMessage = (e.body ?? e)?.message ?? 'שגיאה לא ידועה';
                updateDataItem(index, { status: STATUSES.error, error: errorMessage });
                errorCount++;
            }
        }

        const entityIds = data.map(item => item.id).filter(id => id);
        if (entityIds.length) {
            if (fileId) {
                await updateItem({ id: fileId, entityIds }, 'import_file');
            } else {
                const fileData = {
                    fileName,
                    fileSource: 'קובץ שהועלה',
                    entityName: resource,
                    entityIds,
                    response: 'נשמר',
                };
                const res = await createItem(fileData, 'import_file');
                setFileId(res.data.id);
            }
        }

        return { successCount, errorCount };
    }, [data, fileId, fileName, resource, createItem, updateItem, updateDataItem, setFileId]);

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
