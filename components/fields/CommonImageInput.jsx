import { ImageInput } from "react-admin";
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import { readAsDataURL } from "@shared/utils/fileUtil";
import CommonFileField from './CommonFileField';
import { unwrapFileDataValue } from '@shared/utils/fileField.util';

const defaultImageAccept = {
    'image/jpeg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'image/gif': ['gif'],
    'image/svg+xml': ['svg'],
    'image/vnd.microsoft.icon': ['ico'],
    'image/bmp': ['bmp'],
    'image/webp': ['webp'],
    'image/tiff': ['tiff', 'tif'],
}

export const CommonImageInput = ({ source, accept = defaultImageAccept, maxSize = 16_000_000, ...props }) => {
    const { watch, setValue, setError } = useFormContext();
    const value = watch(source);

    useEffect(() => {
        const fileValue = unwrapFileDataValue(value);
        if (fileValue?.src?.includes('blob') && fileValue.rawFile) {
            readAsDataURL(fileValue.rawFile)
                .then(src => {
                    const updatedFile = { ...fileValue, src };
                    setValue(source, updatedFile);
                })
                .catch(err => setError(source, err));
        };
    }, [value, setValue]);

    return (
        <ImageInput source={source} accept={accept} maxSize={maxSize} {...props}>
            <CommonFileField />
        </ImageInput>
    );
}