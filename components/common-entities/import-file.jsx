import { BooleanField, DateField, ReferenceField, TextField, TextInput } from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { CommonEntityNameField } from '@shared/components/fields/CommonEntityNameField';
import { CommonCountField } from '@shared/components/fields/CommonCountField';
import { CommonEntityNameInput } from '@shared/components/fields/CommonEntityNameInput';
import { ShowMatchingRecordsButton } from '@shared/components/fields/ShowMatchingRecordsButton';
import { adminCreatedAtFilters, adminUserFilter } from '@shared/components/fields/PermissionFilter';

const filters = [
    adminUserFilter,
    <CommonEntityNameInput source="entityName" />,
    <TextInput source="fileName" />,
    ...adminCreatedAtFilters,
];

const Datagrid = ({ isAdmin, children, ...props }) => {
    return (
        <CommonDatagrid {...props} readonly>
            {children}
            {isAdmin && <TextField source="id" />}
            {isAdmin && <ReferenceField source="userId" reference="user" />}
            <TextField source="fileName" />
            <TextField source="fileSource" />
            <CommonCountField source="entityIds" />
            <CommonEntityNameField source="entityName" />
            <BooleanField source="fullSuccess" />
            <TextField source="response" />
            <DateField showDate showTime source="createdAt" />
            <ShowMatchingRecordsButton source="entityIds" resourceField="entityName" />
        </CommonDatagrid>
    );
}

const Representation = 'fileName';

const entity = {
    Datagrid,
    filters,
    Representation,
};

export default getResourceComponents(entity);
