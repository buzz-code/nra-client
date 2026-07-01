import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('react-admin', () => ({
    usePermissions: () => ({ permissions: {} }),
}));

jest.mock('@shared/utils/permissionsUtil', () => ({
    useIsAdmin: () => false,
}));

jest.mock('@shared/utils/filtersUtil', () => ({
    filterArrayByParams: (items) => items,
}));

jest.mock('@shared/components/crudContainers/CommonList', () => ({
    CommonList: ({ children }) => <div data-testid="common-list">{children}</div>,
}));

jest.mock('@shared/components/crudContainers/CommonEdit', () => ({
    CommonEdit: ({ children }) => <div data-testid="common-edit">{children}</div>,
}));

jest.mock('@shared/components/crudContainers/CommonCreate', () => ({
    CommonCreate: ({ children }) => <div data-testid="common-create">{children}</div>,
}));

jest.mock('@shared/components/fields/InlineEditButton', () => ({
    InlineEditButton: ({ resource, getUpdateId, children }) => (
        <div data-testid="inline-edit-button" data-resource={resource} data-has-get-update-id={!!getUpdateId}>
            {children}
        </div>
    ),
}));

const { getResourceComponents } = require('../CommonEntity');

const Datagrid = ({ InlineEdit }) => (
    <div data-testid="datagrid">{InlineEdit && <InlineEdit />}</div>
);

const Inputs = ({ isCreate }) => <span data-testid="inputs">{isCreate ? 'create' : 'edit'}</span>;

describe('getResourceComponents inline edit wiring', () => {
    it('does not render an inline edit button when inlineEdit is not set', () => {
        const { list: List } = getResourceComponents({ resource: 'payment_track', Datagrid, Inputs });
        render(<List />);
        expect(screen.queryByTestId('inline-edit-button')).not.toBeInTheDocument();
    });

    it('does not render an inline edit button when Inputs is missing, even if inlineEdit is set', () => {
        const { list: List } = getResourceComponents({ resource: 'payment_track', Datagrid, inlineEdit: true });
        render(<List />);
        expect(screen.queryByTestId('inline-edit-button')).not.toBeInTheDocument();
    });

    it('reuses Inputs (in edit mode) inside the inline edit button when inlineEdit is true', () => {
        const { list: List } = getResourceComponents({ resource: 'payment_track', Datagrid, Inputs, inlineEdit: true });
        render(<List />);
        const inlineEditButton = screen.getByTestId('inline-edit-button');
        expect(inlineEditButton).toHaveAttribute('data-resource', 'payment_track');
        expect(screen.getByTestId('inputs')).toHaveTextContent('edit');
    });

    it('forwards inlineEdit overrides (e.g. getUpdateId) to InlineEditButton', () => {
        const { list: List } = getResourceComponents({
            resource: 'text_by_user',
            Datagrid,
            Inputs,
            inlineEdit: { resource: 'text', getUpdateId: (record) => record.overrideTextId },
        });
        render(<List />);
        const inlineEditButton = screen.getByTestId('inline-edit-button');
        expect(inlineEditButton).toHaveAttribute('data-resource', 'text');
        expect(inlineEditButton).toHaveAttribute('data-has-get-update-id', 'true');
    });
});
