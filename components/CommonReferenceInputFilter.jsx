import { ReferenceInput, AutocompleteInput } from 'react-admin';

const filterToQuery = searchText => ({ 'name:$contL': searchText });

export const CommonReferenceInputFilter = ({ label, source, reference, alwaysOn }) => (
    <ReferenceInput label={label} source={source} reference={reference} alwaysOn={alwaysOn}>
        <AutocompleteInput filterToQuery={filterToQuery} />
    </ReferenceInput>
);
