import { fetchUtils } from 'react-admin';
import { fetchJson, translateErrorCode } from '../httpUtil';

jest.mock('react-admin', () => ({
    fetchUtils: { fetchJson: jest.fn() },
}));

const buildHttpError = (body) => {
    const error = new Error(body?.message ?? 'error');
    error.status = body?.statusCode;
    error.body = body;
    return error;
};

describe('translateErrorCode', () => {
    it('replaces the message of a known error code with its translation key', () => {
        const error = buildHttpError({ statusCode: 503, code: 'PDF_RENDER_BUSY', message: 'busy' });
        expect(translateErrorCode(error).message).toBe('ra.notification.pdf_render_busy');
    });

    it('translates the PDF print timeout code', () => {
        const error = buildHttpError({ statusCode: 413, code: 'PDF_PRINT_TIMEOUT', message: 'too big' });
        expect(translateErrorCode(error).message).toBe('ra.notification.pdf_print_timeout');
    });

    it('leaves errors without a known code untouched', () => {
        const error = buildHttpError({ statusCode: 500, message: 'Internal server error' });
        expect(translateErrorCode(error).message).toBe('Internal server error');
    });

    it('handles errors without a body', () => {
        const error = new Error('Network error');
        expect(translateErrorCode(error).message).toBe('Network error');
    });
});

describe('fetchJson', () => {
    it('sends credentials and translates known error codes on failure', async () => {
        const error = buildHttpError({ statusCode: 503, code: 'PDF_RENDER_BUSY', message: 'busy' });
        fetchUtils.fetchJson.mockRejectedValueOnce(error);

        await expect(fetchJson('/report', {})).rejects.toBe(error);
        expect(error.message).toBe('ra.notification.pdf_render_busy');
        expect(fetchUtils.fetchJson).toHaveBeenCalledWith('/report', { credentials: 'include' });
    });
});
