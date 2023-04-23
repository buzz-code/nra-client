import { DateField, ReferenceField, TextField, Button, useRecordContext, useCreatePath, Link, TextInput, ReferenceInput } from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { CommonEntityNameField } from '../CommonEntityNameField';
import { CommonCountField } from '../CommonCountField';
import ListIcon from '@mui/icons-material/List';
import { CommonEntityNameInput } from '../CommonEntityNameInput';

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
            <ShowMatchingRecordsButton />
        </CommonDatagrid>
    );
}

const ShowMatchingRecordsButton = ({ ...props }) => {
    const record = useRecordContext();
    const createPath = useCreatePath();

    return (
        <Button label='ra.action.show_matching_records' startIcon={<ListIcon />}
            component={Link}
            to={{
                pathname: createPath({ resource: record.entityName, type: 'list' }),
                search: `filter=${JSON.stringify({ 'id:$in': record.entityIds })}`
            }}
            onClick={e => e.stopPropagation()} />
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
