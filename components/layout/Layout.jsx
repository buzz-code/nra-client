import { Layout, usePermissions } from 'react-admin';
import CustomMenu from '@shared/components/layout/Menu';
import { useIsAdmin } from '@shared/utils/permissionsUtil';
import { filterArrayByParams } from '@shared/utils/filtersUtil';
import { TrialMessage } from './TrialMessage';

const CustomLayout = ({ customMenuItems, menuGroups, children }) => {
    const isAdmin = useIsAdmin();
    const { permissions } = usePermissions();
    const customMenuItemsArr = filterArrayByParams(customMenuItems, { isAdmin, permissions });

    const Menu = () => (
        <CustomMenu menuGroups={menuGroups}>
            {customMenuItemsArr}
        </CustomMenu>
    );

    return (
        <Layout menu={Menu}>
            <TrialMessage />

            {children}
        </Layout>
    )
}

export default CustomLayout;