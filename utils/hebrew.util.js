import { getIndexByJewishMonth, getJewishMonthByIndex, getJewishMonthInHebrew, getJewishMonthsInOrder } from 'jewish-date';

export function getHebrewMonthName(year, monthIndex) {
    if (!year || !monthIndex) return '';
    try {
        const month = getJewishMonthByIndex(monthIndex, year);
        return getJewishMonthInHebrew(month);
    } catch (e) {
        console.error('Error getting Hebrew month name', e);
        return monthIndex;
    }
}

export function getHebrewMonthsList(year) {
    if (!year) return [];

    return getJewishMonthsInOrder(year)
        .map(month => ({ month, index: getIndexByJewishMonth(month) }))
        .filter(({ index }) => index > 0)
        .map(({ month, index }) => ({
            id: index,
            name: getJewishMonthInHebrew(month),
            index,
        }));
}
