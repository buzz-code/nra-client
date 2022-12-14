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
        <Datagrid rowClick="edit" bulkActionButtons={<BulkActionButtons />}>
            {children}
        </Datagrid>
    </List>
)