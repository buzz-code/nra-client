import * as React from 'react';
import { ImageField, useRecordContext } from 'react-admin';
import get from 'lodash/get';
import { unwrapFileDataValue, isImageFileRecord, getFileDisplayTitle } from '@shared/utils/fileField.util';

const CommonFileField = ({ source, srcField = 'src', titleField = 'title', emptyText = 'אין קובץ', ...props }) => {
    const record = useRecordContext();
    const resolvedSource = source ? get(record, source) : record;
    const fileRecord = unwrapFileDataValue(resolvedSource) ?? resolvedSource;

    if (!fileRecord) {
        return null;
    }

    const srcSource = source ? `${source}.${srcField}` : srcField;
    const titleSource = source ? `${source}.${titleField}` : titleField;
    const srcValue = get(fileRecord, srcField);

    if (isImageFileRecord(fileRecord, srcValue)) {
        return <ImageField source={srcSource} title={titleSource} {...props} />;
    }

    const displayTitle = getFileDisplayTitle(fileRecord, titleField) || emptyText;
    return <span>{displayTitle}</span>;
};

export default CommonFileField;
