import { BooleanField, DateField, ReferenceField, TextField } from 'react-admin';
import { NullableBooleanInput, TextInput } from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import YemotCallHistoryField from '@shared/components/fields/YemotCallHistoryField';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { CommonJsonField } from '@shared/components/fields/CommonJsonItem';
import { commonAdminFilters } from '@shared/components/fields/PermissionFilter';

const filters = [
    ...commonAdminFilters,
    <TextInput source="phone:$cont" alwaysOn />,
    <NullableBooleanInput source="isOpen" />,
    <NullableBooleanInput source="hasError" />,
    <TextInput source="errorMessage:$cont" />,
];

const Datagrid = ({ isAdmin, children, ...props }) => {
    return (
        <CommonDatagrid {...props} readonly>
            {children}
            {isAdmin && <TextField source="id" />}
            {isAdmin && <ReferenceField source="userId" reference="user" />}
            {isAdmin && <TextField source="apiCallId" />}
            <TextField source="phone" />
            <YemotCallHistoryField source="history" />
            <BooleanField source="isOpen" />
            <BooleanField source="hasError" />
            <TextField source="errorMessage" />
            {isAdmin && <TextField source="currentStep" />}
            {isAdmin && <CommonJsonField source="data" />}
            {isAdmin && <DateField showDate showTime source="createdAt" />}
            {isAdmin && <DateField showDate showTime source="updatedAt" />}
        </CommonDatagrid>
    );
}

const entity = {
    Datagrid,
    filters,
    exporter: false,
    sort: { field: 'createdAt', order: 'DESC' },
};

export default getResourceComponents(entity);
