import { DateField, ReferenceField, ReferenceInput, TextField } from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { CommonJsonField } from '@shared/components/fields/CommonJsonItem';
import { CommonEntityNameInput } from '@shared/components/fields/CommonEntityNameInput';
import { CommonEntityNameField } from '@shared/components/fields/CommonEntityNameField';

const filters = [
    ({ isAdmin }) => isAdmin && <ReferenceInput source="userId" reference="user" />,
    <CommonEntityNameInput source="entityName" />,
];

const Datagrid = ({ isAdmin, ...props }) => {
    return (
        <CommonDatagrid {...props} readonly>
            <TextField source="id" />
            <ReferenceField source="userId" reference="user" />
            <TextField source="entityId" />
            <CommonEntityNameField source="entityName" />
            <TextField source="operation" />
            <CommonJsonField source="entityData" />
            <DateField showDate showTime source="createdAt" />
        </CommonDatagrid>
    );
}

const entity = {
    Datagrid,
    filters,
    exporter: false,
};

export default getResourceComponents(entity);
