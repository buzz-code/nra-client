import { ImageInput } from "react-admin";
import { CommonFileInput } from '@shared/components/fields/CommonFileInput';

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

export const CommonImageInput = ({ accept = defaultImageAccept, ...props }) => (
    <CommonFileInput InputComponent={ImageInput} accept={accept} {...props} />
);