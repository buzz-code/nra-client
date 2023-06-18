import { DateField, ReferenceField, TextField, TextInput, ReferenceInput } from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { CommonEntityNameField } from '@shared/components/fields/CommonEntityNameField';
import { CommonCountField } from '@shared/components/fields/CommonCountField';
import { CommonEntityNameInput } from '@shared/components/fields/CommonEntityNameInput';
import { ShowMatchingRecordsButton } from '@shared/components/fields/ShowMatchingRecordsButton';

const filters = [
    ({ isAdmin }) => isAdmin && <ReferenceInput source="userId" reference="user" />,
    <CommonEntityNameInput source="entityName" />,
    <TextInput source="fileName" />
];

const Datagrid = ({ isAdmin, ...props }) => {
    return (
        <CommonDatagrid {...props} readonly>
            <TextField source="id" />
            {isAdmin && <ReferenceField source="userId" reference="user" />}
            <TextField source="fileName" />
            <TextField source="fileSource" />
            <CommonCountField source="entityIds" />
            <CommonEntityNameField source="entityName" />
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
    exporter: false,
};

export default getResourceComponents(entity);
