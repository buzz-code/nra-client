// Smoke-tests every React Admin resource page. Add a <Resource> to App.jsx and it's auto-tested.
import { createResourceTests } from './createResourceTests';

let App;
let hasApp = false;

try {
  require.resolve('../../../src/App');
  hasApp = true;
} catch (error) {
  if (error.code !== 'MODULE_NOT_FOUND') {
    throw error;
  }
}

if (hasApp) {
  const importedApp = require('../../../src/App');
  App = importedApp.default || importedApp;
  createResourceTests(App);
} else {
  describe.skip('React Admin resource smoke tests', () => {
    it('skips when the consuming App module is not available', () => {});
  });
}
