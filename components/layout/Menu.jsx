import { Menu, useResourceDefinitions } from 'react-admin';

const CustomMenu = ({ hasDashboard, children }) => {
    const resources = useResourceDefinitions();

    return (
        <Menu>
            {hasDashboard && (
                <Menu.DashboardItem key="default-dashboard-menu-item" />
            )}
            {Object.keys(resources).map(name => (
                <Menu.ResourceItem key={name} name={name} />
            ))}
            {children}
        </Menu>
    );
};

export default CustomMenu;