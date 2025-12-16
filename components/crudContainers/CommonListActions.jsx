import { useMemo, useContext } from 'react';
import { CreateButton, TopToolbar, FilterButton, useListContext, useResourceContext, useResourceDefinition, FilterContext, SelectColumnsButton } from 'react-admin';
import { ResourceImportButton } from '@shared/components/crudContainers/ResourceImportButton';
import { ResourceExportButton } from './ResourceExportButton';
import { CreateInDialogButton } from '@shared/components/dialogs/CreateInDialogButton';

export const CommonListActions = ({ importer, configurable, children, inlineCreate = false, CreateInputs, dialogCreateTitle, ...props }) => {
    const {
        sort,
        filterValues,
        exporter,
        total,
        refetch,
    } = useListContext(props);
    const resource = useResourceContext(props);
    const { hasCreate } = useResourceDefinition(props);
    const filters = useContext(FilterContext);
    const { hasCreate: _, ...restProps } = props;

    return useMemo(
        () => (
            <TopToolbar {...restProps}>
                {filters && <FilterButton />}
                {hasCreate && (
                    inlineCreate ? (
                        <CreateInDialogButton
                            Inputs={CreateInputs}
                            resource={resource}
                            title={dialogCreateTitle}
                        />
                    ) : (
                        <CreateButton />
                    )
                )}
                {children}
                {configurable && <SelectColumnsButton />}
                {exporter !== false && (
                    <ResourceExportButton
                        disabled={total === 0}
                        resource={resource}
                        sort={sort}
                        filterValues={filterValues}
                    />
                )}
                {importer?.fields && (
                    <ResourceImportButton
                        resource={resource}
                        refetch={refetch}
                        fields={importer.fields}
                        datagrid={importer.datagrid}
                    />
                )}
                {importer?.updateFields && (
                    <ResourceImportButton
                        resource={resource}
                        refetch={refetch}
                        fields={importer.updateFields}
                        datagrid={importer.datagrid}
                        update
                    />
                )}
            </TopToolbar>
        ),
        /* eslint-disable react-hooks/exhaustive-deps */
        [
            resource,
            filterValues,
            filters,
            total,
            sort,
            exporter,
            hasCreate,
            inlineCreate,
            CreateInputs,
            dialogCreateTitle,
        ]
    );
}
