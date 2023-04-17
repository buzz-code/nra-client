import { List, Datagrid, BulkDeleteWithConfirmButton } from 'react-admin';
import { CommonListActions } from '@shared/components/crudContainers/CommonListActions';

const BulkActionButtons = ({ additionalBulkButtons }) => (
    <>
        {additionalBulkButtons}
        {/* <BulkExportButton /> */}
        <BulkDeleteWithConfirmButton />
    </>
);


export const CommonList = ({ children, importer, exporter, ...props }) => (
    <List actions={<CommonListActions importer={importer} />} exporter={exporter} {...props}>
        {children}
    </List>
)

export const CommonDatagrid = ({ children, readonly, additionalBulkButtons, ...props }) => {
    const bulkActionButtons = <BulkActionButtons additionalBulkButtons={additionalBulkButtons} />;

    return (
        <Datagrid rowClick={!readonly && 'edit'} bulkActionButtons={!readonly && bulkActionButtons} {...props}>
            {children}
        </Datagrid>
    )
}