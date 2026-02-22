import { usePermissions } from "react-admin";
import get from 'lodash/get';
import { permissionKeys } from '@shared/config/permissionsConfig';

export function hasPermissionLogic(currentUserPermissions, permissionKey) {
    if (!currentUserPermissions) {
        return false;
    }

    return !!get(currentUserPermissions, permissionKey, false);
}

export const useHasPermission = (permissionKey) => {
    const { permissions: currentUserPermissions, isLoading } = usePermissions();
    if (isLoading) {
        return false;
    }
    return hasPermissionLogic(currentUserPermissions, permissionKey);
};

export const isAdmin = (permissions) => hasPermissionLogic(permissions, permissionKeys.admin);
export const useIsAdmin = () => useHasPermission(permissionKeys.admin);

export const isManager = (permissions) => hasPermissionLogic(permissions, permissionKeys.manager);
export const useIsManager = () => useHasPermission(permissionKeys.manager);

export const isShowUsersData = (permissions) => 
    isAdmin(permissions) || hasPermissionLogic(permissions, permissionKeys.showUsersData);
export const useIsShowUsersData = () => useHasPermission(permissionKeys.showUsersData) || useIsAdmin();

export const isEditPagesData = (permissions) => 
    isAdmin(permissions) || hasPermissionLogic(permissions, permissionKeys.editPagesData);
export const useIsEditPagesData = () => useHasPermission(permissionKeys.editPagesData) || useIsAdmin();

export const isEditPaymentTracksData = (permissions) => 
    isAdmin(permissions) || hasPermissionLogic(permissions, permissionKeys.editPaymentTracksData);
export const useIsEditPaymentTracksData = () => useHasPermission(permissionKeys.editPaymentTracksData) || useIsAdmin();

export const isGenericImageUpload = (permissions) => 
    isAdmin(permissions) || hasPermissionLogic(permissions, permissionKeys.genericImageUpload);
export const useIsGenericImageUpload = () => useHasPermission(permissionKeys.genericImageUpload) || useIsAdmin();

export const isUploadedFiles = (permissions) => 
    isAdmin(permissions) || hasPermissionLogic(permissions, permissionKeys.uploadedFiles);
export const useIsUploadedFiles = () => useHasPermission(permissionKeys.uploadedFiles) || useIsAdmin();
