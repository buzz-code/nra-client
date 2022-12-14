import { Layout } from 'react-admin';
import CustomMenu from './Menu';

const CustomLayout = ({ customMenuItems, ...props }) => {
    const Menu = (props) => (
        <CustomMenu {...props}>
            {customMenuItems}
        </CustomMenu>
    );

    return (
        <Layout {...props} menu={Menu} />
    )
}

export default CustomLayout;