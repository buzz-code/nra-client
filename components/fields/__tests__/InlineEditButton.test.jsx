import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const mockNotify = jest.fn();
const mockRefresh = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();

// Must be defined before jest.mock so it can be referenced in the factory
const MockTextInput = ({ source, label }) => (
    <input aria-label={label || source} name={source} />
);

let mockRecord = {
    id: 7,
    name: 'greeting',
    value: 'hello',
};

jest.mock('react-admin', () => ({
    Button: ({ label, onClick, disabled, children }) => (
        <button onClick={onClick} disabled={disabled} aria-label={label}>
            {children}
        </button>
    ),
    Form: ({ children, onSubmit }) => (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit({ value: 'new value' }); }}>
            {children}
        </form>
    ),
    SaveButton: ({ alwaysEnable }) => (
        <button type="submit" disabled={!alwaysEnable}>Save</button>
    ),
    TextField: ({ source }) => <span>{source}</span>,
    TextInput: MockTextInput,
    maxLength: () => () => undefined,
    required: () => () => undefined,
    useCreate: (_resource, _id, options) => {
        const fn = (...args) => {
            mockCreate(...args);
            if (options && options.onSuccess) options.onSuccess();
        };
        return [fn, { isLoading: false }];
    },
    useUpdate: (_resource, _id, options) => {
        const fn = (...args) => {
            mockUpdate(...args);
            if (options && options.onSuccess) options.onSuccess();
        };
        return [fn, { isLoading: false }];
    },
    useNotify: () => mockNotify,
    useRefresh: () => mockRefresh,
    useRecordContext: () => mockRecord,
    useTranslate: () => (key) => key,
}));

jest.mock('@mui/material/Dialog', () => ({ children, open }) => (
    open ? <div role="dialog">{children}</div> : null
));
jest.mock('@mui/material/DialogActions', () => ({ children }) => <div>{children}</div>);
jest.mock('@mui/material/DialogContent', () => ({ children }) => <div>{children}</div>);
jest.mock('@mui/material/Stack', () => ({ children }) => <div>{children}</div>);
jest.mock('@mui/material/CircularProgress', () => () => <span>loading</span>);
jest.mock('@mui/icons-material/Edit', () => () => <span>edit-icon</span>);

jest.mock('@shared/utils/notifyUtil', () => ({
    handleError: (notify) => (error) => notify('error', { type: 'error' }),
}));

const { InlineEditButton } = require('../InlineEditButton');

const defaultProps = {
    resource: 'payment_track',
    children: [
        <MockTextInput key="value" source="value" label="ערך" />,
    ],
};

describe('InlineEditButton', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRecord = { id: 7, name: 'greeting', value: 'hello' };
    });

    it('renders edit button', () => {
        render(<InlineEditButton {...defaultProps} />);
        expect(screen.getByRole('button', { name: 'עריכה' })).toBeInTheDocument();
    });

    it('does not show the dialog initially', () => {
        render(<InlineEditButton {...defaultProps} />);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('opens the dialog when the button is clicked', () => {
        render(<InlineEditButton {...defaultProps} />);
        fireEvent.click(screen.getByRole('button', { name: 'עריכה' }));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('renders the given children inside the dialog', () => {
        render(<InlineEditButton {...defaultProps} />);
        fireEvent.click(screen.getByRole('button', { name: 'עריכה' }));
        expect(screen.getByLabelText('ערך')).toBeInTheDocument();
    });

    it('closes the dialog when cancel is clicked', () => {
        render(<InlineEditButton {...defaultProps} />);
        fireEvent.click(screen.getByRole('button', { name: 'עריכה' }));
        fireEvent.click(screen.getByRole('button', { name: 'ra.action.cancel' }));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('updates the record by its own id by default', async () => {
        render(<InlineEditButton {...defaultProps} />);
        fireEvent.click(screen.getByRole('button', { name: 'עריכה' }));
        fireEvent.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => expect(mockUpdate).toHaveBeenCalledWith('payment_track', {
            id: 7,
            data: { value: 'new value' },
            previousData: mockRecord,
        }));
        expect(mockCreate).not.toHaveBeenCalled();
    });

    it('creates a record when getUpdateId returns a falsy value', async () => {
        mockRecord = { id: 7, overrideId: null, name: 'greeting', value: 'hello' };
        render(<InlineEditButton {...defaultProps} getUpdateId={(record) => record.overrideId} />);
        fireEvent.click(screen.getByRole('button', { name: 'עריכה' }));
        fireEvent.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => expect(mockCreate).toHaveBeenCalledWith('payment_track', {
            data: { value: 'new value' },
        }));
        expect(mockUpdate).not.toHaveBeenCalled();
    });

    it('applies getUpdateData to shape the update payload', async () => {
        render(<InlineEditButton {...defaultProps} getUpdateData={(record, data) => ({ value: data.value, ownerId: record.id })} />);
        fireEvent.click(screen.getByRole('button', { name: 'עריכה' }));
        fireEvent.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => expect(mockUpdate).toHaveBeenCalledWith('payment_track', expect.objectContaining({
            data: { value: 'new value', ownerId: 7 },
        })));
    });

    it('applies getCreateData to shape the create payload', async () => {
        mockRecord = { id: 7, overrideId: null, name: 'greeting', value: 'hello' };
        render(<InlineEditButton
            {...defaultProps}
            getUpdateId={(record) => record.overrideId}
            getCreateData={(record, data) => ({ value: data.value, name: record.name })}
        />);
        fireEvent.click(screen.getByRole('button', { name: 'עריכה' }));
        fireEvent.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => expect(mockCreate).toHaveBeenCalledWith('payment_track', {
            data: { value: 'new value', name: 'greeting' },
        }));
    });

    it('closes the dialog and notifies success after saving', async () => {
        render(<InlineEditButton {...defaultProps} />);
        fireEvent.click(screen.getByRole('button', { name: 'עריכה' }));
        fireEvent.click(screen.getByRole('button', { name: 'Save' }));

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        await waitFor(() => expect(mockNotify).toHaveBeenCalledWith('ra.notification.updated', expect.objectContaining({ type: 'info' })));
        expect(mockRefresh).toHaveBeenCalled();
    });

    it('stops propagation when the button is clicked so the row click is not triggered', () => {
        render(<InlineEditButton {...defaultProps} />);
        const button = screen.getByRole('button', { name: 'עריכה' });
        const event = new MouseEvent('click', { bubbles: true, cancelable: true });
        const stopPropagationSpy = jest.spyOn(event, 'stopPropagation');
        fireEvent(button, event);
        expect(stopPropagationSpy).toHaveBeenCalled();
    });
});
