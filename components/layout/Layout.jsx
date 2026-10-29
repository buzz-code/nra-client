import { Layout, useGetIdentity, usePermissions } from 'react-admin';
import { createContext, useContext, useEffect } from 'react';
import CustomMenu from '@shared/components/layout/Menu';
import CustomAppBar from './CustomAppBar';
import DirectionalThemeProvider from './DirectionalThemeProvider';
import { useIsAdmin } from '@shared/utils/permissionsUtil';
import { filterArrayByParams } from '@shared/utils/filtersUtil';
import { TrialMessage } from './TrialMessage';
import { YemotMigrationBanner } from './YemotMigrationBanner';
import { setRumUser } from '@shared/utils/openobserveRumUtil';

// Passed through context so the app bar component stays the same between renders;
// a component created during render remounts the app bar and closes its user menu.
const AppBarContentContext = createContext(undefined);
const AppBar = (props) => <CustomAppBar {...props} content={useContext(AppBarContentContext)} />;

// appBarContent: replaces the app bar's year picker (null hides it, for apps whose data
// isn't scoped by school year).
const CustomLayout = ({ customMenuItems, menuGroups, appBarContent, children }) => {
    const isAdmin = useIsAdmin();
    const { permissions } = usePermissions();
    const { data: identity } = useGetIdentity();
    const customMenuItemsArr = filterArrayByParams(customMenuItems, { isAdmin, permissions });
    const menuItemsArr = filterArrayByParams(menuGroups, { isAdmin, permissions });

    useEffect(() => {
        if (identity) {
            setRumUser(identity);
        }
    }, [identity]);

    const Menu = () => (
        <CustomMenu menuGroups={menuItemsArr}>
            {customMenuItemsArr}
        </CustomMenu>
    );

    return (
        <DirectionalThemeProvider>
            <AppBarContentContext.Provider value={appBarContent}>
                <Layout menu={Menu} appBar={AppBar} appBarAlwaysOn>
                    <TrialMessage />
                    <YemotMigrationBanner />

                    {children}
                </Layout>
            </AppBarContentContext.Provider>
        </DirectionalThemeProvider>
    )
}

export default CustomLayout;