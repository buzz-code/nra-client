import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const mockNotify = jest.fn();
const mockRefresh = jest.fn();
const mockUpdate = jest.fn();

jest.mock('react-admin', () => ({
    TextField: ({ source }) => <span data-testid={`text-${source}`}>text-value</span>,
    TextInput: ({ source, defaultValue, onChange, onKeyDown, onBlur, autoFocus, error, helperText, label }) => (
        <input
            data-testid={`input-${source}`}
            defaultValue={defaultValue}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            autoFocus={autoFocus}
            aria-label={label || source}
            aria-invalid={!!error}
        />
    ),
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
        name: 'greeting',
        value: 'hello',
    }),
}));

jest.mock('@mui/material/CircularProgress', () => () => <span>loading</span>);
jest.mock('@mui/material/Box', () => ({ children, onClick, sx, component, ...props }) => (
    <span onClick={onClick} data-testid="box" {...props}>{children}</span>
));

jest.mock('@shared/utils/notifyUtil', () => ({
    handleError: (notify) => (error) => notify('error', { type: 'error' }),
}));

const { InlineEditCell } = require('../InlineEditCell');

describe('InlineEditCell', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders read-only TextField by default', () => {
        render(<InlineEditCell source="value" />);
        expect(screen.getByTestId('text-value')).toBeInTheDocument();
        expect(screen.queryByTestId('input-value')).not.toBeInTheDocument();
    });

    it('switches to input on click', () => {
        render(<InlineEditCell source="value" />);
        fireEvent.click(screen.getByTestId('box'));
        expect(screen.getByTestId('input-value')).toBeInTheDocument();
    });

    it('stops propagation on click (prevents row click)', () => {
        const onRowClick = jest.fn();
        render(
            <div onClick={onRowClick}>
                <InlineEditCell source="value" />
            </div>
        );
        fireEvent.click(screen.getByTestId('box'));
        expect(onRowClick).not.toHaveBeenCalled();
    });

    it('saves on Enter key', async () => {
        render(<InlineEditCell source="value" />);
        fireEvent.click(screen.getByTestId('box'));
        const input = screen.getByTestId('input-value');
        fireEvent.change(input, { target: { value: 'new value' } });
        fireEvent.keyDown(input, { key: 'Enter' });

        await waitFor(() => {
            expect(mockUpdate).toHaveBeenCalledWith(1, {
                data: { value: 'new value' },
                previousData: { id: 1, name: 'greeting', value: 'hello' },
            });
        });
    });

    it('reverts on Escape key without saving', () => {
        render(<InlineEditCell source="value" />);
        fireEvent.click(screen.getByTestId('box'));
        const input = screen.getByTestId('input-value');
        fireEvent.change(input, { target: { value: 'changed' } });
        fireEvent.keyDown(input, { key: 'Escape' });

        expect(mockUpdate).not.toHaveBeenCalled();
        expect(screen.getByTestId('text-value')).toBeInTheDocument();
    });

    it('saves on blur when value changed', async () => {
        render(<InlineEditCell source="value" />);
        fireEvent.click(screen.getByTestId('box'));
        const input = screen.getByTestId('input-value');
        fireEvent.change(input, { target: { value: 'blurred value' } });
        fireEvent.blur(input);

        await waitFor(() => {
            expect(mockUpdate).toHaveBeenCalledWith(1, {
                data: { value: 'blurred value' },
                previousData: { id: 1, name: 'greeting', value: 'hello' },
            });
        });
    });

    it('does not save on blur when value unchanged', () => {
        render(<InlineEditCell source="value" />);
        fireEvent.click(screen.getByTestId('box'));
        const input = screen.getByTestId('input-value');
        fireEvent.blur(input);

        expect(mockUpdate).not.toHaveBeenCalled();
    });

    it('uses custom transform function for update data', async () => {
        const transform = (value, record) => ({ value, name: record.name, custom: true });
        render(<InlineEditCell source="value" transform={transform} />);
        fireEvent.click(screen.getByTestId('box'));
        const input = screen.getByTestId('input-value');
        fireEvent.change(input, { target: { value: 'custom' } });
        fireEvent.keyDown(input, { key: 'Enter' });

        await waitFor(() => {
            expect(mockUpdate).toHaveBeenCalledWith(1, {
                data: { value: 'custom', name: 'greeting', custom: true },
                previousData: { id: 1, name: 'greeting', value: 'hello' },
            });
        });
    });

    it('shows validation error and does not save on invalid input', async () => {
        const validate = (value) => value.length < 3 ? 'Too short' : undefined;
        render(<InlineEditCell source="value" validate={validate} />);
        fireEvent.click(screen.getByTestId('box'));
        const input = screen.getByTestId('input-value');
        fireEvent.change(input, { target: { value: 'ab' } });
        fireEvent.keyDown(input, { key: 'Enter' });

        expect(mockUpdate).not.toHaveBeenCalled();
        expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('notifies and refreshes on successful save', async () => {
        render(<InlineEditCell source="value" />);
        fireEvent.click(screen.getByTestId('box'));
        const input = screen.getByTestId('input-value');
        fireEvent.change(input, { target: { value: 'new' } });
        fireEvent.keyDown(input, { key: 'Enter' });

        await waitFor(() => {
            expect(mockNotify).toHaveBeenCalledWith('ra.notification.updated', {
                type: 'info',
                messageArgs: { smart_count: 1 },
            });
            expect(mockRefresh).toHaveBeenCalled();
        });
    });
});