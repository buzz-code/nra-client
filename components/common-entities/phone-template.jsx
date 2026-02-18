import {
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
import { TestCallButton } from '@shared/components/phone-campaign/TestCallButton';

const filters = [
  ...commonAdminFilters,
  <TextInput source="name:$cont" alwaysOn />,
];

const Datagrid = ({ isAdmin, children, ...props }) => {
  return (
    <CommonDatagrid {...props}>
      {children}
      {isAdmin && <TextField source="id" />}
      {isAdmin && <ReferenceField source="userId" reference="user" emptyText='system' />}
      <TextField source="name" />
      <TextField source="message" />
      {isAdmin && <DateField showDate showTime source="createdAt" />}
      {isAdmin && <DateField showDate showTime source="updatedAt" />}
    </CommonDatagrid>
  );
};

const Inputs = ({ isCreate, isAdmin }) => {
  return <>
    {!isCreate && isAdmin && <TextInput source="id" disabled />}
    {isAdmin && <CommonReferenceInput source="userId" reference="user" validate={required()} />}
    <TextInput source="name" validate={[required(), maxLength(255)]} fullWidth />
    <TextInput
      source="message"
      validate={[required(), maxLength(1000)]}
      multiline
      rows={4}
      fullWidth
      helperText="הודעה שתושמע בשיחה (טקסט להקראה)"
    />
    {!isCreate && isAdmin && <DateTimeInput source="createdAt" disabled />}
    {!isCreate && isAdmin && <DateTimeInput source="updatedAt" disabled />}
    {!isCreate && <TestCallButton />}
  </>;
};

const Representation = CommonRepresentation;

const importer = {
  fields: ['name', 'message'],
};

const entity = {
  Datagrid,
  Inputs,
  Representation,
  filters,
  importer,
};

export default getResourceComponents(entity);
