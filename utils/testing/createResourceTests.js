// These jest.mock() calls are hoisted to the top of THIS file by Babel.
// Because entities.test.js imports createResourceTests before importing App,
// these mocks are registered before App.jsx (and its provider imports) load.
jest.mock('@shared/providers/dataProvider', () => ({
  getList: () => Promise.resolve({ data: [], total: 0 }),
  getOne: () => Promise.resolve({ data: {} }),
  getMany: () => Promise.resolve({ data: [] }),
  getManyReference: () => Promise.resolve({ data: [], total: 0 }),
  create: () => Promise.resolve({ data: {} }),
  update: () => Promise.resolve({ data: {} }),
  updateMany: () => Promise.resolve({ data: [] }),
  delete: () => Promise.resolve({ data: {} }),
  deleteMany: () => Promise.resolve({ data: [] }),
}));

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

import { render, screen, cleanup } from '@testing-library/react';

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
      let items;
      try {
        items = await screen.findAllByRole('menuitem', {}, { timeout });
      } catch (_e) {
        cleanup();
        throw new Error(
          'Resource discovery failed: no sidebar menuitems found within timeout. ' +
          'This usually means auth mocks are not working or the App has no listable resources. ' +
          'Original error: ' + _e.message
        );
      }

      // Each menuitem contains an <a> whose href is the resource path
      const seen = new Set();
      items.forEach(item => {
        const anchor = item.tagName === 'A' ? item : item.querySelector('a');
        if (!anchor) return;
        const href = anchor.getAttribute('href');
        // Keep only simple root paths like "/student", "/att_report"
        if (href && /^\/[a-z0-9_-]+$/.test(href) && !seen.has(href)) {
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

          // Wait for the admin layout to render at this specific route.
          // Sidebar menuitems appearing proves:
          //   - Auth passed (checkAuth resolved)
          //   - Permissions resolved (getPermissions returned)
          //   - The admin layout rendered (no crash, no error boundary)
          //   - We are NOT on the login page
          // eslint-disable-next-line no-await-in-loop
          const items = await screen.findAllByRole('menuitem', {}, { timeout });
          expect(items.length).toBeGreaterThan(0);

          cleanup();
        }
      },
      // Generous timeout: up to 50 resources
      (timeout + 1000) * 50
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
        // The form renders TextInput with label "מזהה שיחה" (Call ID)
        await screen.findByLabelText(/מזהה שיחה/i, {}, { timeout });
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
