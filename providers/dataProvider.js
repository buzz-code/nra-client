import crudProvider from './baseDataProvider';

import { apiUrl } from '@shared/providers/constantsProvider';
import { fetchJson } from '@shared/utils/httpUtil';

const dataProvider = crudProvider(apiUrl, fetchJson);

export default dataProvider;


dataProvider.simulateYemotCall = async (body) =>
    dataProvider.exec('yemot_call', 'handle', {
        method: 'POST',
        body: JSON.stringify(body)
    });

dataProvider.importFile = async (resource, bulk, fileName) =>
    dataProvider.createMany(resource, bulk)
        .then(data =>
            dataProvider.create('import_file', {
                data: {
                    fileName,
                    entityName: resource,
                    entityIds: data.map(item => item.id),
                }
            })
        );

