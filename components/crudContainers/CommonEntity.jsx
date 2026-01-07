import { useIsAdmin } from '@shared/utils/permissionsUtil';
import { CommonList } from '@shared/components/crudContainers/CommonList';
import { CommonEdit } from '@shared/components/crudContainers/CommonEdit';
import { CommonCreate } from '@shared/components/crudContainers/CommonCreate';
import { EmptyPage } from './EmptyPage';
import { filterArrayByParams } from '@shared/utils/filtersUtil';
import { usePermissions } from 'react-admin';
import { useCommonRedirect } from '@shared/utils/redirectUtil';

export function getResourceComponents({
    resource,
    Datagrid,
    Inputs,
    Representation = 'id',
    filters = [],
    filterDefaultValues = {},
    importer = null,
    exporter = true,
    editResource,
    deleteResource,
    sort,
    configurable = true,
    additionalListActions,
}) {
    const importerDef = importer
        ? {
            ...importer,
            datagrid: Datagrid
        }
        : null;

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
                <Datagrid isAdmin={isAdmin} deleteResource={deleteResource} configurable={configurable} />
            </CommonList>
        );
    }

    const Edit = Inputs && (() => {
        const isAdmin = useIsAdmin();
        const redirect = useCommonRedirect({ resource });

        return (
            <CommonEdit resource={editResource} redirect={redirect}>
                <Inputs isAdmin={isAdmin} isCreate={false} />
            </CommonEdit>
        );
    })

    const Create = Inputs && (() => {
        const isAdmin = useIsAdmin();
        const redirect = useCommonRedirect({ resource });

        return (
            <CommonCreate resource={editResource} redirect={redirect}>
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