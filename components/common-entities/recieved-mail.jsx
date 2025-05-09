import { DateField, ReferenceArrayField, ReferenceField, TextField, TextInput } from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { ShowMatchingRecordsButton } from '@shared/components/fields/ShowMatchingRecordsButton';
import { adminCreatedAtFilters, adminUserFilter } from '@shared/components/fields/PermissionFilter';

const filters = [
    adminUserFilter,
    ...adminCreatedAtFilters,
    <TextInput source="from:$cont" label="מאת" />,
    <TextInput source="subject:$cont" label="נושא" />,
];

const Datagrid = ({ isAdmin, children, ...props }) => {
    return (
        <CommonDatagrid {...props}>
            {children}
            {isAdmin && <TextField source="id" />}
            {isAdmin && <ReferenceField source="userId" reference="user" />}
            <TextField source="from" />
            <TextField source="to" />
            <TextField source="subject" />
            <TextField source="body" />
            <TextField source="entityName" />
            <ReferenceArrayField source="importFileIds" reference="import_file" />
            {isAdmin && <DateField showDate showTime source="createdAt" />}
            <ShowMatchingRecordsButton source="importFileIds" resource="import_file" />
        </CommonDatagrid>
    );
}

const entity = {
    Datagrid,
    filters,
    exporter: false
};

export default getResourceComponents(entity);
