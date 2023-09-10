import { useMemo } from 'react';
import { ReferenceInput, useListContext } from 'react-admin';
import CommonAutocompleteInput from './CommonAutocompleteInput';

const defaultOrder = { field: 'name', order: 'ASC' };

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
        <ReferenceInput label={label} source={source} reference={reference} alwaysOn={alwaysOn} filter={filter} sort={defaultOrder}>
            <CommonAutocompleteInput label={label} />
        </ReferenceInput>
    );
};

export const filterByUserId = {
    userId: 'userId',
};

export const filterByUserIdAndYear = {
    ...filterByUserId,
    year: 'year',
}
