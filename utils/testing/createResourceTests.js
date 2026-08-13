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
    // Echo back the requested id rather than always returning mockRow.id.
    // A resource with no create page registered makes /<resource>/create
    // fall through to the *edit* route with id "create", and react-admin's
    // useEditController throws if the fetched record's id doesn't match the
    // one requested — a mock-induced crash that looks exactly like a real
    // one. Echoing keeps the mock self-consistent for any id.
    getOne: (resource, params) => Promise.resolve({ data: { ...mockRow, id: params?.id ?? mockRow.id } }),
    getMany: () => Promise.resolve({ data: mockRows }),
    getManyReference: () => Promise.resolve({ data: mockRows, total: mockRows.length }),
    create: () => Promise.resolve({ data: mockRow }),
    update: (resource, params) => Promise.resolve({ data: { ...mockRow, id: params?.id ?? mockRow.id } }),
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

import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import { PUBLIC_ROUTE_PATHS } from '@shared/utils/publicRoutes';

// A fixed sleep after navigation is NOT safe here: an Edit page waits for
// the dataProvider's getOne to resolve before it renders its form, so a
// short fixed wait checks the page before the very component that might
// crash has mounted — a false negative (observed: a deliberately broken
// Edit form passed a 50ms wait while the identical broken Create form
// failed). Instead poll until the routed content stops growing.
const SETTLE_POLL_MS = 50;
const SETTLE_MAX_MS = 2000;

// -----------------------------------------------------------------------
// Why these use querySelectorAll instead of testing-library's *ByRole:
//
// `queryAllByRole` filters matches by accessibility (visibility), which
// runs getComputedStyle on every candidate. In jsdom that is pathologically
// slow — measured at ~666ms per queryAllByRole('menuitem') call against
// this app's sidebar, versus ~0.7ms for the equivalent querySelectorAll.
// `findAllByRole` re-runs that scan on every poll, so a single call could
// burn seconds. Across ~140 routes that alone was minutes of the runtime.
//
// Both roles we care about are explicit `role="..."` attributes in the
// rendered DOM (MUI sets them on MenuItem and on react-admin's <Error>
// fallback heading), so a plain attribute selector finds exactly the same
// elements without the visibility pass.
// -----------------------------------------------------------------------
const countMenuItems = () => document.querySelectorAll('[role="menuitem"]').length;
const countAlerts = () => document.querySelectorAll('[role="alert"]').length;

async function waitForShell(timeout) {
  const deadline = Date.now() + timeout;
  while (countMenuItems() === 0) {
    if (Date.now() > deadline) {
      throw new Error(
        'Admin shell never rendered: no [role="menuitem"] found within timeout. ' +
        'This usually means auth mocks are not working, or the app crashed hard ' +
        'enough to trip the app-wide error boundary above CoreAdminUI.'
      );
    }
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
}

const mainContent = () => document.getElementById('main-content') || document.body;

/**
 * Waits for the routed page to actually be the *new* page, then to stop
 * changing.
 *
 * Two traps this exists to avoid, both of which produced silent false
 * passes before:
 *
 *  1. React Router navigates inside startTransition, so React keeps the
 *     PREVIOUS page mounted until the new one is ready. Sampling right
 *     after navigation reads the old page — observed directly: while the
 *     URL was /student/1, #main-content still rendered the previous
 *     resource's edit page (its "back to list" link still pointed at
 *     /lesson_schedule). So wait for the content to actually swap.
 *  2. "DOM stopped changing" alone is not "page finished rendering" — a
 *     half-rendered Edit page waiting on getOne is perfectly stable. So
 *     require the swap first, and only then look for stability.
 *
 * Each poll runs in its own act() so React can flush the transition
 * between polls; awaiting inside a single long act() does not.
 */
async function settleRoutedContent(previousHtml) {
  const deadline = Date.now() + SETTLE_MAX_MS;
  let lastHtml = null;
  let stableChecks = 0;
  let swapped = false;

  while (Date.now() < deadline) {
    // eslint-disable-next-line no-await-in-loop
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, SETTLE_POLL_MS));
    });

    // Already crashed — the error fallback is the final state, stop here.
    if (countAlerts() > 0) return;

    const html = mainContent().innerHTML;
    if (!swapped && html !== previousHtml) swapped = true;

    if (swapped) {
      if (html === lastHtml) {
        stableChecks += 1;
        if (stableChecks >= 2) return;
      } else {
        stableChecks = 0;
      }
    }
    lastHtml = html;
  }
}

