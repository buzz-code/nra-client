import { useIsAdmin } from '@shared/utils/permissionsUtil';
import { CommonList } from '@shared/components/crudContainers/CommonList';
import { CommonEdit } from '@shared/components/crudContainers/CommonEdit';
import { CommonCreate } from '@shared/components/crudContainers/CommonCreate';
import { EmptyPage } from './EmptyPage';
import { filterArrayByParams } from '@shared/utils/filtersUtil';
import { usePermissions } from 'react-admin';
import { EditInDialogButton } from '@shared/components/dialogs/EditInDialogButton';
import { InlineEditProvider } from '@shared/components/dialogs/InlineEditContext';

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
    inlineEdit = false,
    inlineCreate = false,
    dialogEditTitle,
    dialogCreateTitle,
}) {
    const importerDef = importer
        ? {
            ...importer,
            datagrid: Datagrid
        }
        : null;

    // Create EditButton component if inline edit is enabled
    const EditButton = (inlineEdit && Inputs) ? (
        ({ isAdmin }) => (
            <EditInDialogButton 
                Inputs={(props) => <Inputs {...props} isAdmin={isAdmin} />}
                resource={editResource || resource}
                title={dialogEditTitle}
            />
        )
    ) : null;

    const List = ({ filter = {} }) => {
        const isAdmin = useIsAdmin();
        const { permissions } = usePermissions();
        const filtersArr = filterArrayByParams(filters, { isAdmin, permissions });

        // Only provide inline create context if both flag is enabled AND Inputs component exists
        const inlineEditContextValue = (inlineCreate && Inputs) ? {
            inlineCreate: true,
            CreateInputs: (props) => <Inputs {...props} isAdmin={isAdmin} />,
            dialogCreateTitle,
        } : null;

        // Use readonly flag to disable row click when inline edit is enabled
        const readonly = inlineEdit;

        return (
            <InlineEditProvider value={inlineEditContextValue}>
                <CommonList 
                    resource={resource}
                    filters={filtersArr} 
                    filterDefaultValues={filterDefaultValues}
                    filter={filter}
                    importer={importerDef} 
                    exporter={exporter}
                    empty={<EmptyPage importer={importerDef} />}
                    sort={sort} 
                    configurable={configurable}
                    additionalListActions={additionalListActions}
                >
                    <Datagrid 
                        isAdmin={isAdmin} 
                        deleteResource={deleteResource} 
                        configurable={configurable} 
                        readonly={readonly}
                        EditButton={EditButton ? <EditButton isAdmin={isAdmin} /> : null} 
                    />
                </CommonList>
            </InlineEditProvider>
        );
    }

    const Edit = Inputs && (() => {
        const isAdmin = useIsAdmin();

        return (
            <CommonEdit resource={editResource}>
                <Inputs isAdmin={isAdmin} isCreate={false} />
            </CommonEdit>
        );
    })

    const Create = Inputs && (() => {
        const isAdmin = useIsAdmin();

        return (
            <CommonCreate resource={editResource}>
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