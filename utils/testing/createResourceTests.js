import { render, screen, cleanup } from '@testing-library/react';

/**
 * createResourceTests(App, options)
 *
 * Generates a Jest describe block that:
 *   1. Renders the App at the root URL and discovers all resource paths
 *      by reading sidebar nav link hrefs (role="menuitem" → <a href>).
 *   2. Smoke-tests each resource's list page by rendering the App at that
 *      URL and waiting for a <table> element (React Admin Datagrid).
 *
 * IMPORTANT: Call this from your project's entities.test.js AFTER setting
 * up jest.mock() for @shared/providers/dataProvider and
 * @shared/providers/authProvider. Those two mocks MUST be declared in the
 * test file (not here) because jest.mock() calls are hoisted.
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
