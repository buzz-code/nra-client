import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AdminContext, Notification, RecordContextProvider, ResourceContextProvider, required, testDataProvider } from 'react-admin';
import { InlineEditCell } from '../InlineEditCell';

/**
 * Uses the real Form/TextInput/react-hook-form stack (only the dataProvider
 * is faked). There's no Save button and no onKeyDown: a <form> with a single
 * text field submits on Enter natively per the HTML spec, so we exercise
 * that by dispatching the actual 'submit' event - jsdom doesn't implement
 * the native Enter-submits-a-lone-field behavior itself, but once the
 * submit event fires, our onSubmit wiring is exactly what a real Enter
 * press would trigger in a browser.
 */
describe('InlineEditCell', () => {
    const record = { id: 1, name: 'greeting', value: 'hello' };

    const renderCell = (props = {}, dataProviderOverrides = {}) => {
        const update = jest.fn((_resource, params) => Promise.resolve({ data: { ...record, ...params.data, id: params.id } }));
        const dataProvider = testDataProvider({ update, ...dataProviderOverrides });
        const utils = render(
            <AdminContext dataProvider={dataProvider}>
                <ResourceContextProvider value="payment_track">
                    <RecordContextProvider value={record}>
                        <InlineEditCell source="value" {...props} />
                        <Notification />
                    </RecordContextProvider>
                </ResourceContextProvider>
            </AdminContext>
        );
        return { ...utils, update };
    };

    it('renders a read-only field by default', () => {
        renderCell();
        expect(screen.getByText('hello')).toBeInTheDocument();
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('switches to a real inline text input on click, pre-filled with the current value (no dialog)', () => {
        renderCell();
        fireEvent.click(screen.getByText('hello'));
        expect(screen.getByRole('textbox')).toHaveValue('hello');
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('stops propagation on click (does not trigger a row click handler)', () => {
        const onRowClick = jest.fn();
        render(
            <div onClick={onRowClick}>
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="payment_track">
                        <RecordContextProvider value={record}>
                            <InlineEditCell source="value" />
                        </RecordContextProvider>
                    </ResourceContextProvider>
                </AdminContext>
            </div>
        );
        fireEvent.click(screen.getByText('hello'));
        expect(onRowClick).not.toHaveBeenCalled();
    });

    it('saves when the form submits (a real Enter press submits a lone text field natively)', async () => {
        const { update, container } = renderCell();
        fireEvent.click(screen.getByText('hello'));
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'new value' } });
        fireEvent.submit(container.querySelector('form'));

        await waitFor(() => expect(update).toHaveBeenCalledWith('payment_track', expect.objectContaining({
            id: 1,
            data: { value: 'new value' },
        })));
        await waitFor(() => expect(screen.queryByRole('textbox')).not.toBeInTheDocument());
    });

    it('uses an explicit resource prop over the ambient context when given', async () => {
        const { update, container } = renderCell({ resource: 'text' });
        fireEvent.click(screen.getByText('hello'));
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'new value' } });
        fireEvent.submit(container.querySelector('form'));

        await waitFor(() => expect(update).toHaveBeenCalledWith('text', expect.objectContaining({ id: 1 })));
    });

    it('saves on blur when the value changed', async () => {
        const { update } = renderCell();
        fireEvent.click(screen.getByText('hello'));
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'blurred value' } });
        fireEvent.blur(input);

        await waitFor(() => expect(update).toHaveBeenCalledWith('payment_track', expect.objectContaining({
            id: 1,
            data: { value: 'blurred value' },
        })));
    });

    it('does not save on blur when the value is unchanged, and returns to read-only', () => {
        const { update } = renderCell();
        fireEvent.click(screen.getByText('hello'));
        fireEvent.blur(screen.getByRole('textbox'));

        expect(update).not.toHaveBeenCalled();
        expect(screen.getByText('hello')).toBeInTheDocument();
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('uses a custom transform function for the update payload', async () => {
        const transform = (value, rec) => ({ value, name: rec.name, custom: true });
        const { update, container } = renderCell({ transform });
        fireEvent.click(screen.getByText('hello'));
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'custom' } });
        fireEvent.submit(container.querySelector('form'));

        await waitFor(() => expect(update).toHaveBeenCalledWith('payment_track', expect.objectContaining({
            data: { value: 'custom', name: 'greeting', custom: true },
        })));
    });

    it('shows a validation error and does not save on invalid input', async () => {
        const { update, container } = renderCell({ validate: [required()] });
        fireEvent.click(screen.getByText('hello'));
        fireEvent.change(screen.getByRole('textbox'), { target: { value: '' } });
        fireEvent.submit(container.querySelector('form'));

        await screen.findByText('ra.validation.required');
        expect(update).not.toHaveBeenCalled();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('notifies on successful save', async () => {
        renderCell();
        fireEvent.click(screen.getByText('hello'));
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'new' } });
        fireEvent.blur(input);

        expect(await screen.findByText('ra.notification.updated')).toBeInTheDocument();
    });
});
