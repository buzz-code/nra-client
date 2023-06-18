import { useIsAdmin } from '@shared/utils/permissionsUtil';
import { CommonList } from '@shared/components/crudContainers/CommonList';
import { CommonEdit } from '@shared/components/crudContainers/CommonEdit';
import { CommonCreate } from '@shared/components/crudContainers/CommonCreate';
import { EmptyPage } from './EmptyPage';
import { filterArrayByParams } from '@shared/utils/filtersUtil';

export function getResourceComponents({
    Datagrid,
    Inputs,
    Representation = 'id',
    filters = [],
    filterDefaultValues = {},
    importer = null,
    exporter = true
}) {
    const importerDef = importer
        ? {
            ...importer,
            datagrid: Datagrid
        }
        : null;

    const List = () => {
        const isAdmin = useIsAdmin();
        const filtersArr = filterArrayByParams(filters, {isAdmin});

        return (
            <CommonList filters={filtersArr} filterDefaultValues={filterDefaultValues}
                importer={importerDef} exporter={exporter} empty={<EmptyPage importer={importerDef} />}>
                <Datagrid isAdmin={isAdmin} />
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