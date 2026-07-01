import { useIsAdmin } from '@shared/utils/permissionsUtil';
import { CommonList } from '@shared/components/crudContainers/CommonList';
import { CommonEdit } from '@shared/components/crudContainers/CommonEdit';
import { CommonCreate } from '@shared/components/crudContainers/CommonCreate';
import { InlineEditButton } from '@shared/components/fields/InlineEditButton';
import { EmptyPage } from './EmptyPage';
import { filterArrayByParams } from '@shared/utils/filtersUtil';
import { usePermissions } from 'react-admin';

export function getResourceComponents({
    resource,
    Datagrid,
    Inputs,
    Representation = 'id',
    filters = [],
    filterDefaultValues = {},
    importer = null,
    exporter = true,
    sort,
    configurable = true,
    additionalListActions,
    inlineEdit,
}) {
    const importerDef = importer
        ? {
            ...importer,
            datagrid: Datagrid
        }
        : null;

    const InlineEdit = inlineEdit && Inputs && (() => {
        const isAdmin = useIsAdmin();

        return (
            <InlineEditButton resource={resource} {...(inlineEdit === true ? {} : inlineEdit)}>
                <Inputs isAdmin={isAdmin} isCreate={false} />
            </InlineEditButton>
        );
    })

    const List = ({ filter = {} }) => {
        const isAdmin = useIsAdmin();
        const { permissions } = usePermissions();
        const filtersArr = filterArrayByParams(filters, { isAdmin, permissions });

        return (
            <CommonList resource={resource}
                filters={filtersArr} filterDefaultValues={filterDefaultValues}
                filter={filter}
                importer={importerDef} exporter={exporter}
                empty={<EmptyPage importer={importerDef} />}
                sort={sort} configurable={configurable}
                additionalListActions={additionalListActions}>
                <Datagrid isAdmin={isAdmin} configurable={configurable} InlineEdit={InlineEdit} />
            </CommonList>
        );
    }

    const Edit = Inputs && (() => {
        const isAdmin = useIsAdmin();

        return (
            <CommonEdit>
                <Inputs isAdmin={isAdmin} isCreate={false} />
            </CommonEdit>
        );
    })

    const Create = Inputs && (() => {
        const isAdmin = useIsAdmin();

        return (
            <CommonCreate>
                <Inputs isAdmin={isAdmin} isCreate={true} />
            </CommonCreate>
        );
    })

    return {
        list: List,
        edit: Edit,
        create: Create,
        recordRepresentation: Representation,
    }
}