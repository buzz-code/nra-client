import crudProvider from 'ra-data-nestjsx-crud';
import { fetchUtils } from 'react-admin';
import { RequestQueryBuilder } from '@nestjsx/crud-request';
import { stringify } from 'query-string';

import { apiUrl } from '@shared/providers/constantsProvider';
import { fetchJson } from '@shared/utils/httpUtil';

const dataProvider = crudProvider(apiUrl, fetchJson);

export default dataProvider;


const composeFilter = (paramsFilter) => {
    const flatFilter = fetchUtils.flattenObject(paramsFilter);
    return Object.keys(flatFilter).map((key) => {
        const splitKey = key.split(/\|\||:/)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/gi;

        let field = splitKey[0];
        let ops = splitKey[1];
        if (!ops) {
            if (typeof flatFilter[key] === 'boolean' || typeof flatFilter[key] === 'number' || (typeof flatFilter[key] === 'string' && (flatFilter[key].match(/^\d+$/)) || flatFilter[key].match(uuidRegex))) {
                ops = CondOperator.EQUALS;
            } else {
                ops = CondOperator.CONTAINS_LOW;
            }
        }

        if (field.startsWith('_') && field.includes('.')) {
            field = field.split(/\.(.+)/)[1];
        }
        return { field, operator: ops, value: flatFilter[key] };
    });
};

const composeQueryParams = (queryParams = {}) => {
    return stringify(fetchUtils.flattenObject(queryParams), { skipNull: true });
}

const mergeEncodedQueries = (...encodedQueries) => encodedQueries.map((query) => query).join('&')


dataProvider.getCount = (resource, params) => {
    const { q: queryParams, $OR: orFilter, ...filter } = params.filter || {};

    const encodedQueryParams = composeQueryParams(queryParams)
    const encodedQueryFilter = RequestQueryBuilder.create({
        filter: composeFilter(filter),
        or: composeFilter(orFilter || {})
    })
        .query();

    const query = mergeEncodedQueries(encodedQueryParams, encodedQueryFilter);

    const url = `${apiUrl}/${resource}/get-count?${query}`;
    return fetchJson(url).then(({ json }) => json.count);
};

dataProvider.simulateYemotCall = async (body) => fetchJson(
    `${apiUrl}/yemot_call/handle-call`,
    {
        method: 'POST',
        body: JSON.stringify(body)
    }
);

dataProvider.createMany = (resource, bulk) => fetchJson(
    `${apiUrl}/${resource}/bulk`,
    {
        method: 'POST',
        body: JSON.stringify({ bulk }),
    }
);

dataProvider.export = (resource, params, format) => {
    const { page, perPage } = params.pagination;
    const { q: queryParams, $OR: orFilter, ...filter } = params.filter || {};

    const encodedQueryParams = composeQueryParams(queryParams)
    const encodedQueryFilter = RequestQueryBuilder.create({
        filter: composeFilter(filter),
        or: composeFilter(orFilter || {})
    })
        .setLimit(perPage)
        .setPage(page)
        .sortBy(params.sort)
        .setOffset((page - 1) * perPage)
        .query();

    const query = mergeEncodedQueries(encodedQueryParams, encodedQueryFilter);

    const url = `${apiUrl}/${resource}/export/${format}?${query}`;

    window.open(url, '_blank');
    // return fetchJson(url).then(({ json }) => ({
    //     data: json.data,
    //     total: json.total,
    // }));
};
