import { getJewishMonthByIndex, getJewishMonthInHebrew } from 'jewish-date';

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
