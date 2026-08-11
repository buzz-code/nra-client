import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ContactPage } from '../ContactPage';
import dataProvider from '@shared/providers/dataProvider';
import { readAsDataURL } from '@shared/utils/fileUtil';

const mockNotify = jest.fn();
let mockIdentity = null;

jest.mock('react-admin', () => ({
    useNotify: () => mockNotify,
    useGetIdentity: () => ({ identity: mockIdentity }),
}));

jest.mock('@shared/providers/dataProvider', () => ({
    sendContactMessage: jest.fn(),
}));

jest.mock('@shared/utils/fileUtil', () => ({
    readAsDataURL: jest.fn(),
}));

const renderContactPage = () => render(<ContactPage />, { wrapper: MemoryRouter });

describe('ContactPage', () => {
    beforeEach(() => {
        mockNotify.mockClear();
        mockIdentity = null;
        dataProvider.sendContactMessage.mockReset().mockResolvedValue({ success: true });
        readAsDataURL.mockReset();
    });

    it('submits name/email/phone/message and notifies on success', async () => {
        renderContactPage();

        fireEvent.change(screen.getByLabelText('שם', { exact: false }), { target: { value: 'ישראל ישראלי' } });
        fireEvent.change(screen.getByLabelText('אימייל', { exact: false }), { target: { value: 'israel@example.com' } });
        fireEvent.change(screen.getByLabelText('טלפון'), { target: { value: '0501234567' } });
        fireEvent.change(screen.getByLabelText('הודעה', { exact: false }), { target: { value: 'שלום, יש לי שאלה' } });

        fireEvent.click(screen.getByText('שליחה'));

        await waitFor(() => expect(dataProvider.sendContactMessage).toHaveBeenCalledWith({
            name: 'ישראל ישראלי',
            email: 'israel@example.com',
            phone: '0501234567',
            message: 'שלום, יש לי שאלה',
            files: [],
        }));
        expect(mockNotify).toHaveBeenCalledWith('ההודעה נשלחה בהצלחה', { type: 'success' });
    });

    it('prefills name/email for a logged-in user', () => {
        mockIdentity = { fullName: 'משתמש מחובר', email: 'user@example.com' };

        renderContactPage();

        expect(screen.getByLabelText('שם', { exact: false })).toHaveValue('משתמש מחובר');
        expect(screen.getByLabelText('אימייל', { exact: false })).toHaveValue('user@example.com');
    });

    it('converts attached files to data URLs before submitting', async () => {
        readAsDataURL.mockResolvedValue('data:text/plain;base64,aGVsbG8=');
        renderContactPage();

        fireEvent.change(screen.getByLabelText('שם', { exact: false }), { target: { value: 'ישראל' } });
        fireEvent.change(screen.getByLabelText('אימייל', { exact: false }), { target: { value: 'israel@example.com' } });
        fireEvent.change(screen.getByLabelText('הודעה', { exact: false }), { target: { value: 'הודעה' } });

        const file = new File(['hello'], 'file.txt', { type: 'text/plain' });
        const fileInput = document.querySelector('input[type="file"]');
        fireEvent.change(fileInput, { target: { files: [file] } });

        fireEvent.click(screen.getByText('שליחה'));

        await waitFor(() => expect(dataProvider.sendContactMessage).toHaveBeenCalledWith(
            expect.objectContaining({
                files: [{ name: 'file.txt', src: 'data:text/plain;base64,aGVsbG8=' }],
            })
        ));
    });

    it('notifies an error when the submission fails', async () => {
        dataProvider.sendContactMessage.mockRejectedValue(new Error('network error'));
        renderContactPage();

        fireEvent.change(screen.getByLabelText('שם', { exact: false }), { target: { value: 'ישראל' } });
        fireEvent.change(screen.getByLabelText('אימייל', { exact: false }), { target: { value: 'israel@example.com' } });
        fireEvent.change(screen.getByLabelText('הודעה', { exact: false }), { target: { value: 'הודעה' } });

        fireEvent.click(screen.getByText('שליחה'));

        await waitFor(() => expect(mockNotify).toHaveBeenCalledWith('אירעה שגיאה בשליחת ההודעה, נסו שוב', { type: 'error' }));
    });
});
