import {
  DateField,
  ReferenceField,
  TextField,
  SelectField,
  FunctionField,
} from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { CommonRepresentation } from '@shared/components/CommonRepresentation';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { commonAdminFilters } from '@shared/components/fields/PermissionFilter';

const statusChoices = [
  { id: 'pending', name: 'ממתין' },
  { id: 'in_progress', name: 'בביצוע' },
  { id: 'completed', name: 'הושלם' },
  { id: 'failed', name: 'נכשל' },
];

const filters = [
  ...commonAdminFilters,
];

const Datagrid = ({ isAdmin, children, ...props }) => {
  return (
    <CommonDatagrid {...props} rowClick="show">
      {children}
      {isAdmin && <TextField source="id" />}
      {isAdmin && <ReferenceField source="userId" reference="user" />}
      <ReferenceField source="templateId" reference="phone_template" label="תבנית" />
      <SelectField source="status" choices={statusChoices} />
      <FunctionField
        label="מספר נמענים"
        render={record => record.recipientIds?.length || 0}
      />
      <DateField showDate showTime source="createdAt" />
      {isAdmin && <DateField showDate showTime source="updatedAt" />}
    </CommonDatagrid>
  );
};

const Representation = CommonRepresentation;

const entity = {
  Datagrid,
  Representation,
  filters,
  sort: { field: 'createdAt', order: 'DESC' },
};

export default getResourceComponents(entity);
