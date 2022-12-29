import { useIsAdmin } from '@shared/utils/permissionsUtil';
import { CommonList } from '@shared/components/crudContainers/CommonList';
import { CommonEdit } from '@shared/components/crudContainers/CommonEdit';
import { CommonCreate } from '@shared/components/crudContainers/CommonCreate';

export function getResourceComponents({ Datagrid, Inputs, Representation = 'id', filters = [], importer = null }) {
    const importerDef = importer
        ? {
            ...importer,
            datagrid: Datagrid
        }
        : null;

    const List = () => {
        const isAdmin = useIsAdmin();

        return (
            <CommonList filters={filters} importer={importerDef}>
                <Datagrid isAdmin={isAdmin} />
            </CommonList>
        );
    }

    const Edit = () => {
        const isAdmin = useIsAdmin();

        return (
            <CommonEdit>
                <Inputs isAdmin={isAdmin} isCreate={false} />
            </CommonEdit>
        );
    }

    const Create = () => {
        const isAdmin = useIsAdmin();

        return (
            <CommonCreate>
                <Inputs isAdmin={isAdmin} isCreate={true} />
            </CommonCreate>
        );
    }

    return {
        list: List,
        edit: Edit,
        create: Create,
        recordRepresentation: Representation,
    }
}