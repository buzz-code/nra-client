// Smoke-tests every React Admin resource page. Add a <Resource> to App.jsx and it's auto-tested.
//
// Skipped when the consuming app has its own src/entities.test.js: that file
// already calls createResourceTests(App) directly (see react-admin-nestjs,
// for example), so running it again here would render every resource's
// List/Create/Edit page twice for zero extra coverage — real cost now that
// discovery actually finds every resource instead of nothing.
import { createResourceTests } from './createResourceTests';

let App;
let hasApp = false;
let hasOwnEntitiesTest = false;

try {
  require.resolve('../../../src/App');
  hasApp = true;
} catch (error) {
  if (error.code !== 'MODULE_NOT_FOUND') {
    throw error;
  }
}

try {
  require.resolve('../../../src/entities.test');
  hasOwnEntitiesTest = true;
} catch (error) {
  if (error.code !== 'MODULE_NOT_FOUND') {
    throw error;
  }
}

if (hasApp && !hasOwnEntitiesTest) {
  const importedApp = require('../../../src/App');
  App = importedApp.default || importedApp;
  createResourceTests(App);
} else {
  describe.skip('React Admin resource smoke tests', () => {
    it('skips when the consuming App module is not available, or the app already has its own entities.test.js', () => {});
  });
}
