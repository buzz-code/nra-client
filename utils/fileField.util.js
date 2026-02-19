import get from 'lodash/get';

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.bmp', '.webp', '.ico', '.tiff', '.tif'];

export const unwrapFileDataValue = (value) => {
    if (!value) return undefined;
    if (Array.isArray(value)) {
        return value[0];
    }
    return value;
};

export const getMimeTypeFromFileData = (fileData) => {
    const value = unwrapFileDataValue(fileData) ?? fileData;
    if (!value) {
        return undefined;
    }
    return value?.rawFile?.type || value?.type || value?.mimeType;
};

const isDataUrlImage = (src) => typeof src === 'string' && src.trim().startsWith('data:image/');
const hasImageExtension = (src) => {
    if (typeof src !== 'string') {
        return false;
    }
    const normalizedSrc = src.split('?')[0].split('#')[0].trim().toLowerCase();
    return IMAGE_EXTENSIONS.some(extension => normalizedSrc.endsWith(extension));
};

export const isImageMimeType = (mimeType) => typeof mimeType === 'string' && mimeType.startsWith('image/');

export const isImageFileRecord = (fileRecord, src) => {
    const mimeType = getMimeTypeFromFileData(fileRecord);
    if (isImageMimeType(mimeType)) {
        return true;
    }

    if (isDataUrlImage(src)) {
        return true;
    }

    return hasImageExtension(src);
};

export const getFileDisplayTitle = (fileRecord, titleField = 'title') => {
    const value = unwrapFileDataValue(fileRecord) ?? fileRecord;
    if (!value) {
        return '';
    }
    return (
        get(value, titleField) ||
        value?.name ||
        value?.rawFile?.name ||
        'קובץ'
    );
};
