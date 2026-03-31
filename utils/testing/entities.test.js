// Smoke-tests every React Admin resource page. Add a <Resource> to App.jsx and it's auto-tested.
import { createResourceTests } from './createResourceTests';
import App from '../../../src/App';

createResourceTests(App);
