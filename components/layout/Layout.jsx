import { Layout } from 'react-admin';
import CustomMenu from '@shared/components/layout/Menu';
import { useIsAdmin } from '@shared/utils/permissionsUtil';

const CustomLayout = ({ customMenuItems, menuGroups, ...props }) => {
    const isAdmin = useIsAdmin();
    const customMenuItemsArr = customMenuItems
        .map(item => typeof item === 'function' ? item({ isAdmin }) : item)
        .filter(item => item);

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