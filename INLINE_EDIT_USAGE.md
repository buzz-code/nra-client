# Inline Edit Feature Usage

This document explains how to enable inline editing for entities in the nra-client application.

## Overview

The inline edit feature allows users to edit and create records directly from list views using modal dialogs, eliminating the need for page navigation.

## How to Enable

To enable inline editing for an entity, simply add two properties to the entity configuration:

```javascript
const entity = {
    Datagrid,
    Inputs,
    Representation,
    filters,
    inlineEdit: true,      // Enable inline editing
    inlineCreate: true,    // Enable inline creation
};
```

## Optional Customization

You can also customize the dialog titles:

```javascript
const entity = {
    Datagrid,
    Inputs,
    Representation,
    filters,
    inlineEdit: true,
    inlineCreate: true,
    dialogEditTitle: 'עריכת רשומה',      // Custom edit dialog title
    dialogCreateTitle: 'יצירת רשומה חדשה', // Custom create dialog title
};
```

## Example: Text Entity with Inline Edit

```javascript
import { DateField, DateTimeInput, maxLength, ReferenceField, required, TextField, TextInput, useRecordContext } from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { CommonRepresentation } from '@shared/components/CommonRepresentation';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import CommonReferenceInput from '@shared/components/fields/CommonReferenceInput';
import { adminUserFilter } from '@shared/components/fields/PermissionFilter';

const filters = [
    adminUserFilter,
    <TextInput source="name:$cont" alwaysOn />,
    <TextInput source="description:$cont" label="תיאור" />,
    <TextInput source="value:$cont" label="ערך" alwaysOn />,
    <TextInput source="filepath:$cont" label="נתיב קובץ שמע" />,
];

const Datagrid = ({ isAdmin, children, ...props }) => {
    return (
        <CommonDatagrid {...props}>
            {children}
            {isAdmin && <TextField source="id" />}
            {isAdmin && <ReferenceField source="userId" reference="user" emptyText='system' />}
            <TextField source="name" />
            <TextField source="description" />
            <TextField source="value" />
            <TextField source="filepath" />
            {isAdmin && <DateField showDate showTime source="createdAt" />}
            {isAdmin && <DateField showDate showTime source="updatedAt" />}
        </CommonDatagrid>
    );
}

const Inputs = ({ isCreate, isAdmin }) => {
    const record = useRecordContext();
    const isSystemText = record?.userId === 0;

    return <>
        {!isCreate && isAdmin && <TextInput source="id" disabled />}
        {isAdmin && <CommonReferenceInput source="userId" reference="user" emptyValue={0} emptyText='system' />}
        <TextInput source="name" disabled={!isCreate} validate={[required(), maxLength(100)]} />
        <TextInput source="description" disabled={!isCreate} validate={[required(), maxLength(500)]} />
        <TextInput source="value" validate={[required(), maxLength(10000)]} />
        {!isSystemText && (
            <TextInput 
                source="filepath" 
                validate={[maxLength(255)]} 
                helperText="אופציונלי - אם מלא, ישלח קובץ במקום טקסט"
            />
        )}
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
    inlineEdit: true,      // ← Enable inline editing
    inlineCreate: true,    // ← Enable inline creation
};

export default getResourceComponents(entity);
```

## How It Works

When `inlineEdit` and `inlineCreate` are enabled:

1. **Inline Edit**: An edit button will appear in each row of the datagrid. Clicking it opens a dialog with the form inputs.
2. **Inline Create**: The create button in the list actions will open a dialog instead of navigating to a new page.
3. **Row Click**: Row click navigation is automatically disabled when inline edit is enabled.

## Features

- ✅ Uses existing `Inputs` component (no duplication needed)
- ✅ Maintains backward compatibility (opt-in only)
- ✅ Same validation and permissions as regular edit/create
- ✅ Automatic data refresh after save
- ✅ User-friendly notifications
- ✅ RTL support for Hebrew interface

## Components

The inline edit feature is built using three new components:

1. **CommonFormDialog** - Core dialog component that handles both edit and create modes
2. **EditInDialogButton** - Button that appears in each row to open edit dialog
3. **CreateInDialogButton** - Button that replaces the standard create button

These components are automatically integrated when you enable inline editing in the entity configuration.
