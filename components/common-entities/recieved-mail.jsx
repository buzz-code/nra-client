import { DateField, ReferenceArrayField, ReferenceField, ReferenceInput, TextField, TextInput } from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { ShowMatchingRecordsButton } from '../fields/ShowMatchingRecordsButton';

const filters = [
    ({ isAdmin }) => isAdmin && <ReferenceInput source="userId" reference="user" />,
    <TextInput source="from:$cont" label="מאת" />,
    <TextInput source="subject:$cont" label="נושא" />,
];

const Datagrid = ({ isAdmin, ...props }) => {
    return (
        <CommonDatagrid {...props}>
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
