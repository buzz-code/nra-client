// These jest.mock() calls are hoisted to the top of THIS file by Babel.
// Because entities.test.js imports createResourceTests before importing App,
// these mocks are registered before App.jsx (and its provider imports) load.
//
// The mock record below is deliberately "kitchen sink": it fills in a broad
// set of common field names (id/name/tz/phone/email/dates/booleans/...) with
// plausible values instead of returning {}. A List/Create/Edit component that
// crashes only when a real field is present (e.g. `record.someField.nested`)
// stays invisible against an always-empty mock — this gives it something to
// actually touch. It's generic on purpose (no per-entity field knowledge) so
// it doesn't need updating as entities change.
jest.mock('@shared/providers/dataProvider', () => {
  const mockRow = {
    id: 1,
    name: 'שם לדוגמה',
    key: 'MOCK',
    title: 'שם לדוגמה',
    label: 'שם לדוגמה',
    description: 'תיאור לדוגמה',
    tz: '123456789',
    phone: '0500000000',
    email: 'mock@example.com',
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    active: true,
    isActive: true,
    status: 'active',
    amount: 1,
    price: 1,
    count: 1,
    year: new Date().getFullYear(),
  };
  const mockRows = [mockRow, { ...mockRow, id: 2, name: 'שם לדוגמה 2' }];

  return {
    getList: () => Promise.resolve({ data: mockRows, total: mockRows.length }),
    getOne: () => Promise.resolve({ data: mockRow }),
    getMany: () => Promise.resolve({ data: mockRows }),
    getManyReference: () => Promise.resolve({ data: mockRows, total: mockRows.length }),
    create: () => Promise.resolve({ data: mockRow }),
    update: () => Promise.resolve({ data: mockRow }),
    updateMany: () => Promise.resolve({ data: [mockRow.id] }),
    delete: () => Promise.resolve({ data: mockRow }),
    deleteMany: () => Promise.resolve({ data: [mockRow.id] }),
  };
});

jest.mock('@shared/providers/authProvider', () => ({
  checkAuth: () => Promise.resolve(),
  // Return { admin: true } so permissionsUtil.isAdmin() returns true,
  // which gates the admin view and shows all resources in the sidebar.
  getPermissions: () => Promise.resolve({ admin: true }),
  getIdentity: () => Promise.resolve({ id: 1, fullName: 'Test User' }),
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  checkError: () => Promise.resolve(),
  // Required by MaintenancePage: called synchronously on render and in useEffect
  getMaintenanceInfo: () => null,
  clearMaintenanceInfo: () => undefined,
}));

import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { PUBLIC_ROUTE_PATHS } from '@shared/utils/publicRoutes';

/**
 * React-admin paints the layout/sidebar on the first render pass and defers
 * the actual routed page content (List/Create/Edit) to a later, async commit
 * — so `findAllByRole('menuitem')` can resolve successfully *before* that
 * deferred content has even mounted, let alone crashed.
 *
 * A component that throws once it actually renders (a missing import, a bad
 * reference) does NOT take the sidebar down with it: react-admin's <Layout>
 * wraps only the routed content in its own <ErrorBoundary> (see
 * ra-ui-materialui's Layout.tsx) — the Sidebar/Menu is a sibling *outside*
 * that boundary and survives untouched. So menuitem presence alone can never
 * detect this kind of crash; it only rules out failures severe enough to
 * reach the app-wide boundary above CoreAdminUI. The per-route boundary's
 * fallback (ra-ui-materialui's <Error>) renders an `<h1 role="alert">` —
 * that's the actual signal a routed page crashed.
 *
 * This waits for the initial shell, then gives deferred content a moment to
 * actually commit, then re-checks the shell is *still* there and no error
 * fallback appeared. A resource with no page registered for the route it was
 * given renders no extra content but doesn't crash either, so this still
 * passes for it.
 */
async function assertShellSurvives(timeout) {
  const initial = await screen.findAllByRole('menuitem', {}, { timeout });
  expect(initial.length).toBeGreaterThan(0);

  // Let any promise-driven content (the mocked dataProvider calls resolve
  // asynchronously) finish mounting — and crash, if it's going to.
  // eslint-disable-next-line no-await-in-loop
  await new Promise((resolve) => setTimeout(resolve, 100));

  const stillThere = screen.queryAllByRole('menuitem');
  expect(stillThere.length).toBeGreaterThan(0);

  // A routed-content crash is caught locally by <Layout>'s own ErrorBoundary
  // and rendered as an `<h1 role="alert">` — it doesn't remove the sidebar,
  // so it has to be checked for explicitly.
  const alerts = screen.queryAllByRole('alert');
  expect(alerts.length).toBe(0);
}

