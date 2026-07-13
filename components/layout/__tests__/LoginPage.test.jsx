import React from 'react';
import { render, screen } from '@testing-library/react';
import { AdminContext, TestMemoryRouter, testDataProvider } from 'react-admin';
import { LoginPage } from '../LoginPage';

/**
 * LoginPage is rendered by react-admin as the `requireAuth` fallback for any
 * unauthenticated route. At "/" specifically, it should show the public
 * HomePage (marketing content) instead of the login form, so anonymous
 * visitors to the root URL get SEO-friendly content rather than a login wall.
 * Every other path (e.g. "/login") must keep showing the login form.
 */
describe('LoginPage', () => {
    const authProvider = {
        checkAuth: () => Promise.reject(),
        checkError: () => Promise.resolve(),
    };

    const homeContent = {
        appTitle: 'בדיקה',
        tagline: 'תיאור לבדיקה',
    };

    const renderAt = (path, props) =>
        render(
            <TestMemoryRouter initialEntries={[path]}>
                <AdminContext dataProvider={testDataProvider()} authProvider={authProvider}>
                    <LoginPage {...props} />
                </AdminContext>
            </TestMemoryRouter>
        );

    it('shows the HomePage at "/" when homeContent is provided', () => {
        renderAt('/', { homeContent });
        expect(screen.getByText('בדיקה')).toBeInTheDocument();
        expect(screen.queryByLabelText(/User Name|שם משתמש/i)).not.toBeInTheDocument();
    });

    it('shows the login form at "/login" even when homeContent is provided', () => {
        renderAt('/login', { homeContent });
        expect(screen.queryByText('בדיקה')).not.toBeInTheDocument();
    });

    it('falls back to the login form at "/" when homeContent is omitted', () => {
        renderAt('/', {});
        expect(screen.queryByText('בדיקה')).not.toBeInTheDocument();
    });
});
