import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AdminContext, Notification, RecordContextProvider, ResourceContextProvider, required, testDataProvider } from 'react-admin';
import { InlineEditCell } from '../InlineEditCell';

/**
 * Uses the real Form/TextInput/react-hook-form stack (only the dataProvider
 * is faked) - InlineEditCell renders <TextInput> outside of an Edit/Create
 * page, so it needs its own <Form> wrapper to work at all; mocking TextInput
 * away (as the previous version of this test did) would hide that.
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

    it('switches to a real text input on click, pre-filled with the current value', () => {
        renderCell();
        fireEvent.click(screen.getByText('hello'));
        expect(screen.getByRole('textbox')).toHaveValue('hello');
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

    it('saves on Enter, sending the resource context and record id', async () => {
        const { update } = renderCell();
        fireEvent.click(screen.getByText('hello'));
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'new value' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        await waitFor(() => expect(update).toHaveBeenCalledWith('payment_track', expect.objectContaining({
            id: 1,
            data: { value: 'new value' },
        })));
        // InlineEditCell's own job ends at calling update() + refresh(); a real
        // Datagrid re-fetching is what would show the new value. Here we just
        // confirm it closed back to read-only mode.
        await waitFor(() => expect(screen.queryByRole('textbox')).not.toBeInTheDocument());
    });

    it('uses an explicit resource prop over the ambient context when given', async () => {
        const { update } = renderCell({ resource: 'text' });
        fireEvent.click(screen.getByText('hello'));
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'new value' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        await waitFor(() => expect(update).toHaveBeenCalledWith('text', expect.objectContaining({ id: 1 })));
    });

    it('cancels on Escape without saving, reverting to the read-only field', () => {
        const { update } = renderCell();
        fireEvent.click(screen.getByText('hello'));
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'changed' } });
        fireEvent.keyDown(input, { key: 'Escape' });

        expect(update).not.toHaveBeenCalled();
        expect(screen.getByText('hello')).toBeInTheDocument();
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
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

    it('does not save on blur when the value is unchanged', () => {
        const { update } = renderCell();
        fireEvent.click(screen.getByText('hello'));
        fireEvent.blur(screen.getByRole('textbox'));

        expect(update).not.toHaveBeenCalled();
        expect(screen.getByText('hello')).toBeInTheDocument();
    });

    it('uses a custom transform function for the update payload', async () => {
        const transform = (value, rec) => ({ value, name: rec.name, custom: true });
        const { update } = renderCell({ transform });
        fireEvent.click(screen.getByText('hello'));
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'custom' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        await waitFor(() => expect(update).toHaveBeenCalledWith('payment_track', expect.objectContaining({
            data: { value: 'custom', name: 'greeting', custom: true },
        })));
    });

    it('shows a validation error and does not save on invalid input', async () => {
        const { update } = renderCell({ validate: [required()] });
        fireEvent.click(screen.getByText('hello'));
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        await screen.findByText('ra.validation.required');
        expect(update).not.toHaveBeenCalled();
    });

    it('notifies on successful save', async () => {
        const dataProvider = testDataProvider({
            update: (_resource, params) => Promise.resolve({ data: { ...record, ...params.data, id: params.id } }),
        });
        render(
            <AdminContext dataProvider={dataProvider}>
                <ResourceContextProvider value="payment_track">
                    <RecordContextProvider value={record}>
                        <InlineEditCell source="value" />
                        <Notification />
                    </RecordContextProvider>
                </ResourceContextProvider>
            </AdminContext>
        );
        fireEvent.click(screen.getByText('hello'));
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'new' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        expect(await screen.findByText('ra.notification.updated')).toBeInTheDocument();
    });
});
