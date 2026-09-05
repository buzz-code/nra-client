import React from 'react';
import { render, screen } from '@testing-library/react';
import { LastSentMessageField } from '../YemotCallHistoryField';

let mockRecord;

jest.mock('react-admin', () => ({
    useRecordContext: () => mockRecord,
    useNotify: () => jest.fn(),
}));

describe('LastSentMessageField', () => {
    it('shows the last bot prompt sent in a v2 call, even when the caller never answered it', () => {
        mockRecord = {
            data: { version: 'v2' },
            history: [
                { params: { stepType: 'ask_input', prompt: 'מה מספר תעודת הזהות שלך?' } },
            ],
        };
        render(<LastSentMessageField source="lastSentMessage" />);
        expect(screen.getByText('מה מספר תעודת הזהות שלך?')).toBeInTheDocument();
    });

    it('prefers the last prompt over an earlier one', () => {
        mockRecord = {
            data: { version: 'v2' },
            history: [
                { params: { stepType: 'ask_input', prompt: 'איזה כיתה?' } },
                { params: { stepType: 'user_input', userResponse: "א'" } },
                { params: { stepType: 'ask_input', prompt: 'מה השם שלך?' } },
            ],
        };
        render(<LastSentMessageField source="lastSentMessage" />);
        expect(screen.getByText('מה השם שלך?')).toBeInTheDocument();
    });

    it('renders nothing for a legacy (pre-v2) call', () => {
        mockRecord = { response: 'key=type-text', history: undefined };
        const { container } = render(<LastSentMessageField source="lastSentMessage" />);
        expect(container).toBeEmptyDOMElement();
    });

    it('renders nothing when a v2 call has no history yet', () => {
        mockRecord = { data: { version: 'v2' }, history: [] };
        const { container } = render(<LastSentMessageField source="lastSentMessage" />);
        expect(container).toBeEmptyDOMElement();
    });
});
