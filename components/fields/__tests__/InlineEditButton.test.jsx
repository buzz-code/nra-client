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

jest.mock('react-admin', () => ({
    Button: ({ label, onClick, disabled, children }) => (
        <button onClick={onClick} disabled={disabled} aria-label={label}>
            {children}
        </button>
    ),
    Form: ({ children, onSubmit }) => (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit({ value: 'new value', filepath: 'new.mp3' }); }}>
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
    useRecordContext: () => ({
        id: 1,
        userId: 10,
        name: 'greeting',
        description: 'Welcome message',
        value: 'hello',
        filepath: '',
        overrideTextId: 5,
    }),
    useTranslate: () => (key) => key,
}));

jest.mock('@mui/material/Dialog', () => ({ children, open }) => (
    open ? <div role="dialog">{children}</div> : null
));
jest.mock('@mui/material/DialogActions', () => ({ children }) => <div>{children}</div>);
jest.mock('@mui/material/DialogContent', () => ({ children }) => <div>{children}</div>);
jest.mock('@mui/material/Stack', () => ({ children }) => <div>{children}</div>);
jest.mock('@mui/material/CircularProgress', () => () => <span>loading</span>);
jest.mock('@mui/material/Box', () => ({ children, onClick, sx, component, ...props }) => (
    <span onClick={onClick} {...props}>{children}</span>
));
jest.mock('@mui/icons-material/Edit', () => () => <span>edit-icon</span>);

jest.mock('@shared/utils/notifyUtil', () => ({
    handleError: (notify) => (error) => notify('error', { type: 'error' }),
}));

const { InlineEditButton } = require('../InlineEditButton');

const defaultProps = {
    resource: 'text',
    getUpdateData: (_record, data) => ({ value: data.value, filepath: data.filepath }),
    getCreateData: (record, data) => ({
        userId: record.userId,
        name: record.name,
        description: record.description,
        value: data.value,
        filepath: data.filepath,
    }),
    getUpdateId: (record) => record.overrideTextId,
    children: [
        <MockTextInput key="value" source="value" label="ערך" />,
        <MockTextInput key="filepath" source="filepath" />,
    ],
};

describe('InlineEditButton', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders edit button', () => {
        render(<InlineEditButton {...defaultProps} />);
        expect(screen.getByLabelText('עריכה')).toBeInTheDocument();
    });

    it('opens dialog on button click', () => {
        render(<InlineEditButton {...defaultProps} />);
        fireEvent.click(screen.getByLabelText('עריכה'));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('stops propagation on button click (prevents row click)', () => {
        const onRowClick = jest.fn();
        const { container } = render(
            <div onClick={onRowClick}>
                <InlineEditButton {...defaultProps} />
            </div>
        );
        fireEvent.click(screen.getByLabelText('עריכה'));
        expect(onRowClick).not.toHaveBeenCalled();
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('calls update with correct data and previousData when updateId exists', async () => {
        render(<InlineEditButton {...defaultProps} />);
        fireEvent.click(screen.getByLabelText('עריכה'));
        fireEvent.click(screen.getByText('Save'));

        await waitFor(() => {
            expect(mockUpdate).toHaveBeenCalledWith('text', {
                id: 5,
                data: { value: 'new value', filepath: 'new.mp3' },
                previousData: {
                    id: 1,
                    userId: 10,
                    name: 'greeting',
                    description: 'Welcome message',
                    value: 'hello',
                    filepath: '',
                    overrideTextId: 5,
                },
            });
        });
        expect(mockCreate).not.toHaveBeenCalled();
    });

    it('calls create when no updateId exists', async () => {
        const mockRecord = require('react-admin');
        const original = mockRecord.useRecordContext;
        mockRecord.useRecordContext = () => ({
            id: 1,
            userId: 10,
            name: 'greeting',
            description: 'Welcome message',
            value: 'hello',
            filepath: '',
        });

        render(<InlineEditButton {...defaultProps} />);
        fireEvent.click(screen.getByLabelText('עריכה'));
        fireEvent.click(screen.getByText('Save'));

        await waitFor(() => {
            expect(mockCreate).toHaveBeenCalledWith('text', {
                data: {
                    userId: 10,
                    name: 'greeting',
                    description: 'Welcome message',
                    value: 'new value',
                    filepath: 'new.mp3',
                },
            });
        });
        expect(mockUpdate).not.toHaveBeenCalled();

        mockRecord.useRecordContext = original;
    });

    it('notifies and refreshes on successful save', async () => {
        render(<InlineEditButton {...defaultProps} />);
        fireEvent.click(screen.getByLabelText('עריכה'));
        fireEvent.click(screen.getByText('Save'));

        await waitFor(() => {
            expect(mockNotify).toHaveBeenCalledWith('ra.notification.updated', {
                type: 'info',
                messageArgs: { smart_count: 1 },
            });
            expect(mockRefresh).toHaveBeenCalled();
        });
    });

    it('closes dialog on cancel button click', () => {
        render(<InlineEditButton {...defaultProps} />);
        fireEvent.click(screen.getByLabelText('עריכה'));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('ra.action.cancel'));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
});