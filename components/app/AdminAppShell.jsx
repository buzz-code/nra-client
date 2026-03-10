import { useMemo } from 'react';
import { Admin } from 'react-admin';
import { BrowserRouter } from 'react-router-dom';
import RTLStyle from '@shared/components/layout/RTLStyle';
import dataProvider from '@shared/providers/dataProvider';
import { getI18nProvider } from '@shared/providers/i18nProvider';
import authProvider from '@shared/providers/authProvider';
import { createTheme } from '@shared/providers/themeProvider';
import { LoginPage } from '@shared/components/layout/LoginPage';

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
 *  - children       {function} permissions => JSX  (React-Admin children-as-function)
 */
const AdminAppShell = ({ title, themeOptions, domainTranslations, dashboard, layout, children }) => {
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
                    {children}
                </Admin>
            </RTLStyle>
        </BrowserRouter>
    );
};

export default AdminAppShell;
