import { ImageInput, ImageField } from "react-admin";
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';

export const CommonImageInput = ({ source, accept = 'image/*', maxSize = 16_000_000, ...props }) => {
    const { watch, setValue, setError } = useFormContext();
    const value = watch(source);

    useEffect(() => {
        if (value?.src?.includes('blob')) {
            const reader = new FileReader();
            reader.onload = () => {
                setValue(source, { ...value, src: reader.result });
            };
            reader.onerror = (err) => {
                setError(source, err);
            };

            reader.readAsDataURL(value.rawFile);
        };
    }, [value, setValue]);

    return (
        <ImageInput source={source} accept={accept} maxSize={maxSize} {...props}>
            <ImageField source="src" title="title" />
        </ImageInput>
    );
}