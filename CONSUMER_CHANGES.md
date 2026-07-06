# Consumer Changes

This repo (`client/shared` in every NRA app) is consumed as a git submodule by
`react-admin-nestjs`, `student-report-nra`, `event-management-nra`,
`dnd-management-nra`, and `teacher-report-nra`. Most commits here are safe to
pick up by just bumping the submodule pointer. Some are not — they add an
opt-in permission, component, or provider method that only takes effect once
each consuming app wires it in on its own side (e.g. in `GeneralLayout.jsx` or
`Settings.jsx`).

This file tracks those commits so nobody bumps the pointer and assumes the
feature is live everywhere. When you land a commit here that needs a matching
per-app change, add an entry. When an app applies its side, update its row.

## yemotSimulator permission (54dade9)

The `/yemot-simulator` route and its menu item were admin-only. Added a
`yemotSimulator` permission key (`config/permissionsConfig.js`) and
`isYemotSimulator`/`useIsYemotSimulator` helpers (`utils/permissionsUtil.js`)
so non-admins can be granted access without full admin rights. `CommonRoutes.jsx`
now gates the route itself on this permission.

**Required per-app action:** in `client/src/GeneralLayout.jsx`, change the
`yemot-simulator` menu item's guard from the bare `isAdmin` flag to
`isYemotSimulator(permissions)` (imported from `@shared/utils/permissionsUtil`).

| App | Status |
|---|---|
| dnd-management-nra | Done (merged to `main`) |
| react-admin-nestjs | Pending (change exists on `claude/yemot-simulator-permission-rq68z0`, not yet merged) |
| student-report-nra | Pending (same branch, not yet merged) |
| event-management-nra | Pending (same branch, not yet merged) |
| teacher-report-nra | Pending (same branch, not yet merged) |

## PhoneSettingsInput / updateProfile (897ec6b)

Added `components/phone/PhoneSettingsInput.jsx` (mirrors `YemotSettingsInput`)
and `dataProvider.updateProfile`, which persists the top-level `phoneNumber`
user column via the new server-side `PATCH /profile` endpoint — separate from
`updateSettings`, which only merges into `additionalData`.

**Required per-app action:** wire `PhoneSettingsInput` into
`client/src/settings/Settings.jsx` (import from `@shared/components/phone/PhoneSettingsInput`),
seed `phoneNumber` from `identity`, and call `dataProvider.updateProfile` in
`handleSave` alongside `updateSettings`. See `react-admin-nestjs`'s
`2fca7e5` for the exact pattern.

| App | Status |
|---|---|
| react-admin-nestjs | Done (`2fca7e5`) |
| student-report-nra | Pending |
| event-management-nra | Pending |
| dnd-management-nra | Pending |
| teacher-report-nra | Pending |
