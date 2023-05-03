import { DateField, DateTimeInput, ReferenceField, ReferenceInput, required, TextField, TextInput } from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { CommonRepresentation } from '@shared/components/CommonRepresentation';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { CommonEntityNameField } from '../CommonEntityNameField';
import { CommonEntityNameInput } from '../CommonEntityNameInput';
import { CommonMailField } from '../CommonMailField';
import CommonReferenceInput from '../CommonReferenceInput';

const filters = [
    ({ isAdmin }) => isAdmin && <ReferenceInput source="userId" reference="user" />,
    <TextInput source="alias:$cont" label="כתובת מייל" />,
    <TextInput source="entity:$cont" label="טבלת יעד" />,
];

const Datagrid = ({ isAdmin, ...props }) => {
    return (
        <CommonDatagrid {...props}>
            {isAdmin && <TextField source="id" />}
            {isAdmin && <ReferenceField source="userId" reference="user" />}
            <CommonMailField source="alias" />
            <CommonEntityNameField source="entity" />
            {isAdmin && <DateField showDate showTime source="createdAt" />}
            {isAdmin && <DateField showDate showTime source="updatedAt" />}
        </CommonDatagrid>
    );
}

const Inputs = ({ isCreate, isAdmin }) => <>
    {!isCreate && isAdmin && <TextInput source="id" disabled />}
    {isAdmin && <CommonReferenceInput source="userId" reference="user" validate={required()} />}
    <TextInput source="alias" validate={required()} />
    <CommonEntityNameInput source="entity" disabled={!isCreate} allowedEntities={['att_report', 'grade']} validate={required()} />
    {!isCreate && isAdmin && <DateTimeInput source="createdAt" disabled />}
    {!isCreate && isAdmin && <DateTimeInput source="updatedAt" disabled />}
</>

const Representation = CommonRepresentation;

const entity = {
    Datagrid,
    Inputs,
    Representation,
    filters,
};

export default getResourceComponents(entity);
