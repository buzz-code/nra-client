import { ReferenceInput, AutocompleteInput } from 'react-admin';

const filterToQuery = searchText => ({ 'name:$contL': searchText });

export const CommonReferenceInput = ({ label, source, reference, optionValue, alwaysOn }) => (
    <ReferenceInput label={label} source={source} reference={reference} alwaysOn={alwaysOn}>
        <AutocompleteInput filterToQuery={filterToQuery} optionValue={optionValue} />
    </ReferenceInput>
);
