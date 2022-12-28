import { useIsAdmin } from '@shared/components/AdminRestricted';
import { CommonList } from '@shared/components/CommonList';
import { CommonEdit } from '@shared/components/CommonEdit';
import { CommonCreate } from '@shared/components/CommonCreate';

export function getResourceComponents({ Datagrid, Inputs, Representation = 'id', filters = [] }) {
    const List = () => {
        const isAdmin = useIsAdmin();

        return (
            <CommonList filters={filters}>
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