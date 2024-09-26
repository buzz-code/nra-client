import { BooleanField, BooleanInput, DateField, DateInput, ReferenceField, TextField } from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { CommonJsonField } from '@shared/components/fields/CommonJsonItem';
import { CommonEntityNameInput } from '@shared/components/fields/CommonEntityNameInput';
import { CommonEntityNameField } from '@shared/components/fields/CommonEntityNameField';
import { CommonReferenceInputFilter } from '@shared/components/fields/CommonReferenceInputFilter';
import { BulkActionButton } from '../crudContainers/BulkActionButton';
import UndoIcon from '@mui/icons-material/Undo';

const filters = [
    ({ isAdmin }) => isAdmin && <CommonReferenceInputFilter source="userId" reference="user" alwaysOn />,
    <CommonEntityNameInput source="entityName" alwaysOn />,
    <DateInput source="createdAt:$gte" label="נוצר אחרי" alwaysOn />,
    <DateInput source="createdAt:$lte" label="נוצר לפני" alwaysOn />,
    <BooleanInput source="isReverted" alwaysOn />,
];

const additionalBulkButtons = [
    <BulkActionButton label='שחזור מידע' icon={<UndoIcon />} name='revert' />
];


const Datagrid = ({ isAdmin, children, ...props }) => {
    return (
        <CommonDatagrid {...props} readonly additionalBulkButtons={additionalBulkButtons}>
            {children}
            <TextField source="id" />
            <ReferenceField source="userId" reference="user" />
            <TextField source="entityId" />
            <CommonEntityNameField source="entityName" />
            <TextField source="operation" />
            <CommonJsonField source="entityData" />
            <BooleanField source="isReverted" />
            <DateField showDate showTime source="createdAt" />
        </CommonDatagrid>
    );
}

const entity = {
    Datagrid,
    filters,
};

export default getResourceComponents(entity);
