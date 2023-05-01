import { AutocompleteInput, useGetResourceLabel, useResourceDefinitions } from 'react-admin';

export const CommonEntityNameInput = ({ source, disabled, allowedEntities = [] }) => {
    const resources = useResourceDefinitions();
    const getResourceLabel = useGetResourceLabel();
    const resourceChoices = Object.keys(resources)
        .filter(key => allowedEntities.length === 0 || allowedEntities.includes(key))
        .map(key => ({ id: key, name: getResourceLabel(key) }))

    return (
        <AutocompleteInput source={source} choices={resourceChoices} disabled={disabled} />
    )
}
