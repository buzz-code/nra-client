import { readAsDataURL } from '@shared/utils/fileUtil';

const isPlainObject = (value: any): value is Record<string, any> =>
    value !== null && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype;

const isPendingFile = (value: any): boolean =>
    isPlainObject(value) &&
    typeof value.src === 'string' &&
    value.src.startsWith('blob:') &&
    typeof Blob !== 'undefined' &&
    value.rawFile instanceof Blob;

/**
 * Replaces temporary `blob:` URLs of newly picked files with their base64 data URL.
 *
 * FileInput values hold a `blob:` src (valid only in the current tab) until the file is read.
 * Reading happens asynchronously, so a fast save could send the `blob:` URL to the server.
 * Resolving here, right before the request, guarantees the server always gets the file content.
 */
export const resolvePendingFiles = async <T>(data: T): Promise<T> => {
    if (Array.isArray(data)) {
        return Promise.all(data.map(item => resolvePendingFiles(item))) as any;
    }
    if (!isPlainObject(data)) {
        return data;
    }
    if (isPendingFile(data)) {
        const src = await readAsDataURL(data.rawFile);
        return { ...data, src };
    }
    const entries = await Promise.all(
        Object.entries(data).map(async ([key, value]) => [key, await resolvePendingFiles(value)] as const)
    );
    return Object.fromEntries(entries) as T;
};
