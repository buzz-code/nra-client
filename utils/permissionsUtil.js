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
