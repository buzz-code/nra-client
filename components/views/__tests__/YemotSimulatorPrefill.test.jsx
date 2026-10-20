import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdminContext, TestMemoryRouter, testDataProvider } from 'react-admin';
import YemotSimulator from '../YemotSimulator';

/**
 * Regression test for the "system number" (ApiDID) prefill.
 *
 * The server looks up which user's flow to run by matching ApiDID (the
 * system/DID number) against the logged-in user's own phoneNumber — not
 * ApiPhone (the simulated caller's number). A non-admin user's own phone
 * number must therefore prefill ApiDID, otherwise they have to type it in
 * manually on every call.
 *
 * ApiDID is shown read-only (the system number is fixed); ApiPhone (the
 * caller) is prefilled with the same number but stays editable.
 */
describe('YemotSimulator setup prefill', () => {
    const authProvider = {
        checkAuth: () => Promise.resolve(),
        getIdentity: () => Promise.resolve({ id: 1, phoneNumber: '0501234567' }),
        getPermissions: () => Promise.resolve({}), // non-admin
        checkError: () => Promise.resolve(),
    };

    it('prefills a fixed system number and an editable caller number', async () => {
        const dataProvider = testDataProvider();
        render(
            <TestMemoryRouter initialEntries={['/yemot-simulator']}>
                <AdminContext dataProvider={dataProvider} authProvider={authProvider}>
                    <YemotSimulator />
                </AdminContext>
            </TestMemoryRouter>
        );

        const systemNumberInput = await screen.findByLabelText('מספר מערכת');
        await waitFor(() => expect(systemNumberInput).toHaveValue('0501234567'));
        expect(systemNumberInput).toHaveAttribute('readonly');

        const callerInput = await screen.findByLabelText('מספר מתקשר');
        await waitFor(() => expect(callerInput).toHaveValue('0501234567'));
        expect(callerInput).not.toHaveAttribute('readonly');

        await userEvent.clear(callerInput);
        await userEvent.type(callerInput, '0539998888');
        expect(callerInput).toHaveValue('0539998888');
        expect(systemNumberInput).toHaveValue('0501234567');
    });
});
