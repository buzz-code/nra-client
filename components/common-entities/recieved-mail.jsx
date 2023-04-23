import { Button, DateField, Link, ReferenceArrayField, ReferenceField, ReferenceInput, TextField, TextInput, useCreatePath, useRecordContext } from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import ListIcon from '@mui/icons-material/List';

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
            <ShowMatchingFilesButton />
        </CommonDatagrid>
    );
}

const ShowMatchingFilesButton = ({ ...props }) => {
    const record = useRecordContext();
    const createPath = useCreatePath();

    return (
        <Button label='ra.action.show_matching_records' startIcon={<ListIcon />}
            component={Link}
            to={{
                pathname: createPath({ resource: 'import_file', type: 'list' }),
                search: `filter=${JSON.stringify({ 'id:$in': record.importFileIds })}`
            }}
            onClick={e => e.stopPropagation()} />
    );
}

const entity = {
    Datagrid,
    filters,
    exporter: false
};

export default getResourceComponents(entity);
