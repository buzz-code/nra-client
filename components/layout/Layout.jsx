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

// showYearSelector: false for apps whose data isn't scoped by school year.
const CustomLayout = ({ customMenuItems, menuGroups, showYearSelector = true, children }) => {
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

    const AppBar = (props) => <CustomAppBar {...props} showYearSelector={showYearSelector} />;

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