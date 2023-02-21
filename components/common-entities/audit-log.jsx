import { DateField, ReferenceField, TextField } from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { CommonJsonField } from '../CommonJsonItem';

const Datagrid = ({ isAdmin, ...props }) => {
    return (
        <CommonDatagrid {...props} readonly>
            <TextField source="id" />
            <ReferenceField source="userId" reference="user" />
            <TextField source="entityId" />
            <TextField source="entityName" />
            <TextField source="operation" />
            <CommonJsonField source="entityData" />
            <DateField showDate showTime source="createdAt" />
        </CommonDatagrid>
    );
}

const entity = {
    Datagrid,
    exporter: false,
};

export default getResourceComponents(entity);
