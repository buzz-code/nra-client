import { useMemo } from 'react';
import { Admin, CustomRoutes } from 'react-admin';
import { BrowserRouter, Route } from 'react-router-dom';
import RTLStyle from '@shared/components/layout/RTLStyle';
import dataProvider from '@shared/providers/dataProvider';
import { getI18nProvider } from '@shared/providers/i18nProvider';
import authProvider from '@shared/providers/authProvider';
import { createTheme } from '@shared/providers/themeProvider';
import { LoginPage } from '@shared/components/layout/LoginPage';
import { HomePage } from '@shared/components/layout/HomePage';

/**
 * Shared shell wrapping every NRA client app.
 *
 * Props:
 *  - title          {string}   Browser / app title
 *  - themeOptions   {object}   { primary, secondary } colour config (isRtl always true)
 *                              Define at module level so the reference is stable.
 *  - domainTranslations {object} Project-specific translation object
 *  - dashboard      {Component}
 *  - layout         {Component}
 *  - homeContent    {object}   Optional public landing-page content (appTitle, tagline,
 *                              description, features, ctaLabel) shown at "/" for anonymous
 *                              visitors instead of redirecting them to the login form.
 *                              Omit to keep the previous behaviour (redirect to /login).
 *                              Registered as a public route only while `permissions` is
 *                              falsy (anonymous) - react-admin resolves `permissions` before
 *                              deciding routes, so once a user is authenticated this route
 *                              is never registered and "/" keeps rendering `dashboard`
 *                              exactly as before; no existing route or behaviour changes.
 *                              Define at module level so the reference is stable, like
 *                              themeOptions.
 *  - children       {function} permissions => JSX  (React-Admin children-as-function)
 */
const AdminAppShell = ({ title, themeOptions, domainTranslations, dashboard, layout, homeContent, children }) => {
    const theme = useMemo(() => createTheme({ ...themeOptions, isRtl: true }), [themeOptions]);
    const i18nProvider = useMemo(() => getI18nProvider(domainTranslations), [domainTranslations]);

    return (
        <BrowserRouter>
            <RTLStyle>
                <Admin
                    dataProvider={dataProvider}
                    i18nProvider={i18nProvider}
                    authProvider={authProvider}
                    theme={theme}
                    title={title}
                    dashboard={dashboard}
                    layout={layout}
                    loginPage={LoginPage}
                    requireAuth
                >
                    {(permissions) => (
                        <>
                            {homeContent && !permissions && (
                                <CustomRoutes noLayout>
                                    <Route path="/" element={<HomePage {...homeContent} />} />
                                </CustomRoutes>
                            )}
                            {children(permissions)}
                        </>
                    )}
                </Admin>
            </RTLStyle>
        </BrowserRouter>
    );
};

export default AdminAppShell;
