import React from 'react';
import { DateField, DateTimeInput, ReferenceField, required, TextField, TextInput } from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import CommonReferenceInput from '@shared/components/fields/CommonReferenceInput';
import CommonFileField from '@shared/components/fields/CommonFileField';
import { CommonFileInput } from '@shared/components/fields/CommonFileInput';
import CommonFilePreviewButton, { CommonFileDownloadButton } from '@shared/components/fields/CommonFilePreviewButton';
import { commonAdminFilters } from '@shared/components/fields/PermissionFilter';

const filters = [
    ...commonAdminFilters,
    <TextInput source="title:$cont" label="כותרת" alwaysOn />,
    <TextInput source="description:$cont" label="תיאור" />,
];

const Datagrid = ({ isAdmin, children, ...props }) => (
    <CommonDatagrid {...props}>
        {children}
        {isAdmin && <TextField source="id" label="מזהה" />}
        {isAdmin && <ReferenceField source="userId" reference="user" label="משתמש" />}
        <TextField source="title" label="כותרת" />
        <TextField source="description" label="תיאור" />
        <CommonFileField source="fileData" label="קובץ" />
        <CommonFilePreviewButton source="fileData" label=" " />
        <CommonFileDownloadButton source="fileData" label=" " />
        {isAdmin && <DateField source="createdAt" label="תאריך יצירה" showTime />}
        {isAdmin && <DateField source="updatedAt" label="תאריך עדכון" showTime />}
    </CommonDatagrid>
);

const Inputs = ({ isCreate, isAdmin }) => (
    <>
        {!isCreate && isAdmin && <TextInput source="id" disabled label="מזהה" />}
        {isAdmin && <CommonReferenceInput source="userId" reference="user" label="משתמש" validate={required()} />}
        <TextInput source="title" label="כותרת" validate={required()} fullWidth />
        <TextInput source="description" label="תיאור" fullWidth multiline />
        <CommonFileInput source="fileData" label="קובץ" validate={required()} placeholder="גרור או בחר קובץ" />
        {!isCreate && isAdmin && <DateTimeInput source="createdAt" disabled label="תאריך יצירה" />}
        {!isCreate && isAdmin && <DateTimeInput source="updatedAt" disabled label="תאריך עדכון" />}
    </>
);

const Representation = 'title';

const entity = {
    Datagrid,
    Inputs,
    Representation,
    filters,
};

export default getResourceComponents(entity);
