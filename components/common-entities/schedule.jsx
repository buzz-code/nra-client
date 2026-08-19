import {
    BooleanField,
    BooleanInput,
    DateField,
    DateTimeInput,
    maxLength,
    ReferenceField,
    required,
    TextField,
    TextInput,
} from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { CommonRepresentation } from '@shared/components/CommonRepresentation';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import CommonReferenceInput from '@shared/components/fields/CommonReferenceInput';
import { commonAdminFilters } from '@shared/components/fields/PermissionFilter';

const filters = [
    ...commonAdminFilters,
    <TextInput source="name:$cont" alwaysOn />,
    <TextInput source="jobType:$cont" alwaysOn />,
];

const Datagrid = ({ isAdmin, children, ...props }) => {
    return (
        <CommonDatagrid {...props}>
            {children}
            {isAdmin && <TextField source="id" />}
            {isAdmin && <ReferenceField source="userId" reference="user" />}
            <TextField source="name" />
            <TextField source="jobType" />
            <TextField source="cronExpression" />
            <TextField source="timeZone" />
            <BooleanField source="active" />
            <DateField showDate showTime source="nextRunAt" />
            <DateField showDate showTime source="lastRunAt" />
        </CommonDatagrid>
    );
};

const Inputs = ({ isCreate, isAdmin }) => {
    return (
        <>
            {!isCreate && isAdmin && <TextInput source="id" disabled />}
            {isAdmin && <CommonReferenceInput source="userId" reference="user" validate={required()} />}
            <TextInput source="name" validate={[required(), maxLength(255)]} />
            <TextInput source="jobType" validate={[required(), maxLength(100)]} />
            <TextInput source="cronExpression" validate={[required(), maxLength(120)]} />
            <TextInput source="timeZone" validate={[maxLength(60)]} />
            <BooleanInput source="active" defaultValue={true} />
            {!isCreate && <DateTimeInput source="nextRunAt" disabled />}
            {!isCreate && <DateTimeInput source="lastRunAt" disabled />}
        </>
    );
};

const entity = {
    Datagrid,
    Inputs,
    Representation: CommonRepresentation,
    filters,
};

export default getResourceComponents(entity);
