import React from 'react';
import { render, screen } from '@testing-library/react';
import { LastSentMessageField } from '../YemotCallHistoryField';

let mockRecord;

jest.mock('react-admin', () => ({
    useRecordContext: () => mockRecord,
    useNotify: () => jest.fn(),
}));

describe('LastSentMessageField', () => {
    it('shows the last bot prompt sent, even when the caller never answered it', () => {
        mockRecord = {
            history: [
                { params: { stepType: 'ask_input', prompt: 'מה מספר תעודת הזהות שלך?' } },
            ],
        };
        render(<LastSentMessageField source="lastSentMessage" />);
        expect(screen.getByText('מה מספר תעודת הזהות שלך?')).toBeInTheDocument();
    });

    it('prefers the last prompt over an earlier one', () => {
        mockRecord = {
            history: [
                { params: { stepType: 'ask_input', prompt: 'איזה כיתה?' } },
                { params: { stepType: 'user_input', userResponse: "א'" } },
                { params: { stepType: 'ask_input', prompt: 'מה השם שלך?' } },
            ],
        };
        render(<LastSentMessageField source="lastSentMessage" />);
        expect(screen.getByText('מה השם שלך?')).toBeInTheDocument();
    });

    it('renders nothing for a legacy call, whose steps carry the raw webhook body instead of a prompt', () => {
        mockRecord = {
            history: [
                { params: { ApiCallId: '123', ApiPhone: '0500000000' }, response: '1-כן' },
            ],
        };
        const { container } = render(<LastSentMessageField source="lastSentMessage" />);
        expect(container).toBeEmptyDOMElement();
    });

    it('renders nothing when there is no history yet', () => {
        mockRecord = { history: [] };
        const { container } = render(<LastSentMessageField source="lastSentMessage" />);
        expect(container).toBeEmptyDOMElement();
    });
});
