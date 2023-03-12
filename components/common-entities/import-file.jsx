import { DateField, ReferenceField, TextField, Button, useRecordContext, useCreatePath, Link } from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { CommonEntityNameField } from '../CommonEntityNameField';
import { CommonCountField } from '../CommonCountField';
import ListIcon from '@mui/icons-material/List';

const Datagrid = ({ isAdmin, ...props }) => {
    return (
        <CommonDatagrid {...props} readonly>
            <TextField source="id" />
            {isAdmin && <ReferenceField source="userId" reference="user" />}
            <TextField source="fileName" />
            <CommonCountField source="entityIds" />
            <CommonEntityNameField source="entityName" />
            <DateField source="createdAt" />
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

const entity = {
    Datagrid,
    exporter: false,
};

export default getResourceComponents(entity);
