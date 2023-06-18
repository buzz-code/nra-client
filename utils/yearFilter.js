const startOfYear = new Date('2000-08-16');

const getCurrentGregorianYear = () => {
    const now = new Date();
    const year = now.getFullYear();
    const isNextYear = now.getMonth() > startOfYear.getMonth() ||
        now.getMonth() === startOfYear.getMonth() && now.getDate() >= startOfYear.getDate();
    return year + (isNextYear ? 1 : 0);
}

export const getCurrentHebrewYear = () => {
    const gregorianYear = getCurrentGregorianYear();
    return gregorianYear + 3760;
}

const tensLetterArr = [
    "י",
    "כ",
    "ל",
    "מ",
    "נ",
    "ס",
    "ע",
    "פ",
    "צ",
];
const getYearName = (year) => {
    const tensDigit = Math.floor((year % 100) / 10);
    const onesDigit = year % 10;
    const tensLetter = tensLetterArr[tensDigit - 1];
    const onesLetter = String.fromCharCode('א'.charCodeAt(0) + onesDigit - 1);
    return `תש${tensLetter}"${onesLetter}`;
}

const getYearChoices = () => {
    const startYear = 5783;
    const endYear = getCurrentHebrewYear();

    const choices = [];
    for (let year = startYear; year <= endYear; year++) {
        choices.push({
            id: year,
            name: getYearName(year),
        });
    }
    return choices;
}

export const yearChoices = getYearChoices();

export const defaultYearFilter = {
    year: getCurrentHebrewYear(),
};
