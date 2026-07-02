import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { AdminContext, Notification, RecordContextProvider, ResourceContextProvider, required, testDataProvider } from 'react-admin';
import { InlineEditCell } from '../InlineEditCell';

/**
 * Uses the real Dialog/Form/TextInput/react-hook-form stack (only the
 * dataProvider is faked) - same pattern as InlineEditButton: Enter-to-submit
 * and Escape-to-close come from Form/Dialog themselves, not custom key
 * handling, so there's nothing bespoke here to mock away or get wrong.
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

    it('renders a read-only field by default, with no dialog open', () => {
        renderCell();
        expect(screen.getByText('hello')).toBeInTheDocument();
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('opens a dialog with the field pre-filled on click', async () => {
        renderCell();
        fireEvent.click(screen.getByText('hello'));
        const dialog = await screen.findByRole('dialog');
        expect(within(dialog).getByDisplayValue('hello')).toBeInTheDocument();
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

    it('saves via the Save button, sending the resource context and record id', async () => {
        const { update } = renderCell();
        fireEvent.click(screen.getByText('hello'));
        const dialog = await screen.findByRole('dialog');
        fireEvent.change(within(dialog).getByDisplayValue('hello'), { target: { value: 'new value' } });
        fireEvent.click(within(dialog).getByRole('button', { name: 'ra.action.save' }));

        await waitFor(() => expect(update).toHaveBeenCalledWith('payment_track', expect.objectContaining({
            id: 1,
            data: { value: 'new value' },
        })));
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    });

    it('uses an explicit resource prop over the ambient context when given', async () => {
        const { update } = renderCell({ resource: 'text' });
        fireEvent.click(screen.getByText('hello'));
        const dialog = await screen.findByRole('dialog');
        fireEvent.change(within(dialog).getByDisplayValue('hello'), { target: { value: 'new value' } });
        fireEvent.click(within(dialog).getByRole('button', { name: 'ra.action.save' }));

        await waitFor(() => expect(update).toHaveBeenCalledWith('text', expect.objectContaining({ id: 1 })));
    });

    it('closes without saving on Cancel', async () => {
        const { update } = renderCell();
        fireEvent.click(screen.getByText('hello'));
        const dialog = await screen.findByRole('dialog');
        fireEvent.change(within(dialog).getByDisplayValue('hello'), { target: { value: 'changed' } });
        fireEvent.click(within(dialog).getByRole('button', { name: 'ra.action.cancel' }));

        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
        expect(update).not.toHaveBeenCalled();
        expect(screen.getByText('hello')).toBeInTheDocument();
    });

    it('uses a custom transform function for the update payload', async () => {
        const transform = (value, rec) => ({ value, name: rec.name, custom: true });
        const { update } = renderCell({ transform });
        fireEvent.click(screen.getByText('hello'));
        const dialog = await screen.findByRole('dialog');
        fireEvent.change(within(dialog).getByDisplayValue('hello'), { target: { value: 'custom' } });
        fireEvent.click(within(dialog).getByRole('button', { name: 'ra.action.save' }));

        await waitFor(() => expect(update).toHaveBeenCalledWith('payment_track', expect.objectContaining({
            data: { value: 'custom', name: 'greeting', custom: true },
        })));
    });

    it('shows a validation error and does not save on invalid input', async () => {
        const { update } = renderCell({ validate: [required()] });
        fireEvent.click(screen.getByText('hello'));
        const dialog = await screen.findByRole('dialog');
        fireEvent.change(within(dialog).getByDisplayValue('hello'), { target: { value: '' } });
        fireEvent.click(within(dialog).getByRole('button', { name: 'ra.action.save' }));

        await within(dialog).findByText('ra.validation.required');
        expect(update).not.toHaveBeenCalled();
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('notifies on successful save', async () => {
        renderCell();
        fireEvent.click(screen.getByText('hello'));
        const dialog = await screen.findByRole('dialog');
        fireEvent.change(within(dialog).getByDisplayValue('hello'), { target: { value: 'new' } });
        fireEvent.click(within(dialog).getByRole('button', { name: 'ra.action.save' }));

        expect(await screen.findByText('ra.notification.updated')).toBeInTheDocument();
    });
});
