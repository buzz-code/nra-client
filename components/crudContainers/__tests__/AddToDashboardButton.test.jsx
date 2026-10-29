import { render, screen } from '@testing-library/react';
import { AdminContext, ListContextProvider, ResourceContextProvider, testDataProvider } from 'react-admin';
import { AddToDashboardButton } from '@shared/components/crudContainers/AddToDashboardButton';

const renderButton = (resource) => render(
    <AdminContext dataProvider={testDataProvider()}>
        <ResourceContextProvider value={resource}>
            <ListContextProvider value={{ filterValues: {} }}>
                <AddToDashboardButton />
            </ListContextProvider>
        </ResourceContextProvider>
    </AdminContext>
);

describe('AddToDashboardButton', () => {
    it('shows for a plain resource', () => {
        renderButton('student');
        expect(screen.getByText('הוסף לתמונת מצב')).toBeInTheDocument();
    });

    it('is hidden for a pivot resource with a query string', () => {
        renderButton('student/pivot?extra.pivot=X');
        expect(screen.queryByText('הוסף לתמונת מצב')).not.toBeInTheDocument();
    });
});
