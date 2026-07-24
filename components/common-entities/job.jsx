import { DateField, NumberField, ReferenceField, TextField, TextInput } from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { CommonRepresentation } from '@shared/components/CommonRepresentation';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { commonAdminFilters } from '@shared/components/fields/PermissionFilter';

const filters = [
    ...commonAdminFilters,
    <TextInput source="type:$cont" alwaysOn />,
    <TextInput source="status:$cont" alwaysOn />,
];

// Read-only monitor: jobs are created by the server, not by users.
const Datagrid = ({ isAdmin, children, ...props }) => {
    return (
        <CommonDatagrid {...props} readonly>
            {children}
            {isAdmin && <TextField source="id" />}
            {isAdmin && <ReferenceField source="userId" reference="user" />}
            <TextField source="type" />
            <TextField source="status" />
            <NumberField source="progress" />
            <NumberField source="attempts" />
            <TextField source="error" />
            <DateField showDate showTime source="createdAt" />
            <DateField showDate showTime source="completedAt" />
        </CommonDatagrid>
    );
};

const entity = {
    Datagrid,
    Representation: CommonRepresentation,
    filters,
    exporter: false,
    sort: { field: 'createdAt', order: 'DESC' },
};

export default getResourceComponents(entity);
