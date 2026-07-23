# nra-client

Shared **client-side** library (React-Admin + JSX) consumed by every NRA project as the `client/shared` git submodule.

## This repo is shared — edit with care

`react-admin-nestjs`, `event-management-nra`, `teacher-report-nra`, `student-report-nra`, and `dnd-management-nra` all pin this repo as a submodule. A change here reaches every app the next time it bumps its pointer. Prefer additive, backward-compatible changes. When a change needs each consuming app to do something (wire in a new component, replace an inline pattern, guard a menu item with a new permission), it is **not** automatic — record it (see below).

Full rollout process: the `shared-changes-workflow` and `bump-shared-ref` skills in `multi-repo-codespace/.github/skills/`.

## CONSUMER_CHANGES.md convention

`CONSUMER_CHANGES.md` at the repo root is the handshake between a shared change and the apps that must adapt to it. Maintain it by these rules:

- **Add a row only when a consumer must act.** Purely additive changes that work automatically after a pointer bump get no row.
- **When you author such a change, add the row in the same PR.** Columns: `Commit` (short hash, or `(docs)` for policy-only), `Adds`, `Per-app action` (the exact edit), `Done in` (apps already wired — often none yet).
- **When you wire an app, append it to that row's `Done in`** and commit.
- **A raw camelCase field, missing component, or runtime break after a bump with no matching row = a missing row.** Add it.

## Key shared subsystems

- `components/` — shared CRUD containers (`CommonList`/`CommonEdit`/`CommonCreate`/`CommonEntity`), fields, layout (`CollapsibleSection`), settings inputs, phone resources.
- `providers/` — dataProvider, authProvider, i18n, theme, constants.
- `utils/` — permissions (`permissionsUtil`), filters, entity/year helpers.

## Tests

`yarn test` (Jest + jsdom). Mock `react-admin` and `@shared/*` imports with `jest.mock`; assert on wiring, not fetched data — no live backend. See the `write-tests` skill.
