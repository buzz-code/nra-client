import { DateField, DateTimeInput, EmailField, TextField, TextInput } from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { QuickFilter } from '@shared/components/QuickFilter';
import { CommonRepresentation } from '@shared/components/CommonRepresentation';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { CommonJsonField, CommonJsonInput } from '../CommonJsonItem';

const filters = [
    <TextInput source="name" alwaysOn />,
    <TextInput source="email" alwaysOn />,
    <TextInput source="phoneNumber" />,
    <QuickFilter source="fromEmail" defaultValue="gmail" />
];

const Datagrid = ({ isAdmin, ...props }) => {
    return (
        <CommonDatagrid {...props}>
            <TextField source="id" />
            <TextField source="name" />
            <EmailField source="email" />
            <TextField source="phoneNumber" />
            <TextField source="active" />
            <TextField source="effective_id" />
            <CommonJsonField source="permissions" />
            <CommonJsonField source="additionalData" />
            <CommonJsonField source="userInfo" />
            <DateField showDate showTime source="createdAt" />
            <DateField showDate showTime source="updatedAt" />
        </CommonDatagrid>
    );
}

const Inputs = ({ isCreate, isAdmin }) => {
    return <>
        {!isCreate && <TextInput source="id" disabled />}
        <TextInput source="name" />
        <TextInput source="email" />
        <TextInput source="password" />
        <TextInput source="phoneNumber" />
        <TextInput source="active" />
        <TextInput source="fromEmail" />
        <TextInput source="replyToEmail" />
        <TextInput source="effective_id" />
        <CommonJsonInput source="permissions" />
        <CommonJsonInput source="additionalData" />
        <CommonJsonInput source="userInfo" />
        {!isCreate && <DateTimeInput source="createdAt" disabled />}
        {!isCreate && <DateTimeInput source="updatedAt" disabled />}
    </>
}

const Representation = CommonRepresentation;

const entity = {
    Datagrid,
    Inputs,
    Representation,
    filters,
};

export default getResourceComponents(entity);
