import { usePermissions } from "react-admin";

export const useIsAdmin = () => {
    const { permissions } = usePermissions();
    return isAdmin(permissions);
}

export function isAdmin(permissions) {
    return !!permissions?.admin;
}

export const useIsShowUsersData = () => {
    const { permissions } = usePermissions();
    return isAccessToUsersData(permissions);
}

export function isShowUsersData(permissions) {
    return isAdmin(permissions) || !!permissions?.showUsersData;
}
