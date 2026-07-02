import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdminContext, TestMemoryRouter, testDataProvider } from 'react-admin';
import YemotSimulator from '../YemotSimulator';

/**
 * Regression test for the admin "מאת משתמש" (from user) selector.
 *
 * Selecting a user must prefill ApiDID (the system/DID number, matched
 * server-side against User.phoneNumber). ApiPhone is a required hidden
 * field that PhonePrefill never sets for admins, so it must also be
 * prefilled here (mirroring PhonePrefill's own behavior for non-admins,
 * which sets both ApiDID and ApiPhone to the same number) - otherwise
 * the form can never pass validation for admins using this selector.
 * The reference input's filter must also use an operator crud-request
 * accepts without a value (`$notnull`), since `$ne` with an empty string
 * value is silently dropped from the query string and the API returns
 * 400 "Invalid filter value".
 */
describe('YemotSimulator admin user selector', () => {
    const authProvider = {
        checkAuth: () => Promise.resolve(),
        getIdentity: () => Promise.resolve({ id: 1 }),
        getPermissions: () => Promise.resolve({ admin: true }),
        checkError: () => Promise.resolve(),
    };

    const user = { id: 7, name: 'Test User', phoneNumber: '0521112222' };

    it('prefills ApiDID and ApiPhone with the selected user\'s phone number', async () => {
        const dataProvider = testDataProvider({
            getList: () => Promise.resolve({ data: [user], total: 1 }),
            getOne: () => Promise.resolve({ data: user }),
        });
        const { container } = render(
            <TestMemoryRouter initialEntries={['/yemot-simulator']}>
                <AdminContext dataProvider={dataProvider} authProvider={authProvider}>
                    <YemotSimulator />
                </AdminContext>
            </TestMemoryRouter>
        );

        const selector = await screen.findByLabelText('מאת משתמש');
        await userEvent.type(selector, 'Test');
        const option = await screen.findByText('Test User');
        await userEvent.click(option);

        const apiDidInput = await screen.findByLabelText('מספר מערכת');
        await waitFor(() => expect(apiDidInput).toHaveValue('0521112222'));

        const apiPhoneInput = container.querySelector('input[name="ApiPhone"]');
        await waitFor(() => expect(apiPhoneInput).toHaveValue('0521112222'));
    });
});
