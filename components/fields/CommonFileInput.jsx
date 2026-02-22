import { FileInput } from "react-admin";
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import { readAsDataURL } from "@shared/utils/fileUtil";
import CommonFileField from './CommonFileField';
import { unwrapFileDataValue } from '@shared/utils/fileField.util';

export const CommonFileInput = ({ source, accept, maxSize = 16_000_000, InputComponent = FileInput, ...props }) => {
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
        <InputComponent source={source} accept={accept} maxSize={maxSize} {...props}>
            <CommonFileField />
        </InputComponent>
    );
}
