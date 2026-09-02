import { List, Datagrid, BulkDeleteWithConfirmButton, useResourceDefinition, useListContext, Pagination, TextField, DatagridConfigurable } from 'react-admin';
import { CommonListActions } from '@shared/components/crudContainers/CommonListActions';
import { CommonEmpty } from '@shared/components/crudContainers/CommonEmpty';
import { BulkFixTimezoneShiftButton } from '@shared/components/crudContainers/BulkFixTimezoneShiftButton';
import { useDefaultPageSize } from '@shared/utils/settingsUtil';
import { PAGE_SIZE_OPTIONS } from '@shared/config/settings';

const useBulkActionButtons = (readonly, additionalBulkButtons = [], hasDelete, props) => {
    const { hasCreate } = useResourceDefinition(props);
    const { data } = useListContext();
    const shouldShowDelete = (!readonly && hasCreate) || hasDelete;
    // Only offer the timezone-fix action where it's actually meaningful: resources
    // whose rows carry a createdAt/updatedAt (the columns nra-server#44 could affect).
    const hasTimestampColumns = Boolean(data?.[0] && ('createdAt' in data[0] || 'updatedAt' in data[0]));

    const actionButtons = additionalBulkButtons.concat([
        hasTimestampColumns && <BulkFixTimezoneShiftButton key='bulkFixTimezoneShift' />,
        // <BulkExportButton />,
        shouldShowDelete && <BulkDeleteWithConfirmButton key='bulkDeleteWithConfirmButton' />,
    ]).filter(Boolean);

    if (!actionButtons.length) {
        return false;
    }

    return <>{actionButtons}</>;
}

const CommonPagination = () => <Pagination rowsPerPageOptions={PAGE_SIZE_OPTIONS} />;

export const CommonList = ({ children, importer, exporter, filterDefaultValues, configurable = true, additionalListActions, ...props }) => {
    const defaultPageSize = useDefaultPageSize();
    
    return (
        <List actions={<CommonListActions importer={importer} configurable={configurable}>{additionalListActions}</CommonListActions>}
            pagination={<CommonPagination />} perPage={defaultPageSize}
            exporter={exporter} filterDefaultValues={filterDefaultValues} {...props}>
            {children}
        </List>
    );
}

export const CommonDatagrid = ({ children, readonly, additionalBulkButtons, hasDelete, configurable = true, InlineEdit, empty = <CommonEmpty />, ...props }) => {
    const bulkActionButtons = useBulkActionButtons(readonly, additionalBulkButtons, hasDelete, props);
    const RaDataGrid = configurable ? DatagridConfigurable : Datagrid;

    return (
        <RaDataGrid rowClick={!readonly && 'edit'} bulkActionButtons={bulkActionButtons} empty={empty} {...props}>
            {children}
            {InlineEdit && <InlineEdit />}
        </RaDataGrid>
    )
}

export const getPivotColumns = (data) => {
    return data?.[0]?.headers ? data[0].headers.map(item => (
        <TextField key={item.value} source={item.value} label={item.label} sortable={false} />
    )) : [];
}