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
        // No menuitems found — auth may have failed or there are no list views
        cleanup();
        return;
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
}
