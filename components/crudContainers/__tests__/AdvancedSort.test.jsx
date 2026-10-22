import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { AdminContext, ResourceContextProvider, TestMemoryRouter, testDataProvider, TextField, NumberField, ReferenceField } from 'react-admin';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { getSortableColumns } from '@shared/components/crudContainers/AdvancedSort';

describe('getSortableColumns', () => {
    it('uses sortBy over source and skips unsortable or source-less children', () => {
        const columns = getSortableColumns([
            <TextField key="1" source="name" />,
            <ReferenceField key="2" source="klassReferenceId" reference="klass" sortBy="klass.name" />,
            <TextField key="3" source="comment" sortable={false} />,
            <TextField key="4" label="no source" />,
            false,
        ]);
        expect(columns).toEqual([
            { field: 'name', source: 'name', label: undefined },
            { field: 'klass.name', source: 'klassReferenceId', label: undefined },
        ]);
    });
});

describe('AdvancedSortButton in a CommonList', () => {
    const record = { id: 1, name: 'Basic', description: 'Basic plan', monthlyPrice: 10 };
    const authProvider = {
        checkAuth: () => Promise.resolve(),
        getPermissions: () => Promise.resolve({}),
        checkError: () => Promise.resolve(),
    };
    const Datagrid = ({ isAdmin, children, ...props }) => (
        <CommonDatagrid {...props}>
            {children}
            <TextField source="name" />
            <TextField source="description" />
            <NumberField source="monthlyPrice" />
        </CommonDatagrid>
    );
    const { list: List } = getResourceComponents({
        Datagrid,
        exporter: false,
        sort: { field: 'name', order: 'ASC' },
        sortOptions: [{ field: 'plan.order', label: 'סדר תוכנית' }],
    });

    const renderList = (getList) => render(
        <TestMemoryRouter initialEntries={['/payment_track']}>
            <AdminContext dataProvider={testDataProvider({ getList })} authProvider={authProvider}>
                <ResourceContextProvider value="payment_track">
                    <List />
                </ResourceContextProvider>
            </AdminContext>
        </TestMemoryRouter>
    );

    it('offers the columns plus sortOptions, and applies a multi-level sort through the dataProvider', async () => {
        const getList = jest.fn(() => Promise.resolve({ data: [record], total: 1 }));
        renderList(getList);
        await screen.findByText('Basic');

        fireEvent.click(screen.getByRole('button', { name: 'מיון' }));
        const dialog = await screen.findByRole('dialog');

        fireEvent.click(within(dialog).getByRole('button', { name: 'הוסף רמה' }));
        const fieldSelects = within(dialog).getAllByRole('combobox', { name: 'עמודה' });
        expect(fieldSelects).toHaveLength(2);

        fireEvent.mouseDown(fieldSelects[1]);
        const listbox = await screen.findByRole('listbox');
        expect(within(listbox).getByRole('option', { name: 'סדר תוכנית' })).toBeInTheDocument();
        fireEvent.click(within(listbox).getByRole('option', { name: 'סדר תוכנית' }));

        fireEvent.click(within(dialog).getByRole('button', { name: 'החל' }));

        await waitFor(() => expect(getList).toHaveBeenLastCalledWith('payment_track', expect.objectContaining({
            sort: { field: 'name,plan.order', order: 'ASC,ASC' },
        })));
        expect(await screen.findByRole('button', { name: 'מיון (2)' })).toBeInTheDocument();
    });
});
