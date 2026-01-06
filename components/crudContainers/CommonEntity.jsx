import { useMemo } from 'react';
import { useIsAdmin } from '@shared/utils/permissionsUtil';
import { CommonList } from '@shared/components/crudContainers/CommonList';
import { CommonEdit } from '@shared/components/crudContainers/CommonEdit';
import { CommonCreate } from '@shared/components/crudContainers/CommonCreate';
import { EmptyPage } from './EmptyPage';
import { filterArrayByParams } from '@shared/utils/filtersUtil';
import { usePermissions } from 'react-admin';
import { EditInDialogButton } from '@shared/components/dialogs/EditInDialogButton';
import { InlineEditProvider } from '@shared/components/dialogs/InlineEditContext';

/**
 * Factory function to generate List, Edit, and Create components for a resource
 * 
 * @param {Object} config - Configuration object
 * @param {string} config.resource - Resource name
 * @param {React.Component} config.Datagrid - Datagrid component for list view
 * @param {React.Component} config.Inputs - Form inputs component for edit/create
 * @param {string|Function} config.Representation - Record representation (default: 'id')
 * @param {Array} config.filters - Filter components for list view
 * @param {Object} config.filterDefaultValues - Default filter values
 * @param {Object} config.importer - Import configuration
 * @param {boolean} config.exporter - Enable export functionality (default: true)
 * @param {string} config.editResource - Custom resource name for edit (optional)
 * @param {string} config.deleteResource - Custom resource name for delete (optional)
 * @param {Object} config.sort - Default sort configuration
 * @param {boolean} config.configurable - Enable column configuration (default: true)
 * @param {React.ReactNode} config.additionalListActions - Additional action buttons for list
 * @param {boolean} config.inlineEdit - Enable inline editing in dialogs (default: false)
 * @param {boolean} config.inlineCreate - Enable inline creation in dialogs (default: false)
 * @param {string} config.dialogEditTitle - Custom title for edit dialog
 * @param {string} config.dialogCreateTitle - Custom title for create dialog
 * @returns {Object} Object with list, edit, create components and recordRepresentation
 */
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

    const List = ({ filter = {} }) => {
        const isAdmin = useIsAdmin();
        const { permissions } = usePermissions();
        const filtersArr = filterArrayByParams(filters, { isAdmin, permissions });

        // Memoize EditButton to prevent unnecessary re-renders
        const EditButton = useMemo(() => {
            if (!inlineEdit || !Inputs) return null;
            
            return (
                <EditInDialogButton 
                    Inputs={(props) => <Inputs {...props} isAdmin={isAdmin} />}
                    resource={editResource || resource}
                    title={dialogEditTitle}
                />
            );
        }, [inlineEdit, Inputs, isAdmin, editResource, resource, dialogEditTitle]);

        // Memoize context value to prevent unnecessary re-renders
        const inlineEditContextValue = useMemo(() => {
            if (!inlineCreate || !Inputs) return null;
            
            return {
                inlineCreate: true,
                CreateInputs: (props) => <Inputs {...props} isAdmin={isAdmin} />,
                dialogCreateTitle,
            };
        }, [inlineCreate, Inputs, isAdmin, dialogCreateTitle]);

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
                        EditButton={EditButton} 
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