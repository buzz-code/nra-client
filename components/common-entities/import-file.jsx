import { DateField, ReferenceField, TextField } from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { CommonEntityNameField } from '../CommonEntityNameField';

const Datagrid = ({ isAdmin, ...props }) => {
    return (
        <CommonDatagrid {...props} readonly>
            <TextField source="id" />
            {isAdmin && <ReferenceField source="userId" reference="user" />}
            <TextField source="fileName" />
            <TextField source="entityIds" />
            <CommonEntityNameField source="entityName" />
            <DateField source="createdAt" />
        </CommonDatagrid>
    );
}

const entity = {
    Datagrid,
    exporter: false,
};

export default getResourceComponents(entity);
