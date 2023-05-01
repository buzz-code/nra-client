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
    return isShowUsersData(permissions);
}

export function isShowUsersData(permissions) {
    return isAdmin(permissions) || !!permissions?.showUsersData;
}

export const useIsEditPagesData = () => {
    const { permissions } = usePermissions();
    return isEditPagesData(permissions);
}

export function isEditPagesData(permissions) {
    return isAdmin(permissions) || !!permissions?.editPagesData;
}
