import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LastSentMessageField } from '../YemotCallHistoryField';

let mockRecord;

jest.mock('react-admin', () => ({
    useRecordContext: () => mockRecord,
    useNotify: () => jest.fn(),
}));

describe('LastSentMessageField', () => {
    it('shows an empty-call indication when there is no history yet, instead of a blank cell', () => {
        mockRecord = { data: { version: 'v2' }, history: [] };
        render(<LastSentMessageField source="lastSentMessage" />);
        expect(screen.getByText('אין פעילות')).toBeInTheDocument();
    });

    it('shows the last bot prompt sent, even when the caller never answered it', () => {
        mockRecord = {
            data: { version: 'v2' },
            history: [
                { params: { stepType: 'ask_input', prompt: 'מה מספר תעודת הזהות שלך?' } },
            ],
        };
        render(<LastSentMessageField source="lastSentMessage" />);
        expect(screen.getByText('מה מספר תעודת הזהות שלך?')).toBeInTheDocument();
    });

    it('shows a view-dialog button for a v2 call, and clicking it opens that record without letting the click bubble to the row', () => {
        mockRecord = {
            id: 42,
            data: { version: 'v2' },
            history: [{ params: { stepType: 'ask_input', prompt: 'איזה כיתה?' } }],
        };
        const onOpen = jest.fn();
        const rowClick = jest.fn();
        render(
            <div onClick={rowClick}>
                <LastSentMessageField source="lastSentMessage" onOpen={onOpen} />
            </div>
        );
        fireEvent.click(screen.getByRole('button'));
        expect(onOpen).toHaveBeenCalledWith(mockRecord);
        expect(rowClick).not.toHaveBeenCalled();
    });

    it('renders no view-dialog button for a legacy (pre-v2) call - row click does not open anything for it either', () => {
        mockRecord = {
            history: [
                { params: { ApiCallId: '123', ApiPhone: '0500000000' }, response: '1-כן' },
            ],
        };
        render(<LastSentMessageField source="lastSentMessage" />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('renders nothing but the empty-call indication for a legacy call with no history', () => {
        mockRecord = { history: undefined };
        render(<LastSentMessageField source="lastSentMessage" />);
        expect(screen.getByText('אין פעילות')).toBeInTheDocument();
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
});
