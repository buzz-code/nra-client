import React from "react";
import { usePermissions } from "react-admin";
import { isAdmin } from "@shared/utils/permissionsUtil";

export const PermissionFilter = ({ permissionFunc, children }) => {
  const permissions = usePermissions();
  const hasPermission = permissionFunc(permissions);
  return hasPermission ? children : null;
}

export const AdminFilter = ({ children }) => {
  return (
    <PermissionFilter permissionFunc={isAdmin}>
      {children}
    </PermissionFilter>
  );
}
