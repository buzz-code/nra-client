import { useMemo } from 'react';
import { Menu, useResourceDefinitions } from 'react-admin';
import SubMenu from './SubMenu';

const CustomMenu = ({ hasDashboard, menuGroups, children }) => {
    const resources = useResourceDefinitions();

    const [menuGroupsArr, otherResources] = useMemo(() => {
        const groupsDict = Object.fromEntries(menuGroups.map(item => (
            [item.name, { ...item, resources: [] }]
        )));
        const otherResources = [];

        for (const resource of Object.values(resources)) {
            const arr = groupsDict[resource.options?.menuGroup].resources ?? otherResources;
            arr.push(resource.name);
        }

        for (const group of Object.values(groupsDict)) {
            group.children = [...group.routes ?? []];
            group.children.splice(0, 0, ...group.resources.map(name => (
                <Menu.ResourceItem key={name} name={name} />
            )));
        }

        return [
            Object.values(groupsDict),
            otherResources,
        ];
    }, [resources, menuGroups]);

    return (
        <Menu>
            {hasDashboard && (
                <Menu.DashboardItem key="default-dashboard-menu-item" />
            )}
            {menuGroupsArr.map(group =>
                group.children.length > 0 && (
                    <SubMenu key={group.name} primaryText={group.label} leftIcon={group.icon}>
                        {group.children}
                    </SubMenu>
                )
            )}
            {otherResources}
            {children}
        </Menu>
    );
};

export default CustomMenu;