/**
 * Navigates the already-mounted app to `path` and checks the page rendered
 * without crashing. Returns an error string, or null when the page is fine.
 *
 * Navigating rather than re-rendering <App /> per page is a deliberate
 * performance choice, and it is safe here for a specific reason: a routed
 * page that throws is caught by <Layout>'s own <ErrorBoundary> (see
 * ra-ui-materialui's Layout.tsx), and react-admin resets that boundary on
 * every location change (ra-core's useResetErrorBoundaryOnLocationChange).
 * So one crashed page cannot poison the next one.
 *
 * Re-rendering instead measurably degrades: successive full mounts of this
 * app were timed at 1.2s, 2.6s, 2.9s, 3.5s, 4.7s — monotonically climbing
 * even with cleanup() between them — while navigation stays flat.
 *
 * The crash signal is the error fallback, not a missing sidebar: <Layout>
 * wraps only the routed content, so the Sidebar/Menu is a sibling *outside*
 * that boundary and survives a page crash untouched. The fallback
 * (ra-ui-materialui's <Error>) renders an `<h1 role="alert">` — that is
 * what actually proves a page blew up. A resource with no page registered
 * for the route renders no extra content but doesn't crash either, so this
 * still passes for it.
 */
async function checkRoute(path, timeout) {
  const previousHtml = mainContent().innerHTML;

  await act(async () => {
    window.history.pushState({}, '', path);
    // <Admin> is mounted inside the app's own <BrowserRouter> (see
    // AdminAppShell), whose history listens for popstate — pushState alone
    // would change the URL without telling the router.
    window.dispatchEvent(new PopStateEvent('popstate'));
  });

  await settleRoutedContent(previousHtml);

  try {
    await waitForShell(timeout);
  } catch (error) {
    return `${path}: ${error.message}`;
  }

  if (countAlerts() > 0) {
    return `${path}: the page crashed — react-admin's error boundary fallback rendered.`;
  }

  return null;
}

/**
 * Walks every path through checkRoute on a single mounted app, collecting
 * every failure rather than stopping at the first, so one broken entity
 * doesn't hide the rest.
 */
async function checkAllRoutes(App, paths, timeout) {
  window.history.pushState({}, '', '/');
  render(<App />);
  await waitForShell(timeout);

  const failures = [];
  for (const path of paths) {
    // eslint-disable-next-line no-await-in-loop
    const failure = await checkRoute(path, timeout);
    if (failure) failures.push(failure);
  }

  if (failures.length > 0) {
    throw new Error(
      `${failures.length} of ${paths.length} pages failed to render:\n  ` +
      failures.join('\n  ')
    );
  }
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
        await waitForShell(timeout);
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
        // Explicit role="button" attribute (again via selector, not *ByRole,
        // for the speed reason documented above). This conveniently matches
        // only elements that opt into the role explicitly — real <button>
        // elements get the role implicitly and carry no attribute — so the
        // tagName filter is a belt-and-braces guard.
        const toggles = Array.from(document.querySelectorAll('[role="button"]'))
          .filter((button) => button.tagName !== 'BUTTON');

        let clickedSomethingNew = false;
        toggles.forEach((toggle) => {
          const label = toggle.textContent || toggle.getAttribute('aria-label') || `unlabeled-${pass}`;
          if (clickedLabels.has(label)) return;
          clickedLabels.add(label);
          clickedSomethingNew = true;

          const before = countMenuItems();
          fireEvent.click(toggle);
          const after = countMenuItems();
          if (after < before) {
            fireEvent.click(toggle); // undo — this one hid items, not revealed them
          }
        });

        if (!clickedSomethingNew) break;
      }

      const items = Array.from(document.querySelectorAll('[role="menuitem"]'));

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
    // Phase 3/4: Smoke-test each resource's List, Create and Edit page
    //
    // Each phase mounts the app once and then navigates between routes (see
    // checkAllRoutes / checkRoute above for why that is both much faster and
    // still a valid crash check). A page that renders without tripping
    // react-admin's error boundary passes; anything that throws on mount —
    // a missing import, a bad reference, a field the record doesn't have —
    // fails, and every failing page is reported, not just the first.
    //
    // If a resource has no create/edit page registered, the route simply
    // matches nothing inside the layout and the shell renders normally, so
    // this only fails on a real crash.
    // -----------------------------------------------------------------------
    // Guard rail, not a target: each phase mounts once then navigates, which
    // measured ~1.2s per page, so ~46 resources lands near a minute. If a
    // phase ever approaches this, something has regressed and should fail.
    const phaseTimeout = 240000;

    it(
      'each resource list page loads admin shell without crashing',
      () => checkAllRoutes(App, resources, timeout),
      phaseTimeout
    );

    it(
      'each resource create page loads admin shell without crashing',
      () => checkAllRoutes(App, resources.map((path) => `${path}/create`), timeout),
      phaseTimeout
    );

    it(
      'each resource edit page loads admin shell without crashing',
      () => checkAllRoutes(App, resources.map((path) => `${path}/1`), timeout),
      phaseTimeout
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
        await waitForShell(timeout);
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
        await waitForShell(timeout);
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
        await waitForShell(timeout);
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
        await waitForShell(timeout);
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
        await waitForShell(timeout);
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
        await waitForShell(timeout);
        assertNoErrors();
        cleanup();
      },
      timeout + 3000
    );
  });
}
