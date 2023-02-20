import { CondOperator, QueryFilter, QueryJoin, QuerySort, RequestQueryBuilder } from '@nestjsx/crud-request';
import omitBy from 'lodash.omitby';
import { DataProvider, fetchUtils } from 'ra-core';
import { stringify } from 'query-string';
import { GetListParams, RaRecord } from 'react-admin';
import saveAs from 'file-saver';

/**
 * Maps react-admin queries to a nestjsx/crud powered REST API
 *
 * @see https://github.com/nestjsx/crud
 *
 * @example
 *
 * import React from 'react';
 * import { Admin, Resource } from 'react-admin';
 * import crudProvider from 'ra-data-nestjsx-crud';
 *
 * import { PostList } from './posts';
 *
 * const dataProvider = crudProvider('http://localhost:3000');
 * const App = () => (
 *     <Admin dataProvider={dataProvider}>
 *         <Resource name="posts" list={PostList} />
 *     </Admin>
 * );
 *
 * export default App;
 */

interface ExtendedDataProvider extends DataProvider {
  createMany: (
    resource: string,
    bulk: RaRecord[],
  ) => Promise<RaRecord[]>;
  getCount: (
    resource: string,
    params: GetListParams,
  ) => Promise<{ count: Number }>;
  export: (
    resource: string,
    params: GetListParams,
    format: string,
    resourceLabel: string,
  ) => Promise<void>;
  exec: (
    resource: string,
    url: string,
    params: fetchUtils.Options
  ) => Promise<any>;
}

const countDiff = (o1: Record<string, any>, o2: Record<string, any>): Record<string, any> =>
  omitBy(o1, (v, k) => o2[k] === v);

const composeFilter = (paramsFilter: any): QueryFilter[] => {
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
    return { field, operator: ops, value: flatFilter[key] } as QueryFilter;
  });
};

const composeQueryParams = (queryParams: any = {}): string => {
  return stringify(fetchUtils.flattenObject(queryParams), { skipNull: true });
}

const mergeEncodedQueries = (...encodedQueries) => encodedQueries.map((query) => query).join('&')

const getQueryJoin = (sort: QuerySort): QueryJoin => {
  if (sort?.field?.includes('.')) {
    const field = sort.field.split('.')[0];
    return { field };
  }
  return null;
}

export default (apiUrl: string, httpClient = fetchUtils.fetchJson): ExtendedDataProvider => ({
  getList: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { q: queryParams, $OR: orFilter, ...filter } = params.filter || {};

    const encodedQueryParams = composeQueryParams(queryParams)
    const encodedQueryFilter = RequestQueryBuilder.create({
      filter: composeFilter(filter),
      or: composeFilter(orFilter || {})
    })
      .setLimit(perPage)
      .setPage(page)
      .sortBy(params.sort as QuerySort)
      .setOffset((page - 1) * perPage)
      .setJoin(getQueryJoin(params.sort as QuerySort))
      .query();

    const query = mergeEncodedQueries(encodedQueryParams, encodedQueryFilter);

    const url = `${apiUrl}/${resource}?${query}`;

    return httpClient(url).then(({ json }) => ({
      data: json.data,
      total: json.total,
    }));
  },

  getOne: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
      data: json,
    })),

  getMany: (resource, params) => {
    const query = RequestQueryBuilder.create()
      .setFilter({
        field: 'id',
        operator: CondOperator.IN,
        value: `${params.ids}`,
      })
      .query();

    const url = `${apiUrl}/${resource}?${query}`;

    return httpClient(url).then(({ json }) => ({ data: json.data || json }));
  },

  getManyReference: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { q: queryParams, ...otherFilters } = params.filter || {}
    const filter: QueryFilter[] = composeFilter(otherFilters);

    filter.push({
      field: params.target,
      operator: CondOperator.EQUALS,
      value: params.id,
    });

    const encodedQueryParams = composeQueryParams(queryParams)
    const encodedQueryFilter = RequestQueryBuilder.create({
      filter
    })
      .sortBy(params.sort as QuerySort)
      .setLimit(perPage)
      .setOffset((page - 1) * perPage)
      .setJoin(getQueryJoin(params.sort as QuerySort))
      .query();

    const query = mergeEncodedQueries(encodedQueryParams, encodedQueryFilter);

    const url = `${apiUrl}/${resource}?${query}`;

    return httpClient(url).then(({ json }) => ({
      data: json.data,
      total: json.total,
    }));
  },

  update: (resource, params) => {
    // no need to send all fields, only updated fields are enough
    const data = countDiff(params.data, params.previousData);
    return httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }).then(({ json }) => ({ data: json }));
  },

  updateMany: (resource, params) =>
    Promise.all(
      params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}`, {
          method: 'PUT',
          body: JSON.stringify(params.data),
        }),
      ),
    ).then((responses) => ({
      data: responses.map(({ json }) => json),
    })),

  create: (resource, params) =>
    httpClient(`${apiUrl}/${resource}`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({
      data: { ...params.data, id: json.id },
    })),

  createMany: (resource, bulk) =>
    httpClient(`${apiUrl}/${resource}/bulk`, {
      method: 'POST',
      body: JSON.stringify({ bulk }),
    }).then(({ json }) => json),

  delete: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: 'DELETE',
    }).then(({ json }) => ({ data: { ...json, id: params.id } })),

  deleteMany: (resource, params) =>
    Promise.all(
      params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}`, {
          method: 'DELETE',
        }),
      ),
    ).then((responses) => ({ data: responses.map(({ json }) => json) })),

  getCount: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { q: queryParams, $OR: orFilter, ...filter } = params.filter || {};

    const encodedQueryParams = composeQueryParams(queryParams)
    const encodedQueryFilter = RequestQueryBuilder.create({
      filter: composeFilter(filter),
      or: composeFilter(orFilter || {})
    })
      .setLimit(perPage)
      .setPage(page)
      .sortBy(params.sort as QuerySort)
      .setOffset((page - 1) * perPage)
      .setJoin(getQueryJoin(params.sort as QuerySort))
      .query();

    const query = mergeEncodedQueries(encodedQueryParams, encodedQueryFilter);

    const url = `${apiUrl}/${resource}/get-count?${query}`;

    return httpClient(url).then(({ json }) => ({
      count: json.count,
    }));
  },

  export: (resource, params, format, resourceLabel) => {
    const { page, perPage } = params.pagination;
    const { q: queryParams, $OR: orFilter, ...filter } = params.filter || {};

    const encodedQueryParams = composeQueryParams(queryParams)
    const encodedQueryFilter = RequestQueryBuilder.create({
      filter: composeFilter(filter),
      or: composeFilter(orFilter || {})
    })
      .setLimit(perPage)
      .setPage(page)
      .sortBy(params.sort as QuerySort)
      .setOffset((page - 1) * perPage)
      .setJoin(getQueryJoin(params.sort as QuerySort))
      .query();

    const query = mergeEncodedQueries(encodedQueryParams, encodedQueryFilter);

    const url = `${apiUrl}/${resource}/export/${format}?${query}`;

    return httpClient(url)
      .then(async ({ json }) => {
        const blob = await fetch(`data:${json.type};base64,${json.data}`).then(res => res.blob());
        const timestamp = new Date().toISOString();
        const extension = format === 'excel' ? 'xlsx' : 'pdf';
        const filename = `${resourceLabel}-${timestamp}.${extension}`;
        saveAs(blob, filename);
      });
  },

  exec: (resource, url, params) =>
    httpClient(`${apiUrl}/${resource}/${url}`, params),
});