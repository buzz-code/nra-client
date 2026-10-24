import { Layout, useGetIdentity, usePermissions } from 'react-admin';
import { useEffect } from 'react';
import CustomMenu from '@shared/components/layout/Menu';
import CustomAppBar from './CustomAppBar';
import DirectionalThemeProvider from './DirectionalThemeProvider';
import { useIsAdmin } from '@shared/utils/permissionsUtil';
import { filterArrayByParams } from '@shared/utils/filtersUtil';
import { TrialMessage } from './TrialMessage';
import { YemotMigrationBanner } from './YemotMigrationBanner';
import { setRumUser } from '@shared/utils/openobserveRumUtil';

// appBarContent: replaces the app bar's year picker (null hides it, for apps whose data
// isn't scoped by school year). customMenuItemsPosition: 'end' (default) lists the custom
// items after the menu groups, 'start' right after the dashboard item.
const CustomLayout = ({ customMenuItems, menuGroups, appBarContent, customMenuItemsPosition = 'end', children }) => {
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
        <CustomMenu menuGroups={menuItemsArr} childrenPosition={customMenuItemsPosition}>
            {customMenuItemsArr}
        </CustomMenu>
    );

    const AppBar = (props) => <CustomAppBar {...props} content={appBarContent} />;

    return (
        <DirectionalThemeProvider>
            <Layout menu={Menu} appBar={AppBar} appBarAlwaysOn>
                <TrialMessage />
                <YemotMigrationBanner />

                {children}
            </Layout>
        </DirectionalThemeProvider>
    )
}

export default CustomLayout;