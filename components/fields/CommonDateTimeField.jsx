import { DateField } from 'react-admin';

// 24-hour clock, no seconds, no AM/PM - Intl drops any date/time part not
// listed here, so day/month/year have to be spelled out alongside hour/minute.
const dateTimeOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
};

const CommonDateTimeField = (props) => (
    <DateField showDate showTime locales="he-IL" options={dateTimeOptions} {...props} />
);

export default CommonDateTimeField;
