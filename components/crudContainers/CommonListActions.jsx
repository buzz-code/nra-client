import { useMemo, useContext } from 'react';
import { CreateButton, TopToolbar, FilterButton, useListContext, useResourceContext, useResourceDefinition, FilterContext } from 'react-admin';
import { ImportButton } from '@shared/components/crudContainers/ImportButton';
import { ExportButton } from './ExportButton';

export const CommonListActions = ({ importer, ...props }) => {
    const {
        sort,
        filterValues,
        exporter,
        total,
        refetch,
    } = useListContext(props);
    const resource = useResourceContext(props);
    const { hasCreate } = useResourceDefinition(props);
    const filters = useContext(FilterContext);
    const {hasCreate: _, ...restProps} = props;

    return useMemo(
        () => (
            <TopToolbar {...restProps}>
                {filters && <FilterButton />}
                {hasCreate && <CreateButton />}
                {exporter !== false && (
                    <ExportButton
                        disabled={total === 0}
                        resource={resource}
                        sort={sort}
                        filterValues={filterValues}
                    />
                )}
                {importer !== null && (
                    <ImportButton
                        resource={resource}
                        refetch={refetch}
                        fields={importer.fields}
                        datagrid={importer.datagrid}
                    />
                )}
            </TopToolbar>
        ),
        /* eslint-disable react-hooks/exhaustive-deps */
        [
            resource,
            filterValues,
            filters,
            total,
            sort,
            exporter,
            hasCreate,
        ]
    );
}
