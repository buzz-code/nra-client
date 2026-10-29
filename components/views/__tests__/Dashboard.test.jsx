import { render, screen } from '@testing-library/react';
import { AdminContext, TestMemoryRouter, testDataProvider } from 'react-admin';
import Dashboard from '@shared/components/views/Dashboard';

describe('Dashboard', () => {
    it('skips items whose resource has a query string instead of crashing', async () => {
        const dataProvider = testDataProvider({ getCount: () => Promise.resolve(3) });
        render(
            <TestMemoryRouter>
                <AdminContext dataProvider={dataProvider}>
                    <Dashboard dashboardItems={[
                        { resource: 'student', title: 'Students', yearFilterType: 'none', filter: { klass: 1 } },
                        { resource: 'student/pivot?extra.pivot=X', title: 'Pivot', yearFilterType: 'none', filter: { a: 'b' } },
                    ]} />
                </AdminContext>
            </TestMemoryRouter>
        );
        expect(await screen.findByText('Students')).toBeInTheDocument();
        expect(screen.queryByText('Pivot')).not.toBeInTheDocument();
    });
});
