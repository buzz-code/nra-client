import { BooleanField, DateField, DateInput, ReferenceField, TextField, TextInput, ImageField, SelectInput } from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { CommonEntityNameField } from '@shared/components/fields/CommonEntityNameField';
import { CommonCountField } from '@shared/components/fields/CommonCountField';
import { CommonEntityNameInput } from '@shared/components/fields/CommonEntityNameInput';
import { ShowMatchingRecordsButton } from '@shared/components/fields/ShowMatchingRecordsButton';
import { adminUserFilter } from '@shared/components/fields/PermissionFilter';

export const fileSourceChoices = [
    { id: 'קובץ שהועלה', name: 'קובץ שהועלה' },
    { id: 'טופס נוכחות', name: 'טופס נוכחות' },
    { id: 'נשלח במייל', name: 'נשלח במייל' },
];

export const filters = [
    adminUserFilter,
    <CommonEntityNameInput source="entityName" />,
    <TextInput source="fileName" />,
    <SelectInput source="fileSource" choices={fileSourceChoices} />,
    <DateInput source="createdAt:$gte" />,
    <DateInput source="createdAt:$lte" />,
];

export const Datagrid = ({ isAdmin, hasLessonSignature = false, children, ...props }) => {
    return (
        <CommonDatagrid {...props} readonly>
            {children}
            {isAdmin && <TextField source="id" />}
            {isAdmin && <ReferenceField source="userId" reference="user" />}
            <TextField source="fileName" />
            <TextField source="fileSource" />
            {hasLessonSignature && <ImageField source="metadata.signatureData" sortable={false} />}
            <CommonCountField source="entityIds" />
            <CommonEntityNameField source="entityName" />
            <BooleanField source="fullSuccess" />
            <TextField source="response" />
            <DateField showDate showTime source="createdAt" />
            <ShowMatchingRecordsButton source="entityIds" resourceField="entityName" />
        </CommonDatagrid>
    );
}

export const Representation = 'fileName';

const entity = {
    Datagrid,
    filters,
    Representation,
    sort: { field: 'createdAt', order: 'DESC' },
};

export default getResourceComponents(entity);
