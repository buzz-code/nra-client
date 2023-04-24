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
            {isAdmin && <TextField source="id" />}
            <TextField source="name" />
            <EmailField source="email" />
            <TextField source="phoneNumber" />
            {isAdmin && <TextField source="active" />}
            {isAdmin && <TextField source="effective_id" />}
            {isAdmin && <CommonJsonField source="permissions" />}
            {isAdmin && <CommonJsonField source="additionalData" />}
            <CommonJsonField source="userInfo" />
            <DateField showDate showTime source="createdAt" />
            <DateField showDate showTime source="updatedAt" />
        </CommonDatagrid>
    );
}

const Inputs = ({ isCreate, isAdmin }) => {
    return <>
        {!isCreate && isAdmin && <TextInput source="id" disabled />}
        <TextInput source="name" />
        <TextInput source="email" />
        {isAdmin && <TextInput source="password" />}
        <TextInput source="phoneNumber" />
        {isAdmin && <TextInput source="active" />}
        {isAdmin && <TextInput source="fromEmail" />}
        {isAdmin && <TextInput source="replyToEmail" />}
        {isAdmin && <TextInput source="effective_id" />}
        {isAdmin && <CommonJsonInput source="permissions" />}
        {isAdmin && <CommonJsonInput source="additionalData" />}
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
