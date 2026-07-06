# Consumer Changes

Commits in this repo that don't work automatically after a `client/shared`
submodule bump — each needs a matching change in the consuming app.

| Commit | Adds | Per-app action | Done in |
|---|---|---|---|
| `54dade9` | `yemotSimulator` permission | Guard the yemot-simulator menu item with `isYemotSimulator(permissions)` instead of `isAdmin` | dnd-management-nra |
| `897ec6b` | `PhoneSettingsInput` + `dataProvider.updateProfile` | Wire `PhoneSettingsInput` into `Settings.jsx`, call `updateProfile` in `handleSave` | react-admin-nestjs |
