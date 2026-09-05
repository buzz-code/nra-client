import React from 'react';
import { render, screen } from '@testing-library/react';
import CommonDateTimeField from '../CommonDateTimeField';

let mockRecord;

jest.mock('react-admin', () => ({
    // Stand in for react-admin's real DateField just enough to prove
    // CommonDateTimeField forces 24h/no-seconds/no-AM-PM formatting on it.
    DateField: ({ source, locales, options }) => {
        const value = mockRecord[source];
        const text = new Date(value).toLocaleString(locales, options);
        return <span>{text}</span>;
    },
}));

describe('CommonDateTimeField', () => {
    it('renders 24-hour time with no seconds and no AM/PM', () => {
        mockRecord = { createdAt: '2026-09-05T21:05:34Z' };
        render(<CommonDateTimeField source="createdAt" />);
        const text = screen.getByText(/\d{2}:\d{2}/).textContent;
        expect(text).not.toMatch(/AM|PM/i);
        expect(text).not.toMatch(/:\d{2}:\d{2}/); // no seconds group after minutes
    });
});
