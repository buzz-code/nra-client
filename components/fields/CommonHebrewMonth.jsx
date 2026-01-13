import { useRecordContext } from 'react-admin';
import get from 'lodash/get';
import { useMemo } from 'react';
import { getHebrewMonthName } from '@shared/utils/hebrew.util';

export const CommonHebrewMonth = ({ source, yearSource = 'year' }) => {
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
