import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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
 * ApiPhone (hidden, but a required field) must also still end up populated
 * once identity resolves, otherwise the form can't be submitted.
 */
describe('YemotSimulator setup prefill', () => {
    const authProvider = {
        checkAuth: () => Promise.resolve(),
        getIdentity: () => Promise.resolve({ id: 1, phoneNumber: '0501234567' }),
        getPermissions: () => Promise.resolve({}), // non-admin
        checkError: () => Promise.resolve(),
    };

    it('prefills the system number (ApiDID) field with the user\'s own phone number', async () => {
        const dataProvider = testDataProvider();
        const { container } = render(
            <TestMemoryRouter initialEntries={['/yemot-simulator']}>
                <AdminContext dataProvider={dataProvider} authProvider={authProvider}>
                    <YemotSimulator />
                </AdminContext>
            </TestMemoryRouter>
        );

        const systemNumberInput = await screen.findByLabelText('מספר מערכת');
        await waitFor(() => expect(systemNumberInput).toHaveValue('0501234567'));

        const apiPhoneInput = container.querySelector('input[name="ApiPhone"]');
        await waitFor(() => expect(apiPhoneInput).toHaveValue('0501234567'));
    });
});
