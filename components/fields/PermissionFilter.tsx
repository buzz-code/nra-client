import React from "react";
import { DateInput } from "react-admin";
import { isAdmin } from "@shared/utils/permissionsUtil";
import { CommonReferenceInputFilter } from "./CommonReferenceInputFilter";

type PermissionFunc = (permissions: any) => boolean;
type Children = React.ReactNode;

export const permissionFilter = (permissionFunc: PermissionFunc, children: Children) => ({ permissions }) => {
  const hasPermission = permissionFunc(permissions);
  return hasPermission ? children : null;
}

export const notPermissionFilter = (permissionFunc: PermissionFunc, children: Children) => {
  const newPermissionFunc = (permissions) => !permissionFunc(permissions);
  return permissionFilter(newPermissionFunc, children);
}

export const adminFilter = (children) => {
  return permissionFilter(isAdmin, children);
}

export const adminUserFilter = adminFilter(<CommonReferenceInputFilter source="userId" reference="user" alwaysOn />);
export const adminCreatedAtFilters = [
  adminFilter(<DateInput source="createdAt:$gte" />),
  adminFilter(<DateInput source="createdAt:$lte" />),
];
export const adminUpdatedAtFilters = [
  adminFilter(<DateInput source="updatedAt:$gte" />),
  adminFilter(<DateInput source="updatedAt:$lte" />),
];
export const commonAdminFilters = [
  adminUserFilter,
  ...adminCreatedAtFilters,
  ...adminUpdatedAtFilters,
];
