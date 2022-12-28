import { List, Datagrid, CreateButton, ExportButton, TopToolbar, BulkExportButton, BulkDeleteButton } from 'react-admin';

const ListActions = () => (
    <TopToolbar>
        <CreateButton />
        <ExportButton />
    </TopToolbar>
);

const BulkActionButtons = () => (
    <>
        <BulkDeleteButton />
    </>
);


export const CommonList = ({ children, ...props }) => (
    <List {...props}>
        {children}
    </List>
)

export const CommonDatagrid = ({ children, ...props }) => (
    <Datagrid rowClick="edit" bulkActionButtons={<BulkActionButtons />} {...props}>
        {children}
    </Datagrid>
)