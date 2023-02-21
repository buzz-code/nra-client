import { DateField, DateInput, EmailField, TextField, TextInput } from 'react-admin';
import { JsonField, JsonInput } from "react-admin-json-view";
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { QuickFilter } from '@shared/components/QuickFilter';
import { CommonRepresentation } from '@shared/components/CommonRepresentation';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';

const filters = [
    <TextInput source="name" alwaysOn />,
    <TextInput source="email" alwaysOn />,
    <TextInput source="phoneNumber" />,
    <QuickFilter source="fromEmail" defaultValue="gmail" />
];

const reactJsonEditOptions = {
    name: null,
    style: {
        direction: 'ltr',
        textAlign: 'left',
    },
};
const reactJsonViewOptions = {
    ...reactJsonEditOptions,
    collapsed: true,
    collapseStringsAfterLength: 15,
    enableClipboard: false,
};

const Datagrid = ({ isAdmin, ...props }) => {
    return (
        <CommonDatagrid {...props}>
            <TextField source="id" />
            <TextField source="name" />
            <EmailField source="email" />
            <TextField source="phoneNumber" />
            <TextField source="active" />
            <TextField source="effective_id" />
            <JsonField source="permissions" reactJsonOptions={reactJsonViewOptions} />
            <JsonField source="additionalData" reactJsonOptions={reactJsonViewOptions} />
            <DateField source="createdAt" />
            <DateField source="updatedAt" />
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
        <JsonInput source="permissions" reactJsonOptions={reactJsonEditOptions} />
        <JsonInput source="additionalData" reactJsonOptions={reactJsonEditOptions} />
        {!isCreate && <DateInput source="createdAt" disabled />}
        {!isCreate && <DateInput source="updatedAt" disabled />}
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