/**
 * createResourceTests(App, options)
 *
 * Smoke-tests every React Admin resource page in the given App:
 *   1. Renders the App at the root URL and discovers all resource paths
 *      via sidebar nav link hrefs (role="menuitem" → <a href>).
 *   2. Renders the App at each resource path and verifies the admin shell
 *      loads (auth passed, layout rendered, no crash).
 *
 * Provider mocks (dataProvider + authProvider) are defined above and are
 * active because this file is imported before App in entities.test.js.
 *
 * @param {React.ComponentType} App
 * @param {{ timeout?: number }} [options]
 */
export function createResourceTests(App, options = {}) {
  const timeout = options.timeout ?? 8000;

  describe('Resource pages smoke tests', () => {
    let resources = [];

    // -----------------------------------------------------------------------
    // Phase 1: Discover all available resource paths via the sidebar nav
    // -----------------------------------------------------------------------
    beforeAll(async () => {
      // Render at root so the sidebar renders with all resource nav items
      window.history.pushState({}, '', '/');

      render(<App />);

      // React Admin renders a MenuItemLink (role="menuitem") for every
      // Resource that has a list prop, once auth + permissions resolve.
      try {
        await screen.findAllByRole('menuitem', {}, { timeout });
      } catch (_e) {
        cleanup();
        throw new Error(
          'Resource discovery failed: no sidebar menuitems found within timeout. ' +
          'This usually means auth mocks are not working or the App has no listable resources. ' +
          'Original error: ' + _e.message
        );
      }

      // Resources assigned a `menuGroup` (see the shared Menu/SubMenu
      // components) render inside a <Collapse unmountOnExit>, collapsed by
      // default — their menuitems don't exist in the DOM at all until the
      // group is expanded. Click every button in the sidebar (group
      // toggles included) to expand them all before collecting menuitems;
      // harmless here since this render is torn down right after.
      // Clicking indiscriminately is unsafe — one of these buttons is the
      // sidebar's own open/close toggle, and clicking *that* one hides
      // every menuitem instead of revealing more. Self-correct: keep a
      // click only if it didn't reduce how many menuitems are visible.
      // SubMenu's own group toggles render as a MUI `ListItem button` —
      // a `<div role="button">`, not a real `<button>` element. Every risky
      // control (sidebar open/close toggle, skip-link, refresh, year
      // selector, language switcher, profile menu, ...) renders as a real
      // `<button>`. Restricting clicks to non-`<button>` elements targets
      // exactly the SubMenu toggles and structurally excludes everything
      // else — no need to reason about aria-haspopup or which button opens
      // a popover.
      //
      // Buttons are re-queried fresh on every pass rather than clicked from
      // one static snapshot: clicking one toggle can re-render the menu tree
      // and replace other buttons' DOM nodes, leaving a snapshot's
      // references stale/detached — fireEvent.click on a detached node is a
      // silent no-op.
      const clickedLabels = new Set();
      for (let pass = 0; pass < 5; pass += 1) {
        const toggles = screen
          .queryAllByRole('button')
          .filter((button) => button.tagName !== 'BUTTON');

        let clickedSomethingNew = false;
        toggles.forEach((toggle) => {
          const label = toggle.textContent || toggle.getAttribute('aria-label') || `unlabeled-${pass}`;
          if (clickedLabels.has(label)) return;
          clickedLabels.add(label);
          clickedSomethingNew = true;

          const before = screen.queryAllByRole('menuitem').length;
          fireEvent.click(toggle);
          const after = screen.queryAllByRole('menuitem').length;
          if (after < before) {
            fireEvent.click(toggle); // undo — this one hid items, not revealed them
          }
        });

        if (!clickedSomethingNew) break;
      }

      const items = await screen.findAllByRole('menuitem', {}, { timeout });

      // Each menuitem contains an <a> whose href is the resource path
      const seen = new Set();
      items.forEach(item => {
        const anchor = item.tagName === 'A' ? item : item.querySelector('a');
        if (!anchor) return;
        const href = anchor.getAttribute('href');
        // Keep only simple root paths like "/student", "/att_report" - skip noLayout
        // routes (see PUBLIC_ROUTE_PATHS): they render without the admin shell (no
        // sidebar) by design, which the generic smoke test below can't handle.
        if (href && /^\/[a-z0-9_-]+$/.test(href) && !seen.has(href) && !PUBLIC_ROUTE_PATHS.has(href)) {
          seen.add(href);
          resources.push(href);
        }
      });

      cleanup();
    }, timeout + 3000);

    // -----------------------------------------------------------------------
    // Phase 2: Assert at least one resource was discovered
    // -----------------------------------------------------------------------
    it('discovers at least one listable resource', () => {
      expect(resources.length).toBeGreaterThan(0);
    });

    // -----------------------------------------------------------------------
    // Phase 3: Smoke-test each resource list page
    //
    // We render the App at each resource URL and verify the Admin shell loads
    // (auth passed, layout rendered, no crash). We use sidebar nav items as
    // the indicator because React Admin renders them after the full auth +
    // permissions lifecycle completes.
    //
    // We then also attempt to find a table (React Query data load), but treat
    // it as a non-blocking best-effort check — a missing table just means
    // the resource uses a custom list layout or React Query hasn't settled.
    // -----------------------------------------------------------------------
    it(
      'each resource list page loads admin shell without crashing',
      async () => {
        for (const path of resources) {
          // Set URL before rendering so React Router opens the correct route
          window.history.pushState({}, '', path);

          render(<App />);

          // Wait for the admin layout to render at this specific route, then
          // confirm it's still standing once any deferred content has had a
          // chance to mount (and crash, if it's going to). Sidebar menuitems
          // appearing proves:
          //   - Auth passed (checkAuth resolved)
          //   - Permissions resolved (getPermissions returned)
          //   - The admin layout rendered (no crash, no error boundary)
          //   - We are NOT on the login page
          // eslint-disable-next-line no-await-in-loop
          await assertShellSurvives(timeout);

          cleanup();
          // Defensive extra reset: MUI portals (Popper/Dialog/Snackbar) can
          // mount content directly under document.body outside the RTL
          // container RTL's own cleanup() tracks. Across ~50 renders in one
          // process that's enough accumulated DOM to visibly slow down every
          // later query, so force the slate clean between iterations.
          document.body.innerHTML = '';
        }
      },
      // Generous timeout: CI hardware runs noticeably slower than local dev,
      // and real apps have run close to 50 resources once actually rendered
      // (not just the 8 static pages the old, broken discovery used to
      // find), so this budgets 100 resources at 13s each for headroom.
      (timeout + 5000) * 100
    );

    // -----------------------------------------------------------------------
    // Phase 4: Smoke-test each resource's Create and Edit pages
    //
    // Same signal as Phase 3 (admin shell / sidebar renders without crashing).
    // If a resource has no create/edit page registered, the route simply
    // matches nothing inside the layout and the shell renders normally — this
    // only fails on a real crash (e.g. a component throwing on mount, a
    // reference to something that was never imported).
    // -----------------------------------------------------------------------
    it(
      'each resource create page loads admin shell without crashing',
      async () => {
        for (const path of resources) {
          window.history.pushState({}, '', `${path}/create`);

          render(<App />);

          // eslint-disable-next-line no-await-in-loop
          await assertShellSurvives(timeout);

          cleanup();
          document.body.innerHTML = ''; // see comment on the list-page test above
        }
      },
      (timeout + 5000) * 100
    );

    it(
      'each resource edit page loads admin shell without crashing',
      async () => {
        for (const path of resources) {
          window.history.pushState({}, '', `${path}/1`);

          render(<App />);

          // eslint-disable-next-line no-await-in-loop
          await assertShellSurvives(timeout);

          cleanup();
          document.body.innerHTML = ''; // see comment on the list-page test above
        }
      },
      (timeout + 5000) * 100
    );
  });

  // -------------------------------------------------------------------------
  // CommonRoutes suite
  //
  // Verifies each of the 6 shared routes registered by CommonRoutes:
  //   - /yemot-simulator, /tutorial, /pages-view, /roadmap  (admin layout)
  //   - /register, /maintenance                              (noLayout)
  //
  // For every route we assert:
  //   1. No error text (404 / "not found" / "something went wrong") in body
  //   2. At least one "known element" specific to that page is present, proving
  //      real content was rendered (not a blank shell or a silent failure).
  //
  // noLayout behaviour with the auth mock:
  //   - /register: Register calls useCheckAuth → mock resolves (authenticated)
  //     → navigate('/') → admin shell loads; we verify the redirect + no error.
  //   - /maintenance: calls authProvider.getMaintenanceInfo (mocked → null) and
  //     authProvider.clearMaintenanceInfo (mocked → noop); initial render shows
  //     "המערכת בתחזוקה", then getIdentity resolves → navigate('/') → admin shell.
  // -------------------------------------------------------------------------
  describe('Common shared routes render without errors', () => {
    const ERROR_PATTERNS = [/404/i, /not found/i, /page not found/i, /something went wrong/i];

    const assertNoErrors = () => {
      const bodyText = document.body.textContent ?? '';
      for (const pattern of ERROR_PATTERNS) {
        expect(bodyText).not.toMatch(pattern);
      }
    };

    // /yemot-simulator — admin layout
    // Expected: admin shell (menuitems) + simulator form with call-ID label
    it(
      'route /yemot-simulator renders admin shell and simulator form',
      async () => {
        window.history.pushState({}, '', '/yemot-simulator');
        render(<App />);
        await screen.findAllByRole('menuitem', {}, { timeout });
        // Keep this broad so the test survives minor wording updates around call text in the simulator UI.
        await screen.findAllByLabelText(/שיחה/i, {}, { timeout });
        assertNoErrors();
        cleanup();
      },
      timeout + 3000
    );

    // /tutorial — admin layout
    // Expected: admin shell + Hebrew guide heading rendered by Tutorial.jsx
    it(
      'route /tutorial renders admin shell and tutorial content',
      async () => {
        window.history.pushState({}, '', '/tutorial');
        render(<App />);
        await screen.findAllByRole('menuitem', {}, { timeout });
        // Tutorial.jsx renders a Typography with hardcoded "מדריך:" heading.
        // The sidebar also contains a menu item with "מדריך" so use the colon
        // to match only the page heading (not the sidebar link "מדריך למשתמש").
        await screen.findByText(/מדריך:/i, {}, { timeout });
        assertNoErrors();
        cleanup();
      },
      timeout + 3000
    );

    // /pages-view — admin layout
    // Expected: admin shell (dataProvider mock returns [], so list area is empty)
    it(
      'route /pages-view renders admin shell without errors',
      async () => {
        window.history.pushState({}, '', '/pages-view');
        render(<App />);
        // The List component fetches via dataProvider (mocked → []).
        // Even with empty data, the admin layout with sidebar menuitems renders.
        await screen.findAllByRole('menuitem', {}, { timeout });
        assertNoErrors();
        cleanup();
      },
      timeout + 3000
    );

    // /roadmap — admin layout
    // Expected: admin shell + hardcoded "פיתוחים עתידיים" heading from Roadmap.jsx
    it(
      'route /roadmap renders admin shell and roadmap heading',
      async () => {
        window.history.pushState({}, '', '/roadmap');
        render(<App />);
        await screen.findAllByRole('menuitem', {}, { timeout });
        // Roadmap.jsx always renders this heading regardless of features list.
        // The sidebar link also contains this text so use findAllByText (allow
        // multiple matches) — having ≥2 matches means both sidebar and page
        // content rendered the text.
        const roadmapTexts = await screen.findAllByText(/פיתוחים עתידיים/i, {}, { timeout });
        expect(roadmapTexts.length).toBeGreaterThanOrEqual(2);
        assertNoErrors();
        cleanup();
      },
      timeout + 3000
    );

    // /register — noLayout
    // The Register component detects an authenticated user (checkAuth mock resolves)
    // and calls navigate('/'), so the admin shell loads after the redirect.
    it(
      'route /register redirects authenticated users to admin shell without errors',
      async () => {
        window.history.pushState({}, '', '/register');
        render(<App />);
        // After redirect to '/', the admin shell (sidebar menuitems) appears
        await screen.findAllByRole('menuitem', {}, { timeout });
        assertNoErrors();
        cleanup();
      },
      timeout + 3000
    );

    // /maintenance — noLayout
    // With the auth mock, getIdentity resolves immediately, so on mount the
    // useEffect clears maintenance and calls navigate('/') before the auth
    // loading state resolves. We verify the redirect to admin completes cleanly
    // and that no error text appears at any point.
    it(
      'route /maintenance redirects authenticated users to admin shell without errors',
      async () => {
        window.history.pushState({}, '', '/maintenance');
        render(<App />);
        // After useEffect: getIdentity resolves → clearMaintenanceInfo() →
        // navigate('/') → admin layout renders with sidebar menuitems.
        await screen.findAllByRole('menuitem', {}, { timeout });
        assertNoErrors();
        cleanup();
      },
      timeout + 3000
    );
  });
}
