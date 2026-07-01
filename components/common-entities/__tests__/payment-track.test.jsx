import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { AdminContext, TestMemoryRouter, testDataProvider } from 'react-admin';
import paymentTrack from '../payment-track';

/**
 * A real end-to-end exercise of the getResourceComponents({ inlineEdit: true })
 * wiring: the actual List, CommonDatagrid, InlineEditButton and Inputs
 * components, against a fake dataProvider (no mocks of our own code).
 */
describe('payment-track inline edit', () => {
    const record = {
        id: 1,
        name: 'Basic',
        description: 'Basic plan',
        monthlyPrice: 10,
        annualPrice: 100,
        studentNumberLimit: 50,
    };

    const authProvider = {
        checkAuth: () => Promise.resolve(),
        getPermissions: () => Promise.resolve({}),
        checkError: () => Promise.resolve(),
    };

    const renderList = (dataProvider) => render(
        <TestMemoryRouter initialEntries={['/payment_track']}>
            <AdminContext dataProvider={dataProvider} authProvider={authProvider}>
                <paymentTrack.list />
            </AdminContext>
        </TestMemoryRouter>
    );

    it('renders the list from the dataProvider', async () => {
        const dataProvider = testDataProvider({
            getList: () => Promise.resolve({ data: [record], total: 1 }),
        });
        renderList(dataProvider);

        expect(await screen.findByText('Basic')).toBeInTheDocument();
        expect(screen.getByText('Basic plan')).toBeInTheDocument();
    });

    it('reuses the entity Inputs inside the inline edit dialog, pre-filled with the row record', async () => {
        const dataProvider = testDataProvider({
            getList: () => Promise.resolve({ data: [record], total: 1 }),
        });
        renderList(dataProvider);
        await screen.findByText('Basic');

        fireEvent.click(screen.getByRole('button', { name: 'עריכה' }));
        const dialog = await screen.findByRole('dialog');

        // These are the exact same <TextInput>/<NumberInput> elements the full
        // Edit page uses (payment-track.jsx's Inputs component) - no separate
        // inline-only field definitions.
        expect(within(dialog).getByDisplayValue('Basic plan')).toBeInTheDocument();
        expect(within(dialog).getByDisplayValue('10')).toBeInTheDocument();
    });

    it('saves edits made in the inline dialog via the dataProvider, without navigating away from the list', async () => {
        const update = jest.fn((_resource, params) => Promise.resolve({ data: { ...record, ...params.data, id: params.id } }));
        const dataProvider = testDataProvider({
            getList: () => Promise.resolve({ data: [record], total: 1 }),
            update,
        });
        renderList(dataProvider);
        await screen.findByText('Basic');

        fireEvent.click(screen.getByRole('button', { name: 'עריכה' }));
        const dialog = await screen.findByRole('dialog');

        const descriptionInput = within(dialog).getByDisplayValue('Basic plan');
        fireEvent.change(descriptionInput, { target: { value: 'Updated plan' } });
        fireEvent.click(within(dialog).getByRole('button', { name: /^(Save|שמירה)$/i }));

        await waitFor(() => expect(update).toHaveBeenCalledWith('payment_track', expect.objectContaining({
            id: 1,
            data: expect.objectContaining({ description: 'Updated plan' }),
        })));

        // The dialog closes and we're still on the list (no navigation to /payment_track/1).
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
        expect(screen.getByText('Basic')).toBeInTheDocument();
    });
});
