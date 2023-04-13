import { AutocompleteInput, useGetResourceLabel, useResourceDefinitions } from 'react-admin';

export const CommonEntityNameInput = ({ source, disabled }) => {
    const resources = useResourceDefinitions();
    const getResourceLabel = useGetResourceLabel();
    const resourceChoices = Object.keys(resources)
        .map(key => ({ id: key, name: getResourceLabel(key) }))

    return (
        <AutocompleteInput source={source} choices={resourceChoices} disabled={disabled} />
    )
}
