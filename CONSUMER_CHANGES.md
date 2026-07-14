# Consumer Changes

Commits in this repo that don't work automatically after a `client/shared`
submodule bump — each needs a matching change in the consuming app.

| Commit | Adds | Per-app action | Done in |
|---|---|---|---|
| `54dade9` | `yemotSimulator` permission | Guard the yemot-simulator menu item with `isYemotSimulator(permissions)` instead of `isAdmin` | dnd-management-nra, react-admin-nestjs |
| `897ec6b` | `PhoneSettingsInput` + `dataProvider.updateProfile` | Wire `PhoneSettingsInput` into `Settings.jsx`, call `updateProfile` in `handleSave` | react-admin-nestjs |
| `19336e2` | `CommonPhoneResources` shared component | Replace any inline `phone_template`/`phone_campaign` `<Resource>` JSX with `{CommonPhoneResources({ permissions })}` | react-admin-nestjs, event-management-nra, teacher-report-nra, student-report-nra, dnd-management-nra |
| `ed810e0` | Dashboard/Menu/SubMenu icons switched from Material's Filled to Outlined variant | Optional but recommended: swap each app's own per-resource `<Resource icon={...}>` and menu-group icon imports in `App.jsx`/`GeneralLayout.jsx` from `@mui/icons-material/X` to `@mui/icons-material/XOutlined` too, so the whole sidebar uses one consistent icon weight instead of mixing Filled and Outlined | react-admin-nestjs |
