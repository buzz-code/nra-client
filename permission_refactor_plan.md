# Permission System Refactor Plan

This document outlines the plan to refactor the permission system for the Event Management NRA application, based on recent clarifications.

**Goals:**
- Centralize permission key definitions.
- Implement generic permission checking logic.
- Simplify app-specific permission handling.
- Focus on `admin`, `manager`, and `teacher` permissions for this application's core.

## Phase 1: Setup Core Permission Definitions & Services

### 4. Create `client/src/utils/appPermissions.js`
   - **Purpose:** Define checkers for app-specific permissions (currently `teacher`) using the new service.
   - **Content:**
     ```javascript
     // client/src/utils/appPermissions.js
     import { PERMISSION_KEYS } from '@shared/config/permissionsConfig';
     import { useHasPermission, hasPermissionLogic } from '@shared/services/permissionsService';

     export const isTeacher = (permissions) => hasPermissionLogic(permissions, PERMISSION_KEYS.TEACHER);
     export const useIsTeacher = () => useHasPermission(PERMISSION_KEYS.TEACHER);
     ```

## Phase 2: Update UI (`user.jsx`)

### 1. Modify `client/shared/components/common-entities/user.jsx`
   - **Purpose:** Update the `Inputs` component to reflect the new permission structure.
   - **Conceptual Changes:**
     - Remove dynamic mapping of all old domain permissions.
     - Explicitly include `BooleanInput` components for `ADMIN`, `MANAGER`, `TEACHER` if they are to be managed via this UI.
     - Labels for these inputs can be hardcoded or derived simply.
     - Consider retaining `CommonJsonInput source="permissions"` for admins to view/edit raw permission flags if necessary.
   - **Example Snippet (Conceptual):**
     ```diff
     // client/shared/components/common-entities/user.jsx
     // ...
     import { PERMISSION_KEYS } from '@shared/config/permissionsConfig';
     import { useIsAdmin as useIsEditorAdminHook } from '@shared/services/permissionsService'; // Or from permissionsUtil.js
     // ...

     const Inputs = ({ isCreate }) => {
         const isEditorAdmin = useIsEditorAdminHook();

         return <>
             {/* ... other inputs ... */}
             {isEditorAdmin && (
                 <div style={{ marginTop: '1em', border: '1px solid #eee', padding: '1em' }}>
                     <h4>Permissions</h4>
                     <BooleanInput key={PERMISSION_KEYS.ADMIN} source={`permissions.${PERMISSION_KEYS.ADMIN}`} label="Administrator" />
                     <BooleanInput key={PERMISSION_KEYS.MANAGER} source={`permissions.${PERMISSION_KEYS.MANAGER}`} label="Manager" />
                     <BooleanInput key={PERMISSION_KEYS.TEACHER} source={`permissions.${PERMISSION_KEYS.TEACHER}`} label="Teacher" />
                     {/* <CommonJsonInput source="permissions" /> */} {/* Optional: for raw access */}
                 </div>
             )}
             {/* ... other inputs ... */}
         </>
     }
     // ...
     ```

## Phase 3: Refactor Call Sites & Cleanup

1.  **Identify and Refactor Call Sites:**
    - Search for usages of old permission checking functions from `permissionsUtil.js` (old version) and `permissionsDomainUtil.js`.
    - Update them to use:
        - `isAdmin`, `isManager` from the new `permissionsUtil.js`.
        - `isTeacher` from `appPermissions.js`.
        - `hasPermissionLogic(permissions, 'rawKey')` or `useHasPermission('rawKey')` for any other miscellaneous permission checks that might still be temporarily needed for compatibility with other apps/data.
2.  **Deprecate/Remove `client/shared/utils/permissionsDomainUtil.js`:**
    - Once its `teacher` logic is moved and other usages are refactored or deemed obsolete for this app, this file can be removed.

This plan will be executed by switching to "Code" mode for JavaScript file modifications.