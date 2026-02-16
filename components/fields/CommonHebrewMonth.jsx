import { useListContext, useRecordContext } from 'react-admin';
import get from 'lodash/get';
import { useMemo } from 'react';
import { getHebrewMonthName, getHebrewMonthsList } from '@shared/utils/hebrew.util';
import { getCurrentHebrewYear } from '@shared/utils/yearFilter';
import CommonAutocompleteInput from './CommonAutocompleteInput';

export const CommonHebrewMonthField = ({ source, yearSource = 'year' }) => {
    const record = useRecordContext();
    const value = get(record, source);
    const year = get(record, yearSource);

    const hebrewMonth = useMemo(() => {
        if (!value) return null;
        return getHebrewMonthName(year, value);
    }, [year, value]);

    if (!value) {
        return null;
    }

    return (
        <span>{hebrewMonth}</span>
    );
}

export const CommonHebrewMonthInput = ({ source, year, ...props }) => {
    const selectedYear = Number.isFinite(Number(year)) && Number(year) > 0 ? Number(year) : getCurrentHebrewYear();

    const monthChoices = useMemo(() => {
        return getHebrewMonthsList(selectedYear).map(({ index, name }) => ({ id: index, name }));
    }, [selectedYear]);

    return <CommonAutocompleteInput source={source} choices={monthChoices} {...props} />;
}

export const CommonHebrewMonthInputFilter = ({ source, yearSource = 'year', ...props }) => {
    const { filterValues } = useListContext();

    const selectedYear = useMemo(() => {
        const yearFromFilter = Number(get(filterValues, yearSource));
        return Number.isFinite(yearFromFilter) && yearFromFilter > 0 ? yearFromFilter : getCurrentHebrewYear();
    }, [filterValues, yearSource]);

    return <CommonHebrewMonthInput source={source} year={selectedYear} {...props} />;
}

let didWarnDeprecatedCommonHebrewMonth = false;

export const CommonHebrewMonth = (props) => {
    if (!didWarnDeprecatedCommonHebrewMonth) {
        console.warn('[DEPRECATED] CommonHebrewMonth is deprecated. Use CommonHebrewMonthField instead.');
        didWarnDeprecatedCommonHebrewMonth = true;
    }

    return <CommonHebrewMonthField {...props} />;
}
