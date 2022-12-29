import { List, Datagrid, BulkDeleteButton } from 'react-admin';
import { CommonListActions } from '@shared/components/crudContainers/CommonListActions';

const BulkActionButtons = () => (
    <>
        {/* <BulkExportButton /> */}
        <BulkDeleteButton />
    </>
);


export const CommonList = ({ children, importer, ...props }) => (
    <List actions={<CommonListActions importer={importer} />} {...props}>
        {children}
    </List>
)

export const CommonDatagrid = ({ children, ...props }) => (
    <Datagrid rowClick="edit" bulkActionButtons={<BulkActionButtons />} {...props}>
        {children}
    </Datagrid>
)