import { List, Datagrid, BulkDeleteWithConfirmButton, useResourceDefinition, Pagination, TextField, DatagridConfigurable } from 'react-admin';
import { CommonListActions } from '@shared/components/crudContainers/CommonListActions';

const useBulkActionButtons = (readonly, additionalBulkButtons = [], deleteResource, props) => {
    const { hasCreate } = useResourceDefinition(props);

    const actionButtons = additionalBulkButtons.concat([
        // <BulkExportButton />,
        !readonly && hasCreate && <BulkDeleteWithConfirmButton key='bulkDeleteWithConfirmButton' resource={deleteResource} />,
    ]).filter(Boolean);

    if (!actionButtons.length) {
        return false;
    }

    return <>{actionButtons}</>;
}

const CommonPagination = () => <Pagination rowsPerPageOptions={[10, 25, 50, 100, 200]} perPage={200} />;

export const CommonList = ({ children, importer, exporter, filterDefaultValues, configurable = true, ...props }) => (
    <List actions={<CommonListActions importer={importer} configurable={configurable} />} pagination={<CommonPagination />}
        exporter={exporter} filterDefaultValues={filterDefaultValues} {...props}>
        {children}
    </List>
)

export const CommonDatagrid = ({ children, readonly, additionalBulkButtons, deleteResource, configurable = true, ...props }) => {
    const bulkActionButtons = useBulkActionButtons(readonly, additionalBulkButtons, deleteResource, props);
    const RaDataGrid = configurable ? DatagridConfigurable : Datagrid;

    return (
        <RaDataGrid rowClick={!readonly && 'edit'} bulkActionButtons={bulkActionButtons} {...props}>
            {children}
        </RaDataGrid>
    )
}

export const getPivotColumns = (data) => {
    return data?.[0]?.headers ? data[0].headers.map(item => (
        <TextField key={item.value} source={item.value} label={item.label} sortable={false} />
    )) : [];
}