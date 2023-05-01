import { DateField, DateTimeInput, TextField, TextInput, RichTextField } from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { CommonRepresentation } from '@shared/components/CommonRepresentation';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { RichTextInput } from 'ra-input-rich-text';

const filters = [
    <TextInput source="name:$cont" alwaysOn />,
    <TextInput source="description:$cont" label="תיאור" />,
    <TextInput source="value:$cont" label="ערך" alwaysOn />,
];

const Datagrid = ({ isAdmin, ...props }) => {
    return (
        <CommonDatagrid {...props}>
            {isAdmin && <TextField source="id" />}
            <TextField source="path" />
            <TextField source="description" />
            <RichTextField source="value" maxHeight={120} overflow='hidden' display='inline-block' />
            {isAdmin && <DateField showDate showTime source="createdAt" />}
            {isAdmin && <DateField showDate showTime source="updatedAt" />}
        </CommonDatagrid>
    );
}

const Inputs = ({ isCreate, isAdmin }) => {
    return <>
        {!isCreate && isAdmin && <TextInput source="id" disabled />}
        <TextInput source="path" disabled={!isCreate} />
        <TextInput source="description" disabled={!isCreate} />
        <RichTextInput source="value" />
        {!isCreate && isAdmin && <DateTimeInput source="createdAt" disabled />}
        {!isCreate && isAdmin && <DateTimeInput source="updatedAt" disabled />}
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
