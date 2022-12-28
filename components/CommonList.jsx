import { useMemo, useContext } from 'react';
import { List, Datagrid, CreateButton, ExportButton, TopToolbar, BulkDeleteButton, FilterButton, useListContext, useResourceContext, useResourceDefinition, FilterContext } from 'react-admin';

const ListActions = (props) => {
    const {
        sort,
        filterValues,
        exporter,
        total,
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


export const CommonList = ({ children, ...props }) => (
    <List actions={<ListActions />} {...props}>
        {children}
    </List>
)

export const CommonDatagrid = ({ children, ...props }) => (
    <Datagrid rowClick="edit" bulkActionButtons={<BulkActionButtons />} {...props}>
        {children}
    </Datagrid>
)