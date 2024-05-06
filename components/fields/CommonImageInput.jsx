import { ImageInput, ImageField } from "react-admin";
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import { readAsDataURL } from "@shared/utils/fileUtil";

export const CommonImageInput = ({ source, accept = 'image/*', maxSize = 16_000_000, ...props }) => {
    const { watch, setValue, setError } = useFormContext();
    const value = watch(source);

    useEffect(() => {
        if (value?.src?.includes('blob') && value.rawFile) {
            readAsDataURL(value.rawFile)
                .then(src => setValue(source, { ...value, src }))
                .catch(err => setError(source, err));
        };
    }, [value, setValue]);

    return (
        <ImageInput source={source} accept={accept} maxSize={maxSize} {...props}>
            <ImageField source="src" title="title" />
        </ImageInput>
    );
}