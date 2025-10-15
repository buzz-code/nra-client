import React from 'react';
import { DateField, DateTimeInput, ImageField, maxLength, ReferenceField, required, TextField, TextInput, useRecordContext } from 'react-admin';
import get from 'lodash/get';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { CommonRepresentation } from '@shared/components/CommonRepresentation';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import CommonReferenceInput from '@shared/components/fields/CommonReferenceInput';
import { CommonJsonField, CommonJsonInput } from '@shared/components/fields/CommonJsonItem';
import { CommonImageInput } from '@shared/components/fields/CommonImageInput';
import CommonAutocompleteInput from '@shared/components/fields/CommonAutocompleteInput';
import { useUnique } from '@shared/utils/useUnique';
import { adminUserFilter } from '@shared/components/fields/PermissionFilter';
import { useIsGenericImageUpload } from '@shared/utils/permissionsUtil';

const filters = [
    adminUserFilter,
];

const Datagrid = ({ isAdmin, children, ...props }) => {
    return (
        <CommonDatagrid {...props}>
            {children}
            {isAdmin && <TextField source="id" />}
            {isAdmin && <ReferenceField source="userId" reference="user" />}
            {/* <CommonJsonField source="fileData" /> */}
            <ImageField source="fileData.src" title="fileData.title" />
            <TextField source="imageTarget" />
            {isAdmin && <DateField showDate showTime source="createdAt" />}
            {isAdmin && <DateField showDate showTime source="updatedAt" />}
        </CommonDatagrid>
    );
}

const imageTargetEnum = ['לוגו לתעודה', 'לוגו לתחתית התעודה'];

const ImageTargetInput = ({ source, validate }) => {
    const canUseGenericUpload = useIsGenericImageUpload();
    const record = useRecordContext();
    const currentValue = get(record, source);

    const choices = React.useMemo(() => {
        const baseChoices = imageTargetEnum.map(item => ({ id: item, name: item }));

        if (currentValue && !imageTargetEnum.includes(currentValue)) {
            return [...baseChoices, { id: currentValue, name: currentValue }];
        }

        return baseChoices;
    }, [currentValue]);

    const handleCreate = (newValue) => {
        const trimmedValue = newValue?.trim?.();
        if (trimmedValue) {
            const newChoice = { id: trimmedValue, name: trimmedValue };
            if (!choices.find(choice => choice.id === newChoice.id)) {
                choices.push(newChoice);
            }
            return newChoice;
        }
        return null;
    };

    return (
        <CommonAutocompleteInput
            source={source}
            choices={choices}
            validate={validate}
            onCreate={canUseGenericUpload ? handleCreate : undefined}
            helperText={canUseGenericUpload ? "בחר מהרשימה או הזן טקסט חופשי" : undefined}
        />
    );
};

const Inputs = ({ isCreate, isAdmin }) => {
    const unique = useUnique();

    return <>
        {!isCreate && isAdmin && <TextInput source="id" disabled />}
        {isAdmin && <CommonReferenceInput source="userId" reference="user" validate={required()} />}
        {/* <CommonJsonInput source="fileData" /> */}
        <CommonImageInput source="fileData" validate={required()} />
        <ImageTargetInput source="imageTarget" validate={[required(), maxLength(255), unique()]} />
        {!isCreate && isAdmin && <DateTimeInput source="createdAt" disabled />}
        {!isCreate && isAdmin && <DateTimeInput source="updatedAt" disabled />}
    </>;
}

const Representation = CommonRepresentation;

const entity = {
    Datagrid,
    Inputs,
    Representation,
    filters,
    exporter: false,
};

export default getResourceComponents(entity);
