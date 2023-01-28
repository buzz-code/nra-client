import { List, Datagrid, BulkDeleteButton } from 'react-admin';
import { CommonListActions } from '@shared/components/crudContainers/CommonListActions';

const BulkActionButtons = () => (
    <>
        {/* <BulkExportButton /> */}
        <BulkDeleteButton />
    </>
);


export const CommonList = ({ children, importer, exporter, ...props }) => (
    <List actions={<CommonListActions importer={importer} />} exporter={exporter} {...props}>
        {children}
    </List>
)

export const CommonDatagrid = ({ children, readonly, ...props }) => (
    <Datagrid rowClick={!readonly && 'edit'} bulkActionButtons={!readonly && <BulkActionButtons />} {...props}>
        {children}
    </Datagrid>
)