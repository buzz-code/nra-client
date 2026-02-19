import React from 'react';
import { useFormContext } from 'react-hook-form';
import { DateField, DateTimeInput, maxLength, ReferenceField, required, TextField, TextInput, useRecordContext } from 'react-admin';
import get from 'lodash/get';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { CommonRepresentation } from '@shared/components/CommonRepresentation';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import CommonReferenceInput from '@shared/components/fields/CommonReferenceInput';
import { CommonJsonField, CommonJsonInput } from '@shared/components/fields/CommonJsonItem';
import { CommonImageInput } from '@shared/components/fields/CommonImageInput';
import CommonAutocompleteInput from '@shared/components/fields/CommonAutocompleteInput';
import CommonFileField from '@shared/components/fields/CommonFileField';
import { unwrapFileDataValue, getMimeTypeFromFileData } from '@shared/utils/fileField.util';
import { useUnique } from '@shared/utils/useUnique';
import { adminUserFilter } from '@shared/components/fields/PermissionFilter';
import { useIsGenericImageUpload } from '@shared/utils/permissionsUtil';
import GetAppIcon from '@mui/icons-material/GetApp';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

const filters = [
    adminUserFilter,
];

const ImageDownloadButton = () => {
    const record = useRecordContext();
    const src = record?.fileData?.src;
    const title = record?.fileData?.title || 'image';

    const handleDownload = React.useCallback(
        (event) => {
            if (!src) {
                return;
            }
            event.stopPropagation();
            event.preventDefault();

            const link = document.createElement('a');
            link.href = src;
            link.download = title;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        [src, title]
    );

    return (
        <Tooltip title="הורד קובץ">
            <span>
                <IconButton
                    aria-label="הורד קובץ"
                    onClick={handleDownload}
                    disabled={!src}
                    size="small"
                >
                    <GetAppIcon fontSize="small" />
                </IconButton>
            </span>
        </Tooltip>
    );
};

const Datagrid = ({ isAdmin, children, ...props }) => {
    return (
        <CommonDatagrid {...props}>
            {children}
            {isAdmin && <TextField source="id" />}
            {isAdmin && <ReferenceField source="userId" reference="user" />}
            {/* <CommonJsonField source="fileData" /> */}
            <CommonFileField source="fileData" />
            <ImageDownloadButton label="הורד קובץ" />
            <TextField source="imageTarget" />
            {isAdmin && <DateField showDate showTime source="createdAt" />}
            {isAdmin && <DateField showDate showTime source="updatedAt" />}
        </CommonDatagrid>
    );
}

const imageTargetEnum = ['לוגו לתעודה', 'לוגו לתחתית התעודה'];

const validateImageTargetFileType = (value, allValues) => {
    const target = allValues?.imageTarget;
    if (!target || !imageTargetEnum.includes(target)) {
        return undefined;
    }

    const fileDataValue = unwrapFileDataValue(value);
    if (!fileDataValue) {
        return undefined;
    }

    const mimeType = getMimeTypeFromFileData(fileDataValue);
    if (!mimeType) {
        return undefined;
    }

    if (!mimeType.startsWith('image/')) {
        return 'דרוש קובץ מסוג תמונה';
    }

    return undefined;
};

const ImageTargetInput = ({ source, validate, canUseGenericUpload }) => {
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
    const canUseGenericUpload = useIsGenericImageUpload();
    const { watch } = useFormContext();
    const selectedTarget = watch('imageTarget');
    const shouldAllowAnyFile = canUseGenericUpload && !imageTargetEnum.includes(selectedTarget);

    return <>
        {!isCreate && isAdmin && <TextInput source="id" disabled />}
        {isAdmin && <CommonReferenceInput source="userId" reference="user" validate={required()} />}
        {/* <CommonJsonInput source="fileData" /> */}
        <CommonImageInput source="fileData" validate={[required(), validateImageTargetFileType]} accept={shouldAllowAnyFile ? '*/*' : undefined} />
        <ImageTargetInput source="imageTarget" validate={[required(), maxLength(255), unique()]} canUseGenericUpload={canUseGenericUpload} />
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
