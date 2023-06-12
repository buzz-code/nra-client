import { List, Datagrid, BulkDeleteWithConfirmButton, useResourceDefinition } from 'react-admin';
import { CommonListActions } from '@shared/components/crudContainers/CommonListActions';

const BulkActionButtons = ({ additionalBulkButtons, ...props }) => {
    const { hasCreate } = useResourceDefinition(props);

    return (
        <>
            {additionalBulkButtons}
            {/* <BulkExportButton /> */}
            {hasCreate && <BulkDeleteWithConfirmButton />}
        </>
    );
}


export const CommonList = ({ children, importer, exporter, filterDefaultValues, ...props }) => (
    <List actions={<CommonListActions importer={importer} />} exporter={exporter}
        filterDefaultValues={filterDefaultValues} {...props}>
        {children}
    </List>
)

export const CommonDatagrid = ({ children, readonly, additionalBulkButtons, ...props }) => {
    const bulkActionButtons = <BulkActionButtons additionalBulkButtons={additionalBulkButtons} {...props} />;

    return (
        <Datagrid rowClick={!readonly && 'edit'} bulkActionButtons={!readonly && bulkActionButtons} {...props}>
            {children}
        </Datagrid>
    )
}