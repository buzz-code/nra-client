import { useMemo, useContext } from 'react';
import { List, Datagrid, CreateButton, ExportButton, TopToolbar, BulkDeleteButton, FilterButton, useListContext, useResourceContext, useResourceDefinition, FilterContext } from 'react-admin';
import { ImportButton } from './ImportButton';

const ListActions = ({ importer, ...props }) => {
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

const BulkActionButtons = () => (
    <>
        {/* <BulkExportButton /> */}
        <BulkDeleteButton />
    </>
);


export const CommonList = ({ children, importer, ...props }) => (
    <List actions={<ListActions importer={importer} />} {...props}>
        {children}
    </List>
)

export const CommonDatagrid = ({ children, ...props }) => (
    <Datagrid rowClick="edit" bulkActionButtons={<BulkActionButtons />} {...props}>
        {children}
    </Datagrid>
)