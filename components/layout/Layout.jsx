import { Layout } from 'react-admin';
import CustomMenu from '@shared/components/layout/Menu';
import { useIsAdmin } from '@shared/utils/permissionsUtil';
import { filterArrayByParams } from '@shared/utils/filtersUtil';

const CustomLayout = ({ customMenuItems, menuGroups, ...props }) => {
    const isAdmin = useIsAdmin();
    const customMenuItemsArr = filterArrayByParams(customMenuItems, { isAdmin });

    const Menu = (props) => (
        <CustomMenu {...props} menuGroups={menuGroups}>
            {customMenuItemsArr}
        </CustomMenu>
    );

    return (
        <Layout {...props} menu={Menu} />
    )
}

export default CustomLayout;