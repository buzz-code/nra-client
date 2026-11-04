import { fetchUtils } from 'react-admin';

// Server error codes that have a localized message. The server sends a stable
// `code` with an English fallback `message`; the message is replaced with a
// translation key, which react-admin's notify() translates to the user's locale.
export const ERROR_CODE_TRANSLATION_KEYS = {
    PDF_RENDER_BUSY: 'ra.notification.pdf_render_busy',
};

export const translateErrorCode = (error) => {
    const key = ERROR_CODE_TRANSLATION_KEYS[error?.body?.code];
    if (key) {
        error.message = key;
    }
    return error;
};

export const fetchJson = (url, options = {}) => {
    options.credentials = 'include';
    return fetchUtils.fetchJson(url, options)
        .catch((error) => { throw translateErrorCode(error); });
}
