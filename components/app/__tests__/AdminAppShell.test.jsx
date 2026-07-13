import { render, screen, waitFor, cleanup } from '@testing-library/react';

// Hoisted mocks: AdminAppShell imports these providers directly (not as props),
// so the auth state for these tests is controlled here. The mock objects must be
// created inline in the factory (not referenced from an outer `const`) because
// jest hoists `jest.mock()` above other imports, which can run before an outer
// `const` initializes - re-import the mocked module below to configure it per test.
jest.mock('@shared/providers/dataProvider', () => ({
  getList: () => Promise.resolve({ data: [], total: 0 }),
  getOne: () => Promise.resolve({ data: {} }),
}));

jest.mock('@shared/providers/authProvider', () => ({
  checkAuth: jest.fn(),
  getPermissions: jest.fn(),
  getIdentity: () => Promise.resolve({ id: 1, fullName: 'Test User' }),
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  checkError: () => Promise.resolve(),
}));

import AdminAppShell from '../AdminAppShell';
import mockAuthProvider from '@shared/providers/authProvider';

/**
 * "/" must show the public HomePage (homeContent) for anonymous visitors and
 * the real dashboard for authenticated ones - without ever registering both
 * as routes at once, since a permanently-registered "/" route would shadow
 * react-admin's dashboard route for every user (see AdminAppShell.jsx).
 */
describe('AdminAppShell public homepage at "/"', () => {
  const Dashboard = () => <div>Dashboard Content</div>;
  const homeContent = { appTitle: 'ברוכים הבאים' };

  const TestApp = () => (
    <AdminAppShell
      title="Test"
      themeOptions={{ primary: '#000', secondary: '#000' }}
      domainTranslations={{}}
      dashboard={Dashboard}
      layout={({ children }) => <div>{children}</div>}
      homeContent={homeContent}
    >
      {() => null}
    </AdminAppShell>
  );

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('shows the HomePage at "/" when anonymous', async () => {
    mockAuthProvider.checkAuth.mockReturnValue(Promise.reject());
    mockAuthProvider.getPermissions.mockReturnValue(Promise.reject());

    window.history.pushState({}, '', '/');
    render(<TestApp />);

    await waitFor(() => expect(screen.getByText('ברוכים הבאים')).toBeInTheDocument());
    expect(screen.queryByText('Dashboard Content')).not.toBeInTheDocument();
  });

  it('shows the real dashboard at "/" when authenticated', async () => {
    mockAuthProvider.checkAuth.mockReturnValue(Promise.resolve());
    mockAuthProvider.getPermissions.mockReturnValue(Promise.resolve({ admin: true }));

    window.history.pushState({}, '', '/');
    render(<TestApp />);

    await waitFor(() => expect(screen.getByText('Dashboard Content')).toBeInTheDocument());
    expect(screen.queryByText('ברוכים הבאים')).not.toBeInTheDocument();
  });
});
