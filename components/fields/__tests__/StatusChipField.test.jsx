import React from 'react';
import { render, screen } from '@testing-library/react';
import StatusChipField from '../StatusChipField';

let mockRecord;

jest.mock('react-admin', () => ({
    useRecordContext: () => mockRecord,
    useTranslate: () => (key) => ({ 'ra.boolean.true': 'כן', 'ra.boolean.false': 'לא' }[key] || key),
}));

describe('StatusChipField', () => {
    it('labels a true value with the translated boolean and the success color by default', () => {
        mockRecord = { isOpen: true };
        render(<StatusChipField source="isOpen" />);
        expect(screen.getByText('כן').closest('.MuiChip-root')).toHaveClass('MuiChip-colorSuccess');
    });

    it('labels a false value with the translated boolean and the default color', () => {
        mockRecord = { isOpen: false };
        render(<StatusChipField source="isOpen" />);
        expect(screen.getByText('לא').closest('.MuiChip-root')).toHaveClass('MuiChip-colorDefault');
    });

    it('lets callers pick a different color for the true state (e.g. error for hasError)', () => {
        mockRecord = { hasError: true };
        render(<StatusChipField source="hasError" trueColor="error" />);
        expect(screen.getByText('כן').closest('.MuiChip-root')).toHaveClass('MuiChip-colorError');
    });

    it('reads nested sources via lodash get', () => {
        mockRecord = { data: { isOpen: true } };
        render(<StatusChipField source="data.isOpen" />);
        expect(screen.getByText('כן')).toBeInTheDocument();
    });
});
