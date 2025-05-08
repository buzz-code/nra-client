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

export const useIseditPaymentTracksData = () => {
    const { permissions } = usePermissions();
    return isEditPaymentTracksData(permissions);
}

export function isEditPaymentTracksData(permissions) {
    return isAdmin(permissions) || !!permissions?.editPaymentTracksData;
}

export const useIsScannerUpload = () => {
    const { permissions } = usePermissions();
    return isScannerUpload(permissions);
}

export function isScannerUpload(permissions) {
    return isAdmin(permissions) || !!permissions?.scannerUpload;
}

export function useIsInLessonReport() {
    const { permissions } = usePermissions();
    return isInLessonReport(permissions);
}

export function isInLessonReport(permissions) {
    return isAdmin(permissions) || !!permissions?.inLessonReport;
}

export function useIsInLessonReportWithLate() {
    const { permissions } = usePermissions();
    return isInLessonReportWithLate(permissions);
}

export function isInLessonReportWithLate(permissions) {
    return isAdmin(permissions) || !!permissions?.inLessonReport?.withLate;
}

export function useIsAbsCountEffect() {
    const { permissions } = usePermissions();
    return isAbsCountEffect(permissions);
}

export function isAbsCountEffect(permissions) {
    return isAdmin(permissions) || !!permissions?.absCountEffect;
}
