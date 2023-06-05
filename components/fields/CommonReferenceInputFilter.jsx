import { useMemo } from 'react';
import { ReferenceInput, AutocompleteInput, useListContext } from 'react-admin';

const filterToQuery = searchText => ({ 'name:$contL': searchText });

export const CommonReferenceInputFilter = ({ label, source, reference, alwaysOn, dynamicFilter }) => {
    const { filterValues } = useListContext();
    const filter = useMemo(() => {
        const res = {};
        for (const key in dynamicFilter) {
            if (Object.hasOwnProperty.call(dynamicFilter, key)) {
                const value = filterValues[key];
                if (value) {
                    res[key] = value;
                }
            }
        }
        return res;
    }, [dynamicFilter, filterValues]);

    return (
        <ReferenceInput label={label} source={source} reference={reference} alwaysOn={alwaysOn} filter={filter}>
            <AutocompleteInput label={label} filterToQuery={filterToQuery} />
        </ReferenceInput>
    );
};
