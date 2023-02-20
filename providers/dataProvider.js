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

