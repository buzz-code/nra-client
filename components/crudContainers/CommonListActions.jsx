import { useMemo, useContext } from 'react';
import { CreateButton, ExportButton, TopToolbar, FilterButton, useListContext, useResourceContext, useResourceDefinition, FilterContext } from 'react-admin';
import { ImportButton } from '@shared/components/crudContainers/ImportButton';

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

    return useMemo(
        () => (
            <TopToolbar {...props}>
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
