import crudProvider from './baseDataProvider';

import { apiUrl } from '@shared/providers/constantsProvider';
import { fetchJson } from '@shared/utils/httpUtil';

const dataProvider = crudProvider(apiUrl, fetchJson);

export default dataProvider;


dataProvider.simulateYemotCall = async (body) =>
    dataProvider.exec('yemot', 'handle-call', {
        method: 'POST',
        body: JSON.stringify(body)
    });

dataProvider.importFile = async (resource, bulk, fileName) =>
    dataProvider.createMany(resource, bulk)
        .then(data =>
            dataProvider.create('import_file', {
                data: {
                    fileName,
                    fileSource: 'קובץ שהועלה',
                    entityName: resource,
                    entityIds: data.map(item => item.id),
                    fullSuccess: true,
                    response: 'נשמר',
                }
            })
        );

dataProvider.impersonate = async (userId) =>
    dataProvider.exec('auth', 'impersonate', {
        method: 'POST',
        body: JSON.stringify({ userId })
    });


