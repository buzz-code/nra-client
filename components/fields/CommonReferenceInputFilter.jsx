import { defaultSortBy, getDynamicFilter } from '@shared/utils/referenceUtil';
import { useMemo } from 'react';
import { ReferenceInput, useListContext } from 'react-admin';
import CommonAutocompleteInput from './CommonAutocompleteInput';

export const CommonReferenceInputFilter = ({ label = undefined, source, reference, alwaysOn = {}, dynamicFilter = {}, sort = defaultSortBy, disabled = false }) => {
    const { filterValues } = useListContext();
    const filter = useMemo(() => getDynamicFilter(dynamicFilter, filterValues), [dynamicFilter, filterValues]);

    return (
        <ReferenceInput label={label} source={source} reference={reference} alwaysOn={alwaysOn} filter={filter} sort={sort} disabled={disabled}>
            <CommonAutocompleteInput label={label} disabled={disabled} />
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
