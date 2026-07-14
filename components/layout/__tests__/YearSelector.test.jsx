import { render, screen, fireEvent } from '@testing-library/react';
import YearSelector from '../YearSelector';
import { defaultYearFilter } from '@shared/utils/yearFilter';

describe('YearSelector', () => {
    afterEach(() => {
        localStorage.removeItem('year');
    });

    it('shows the current default year and switches it on change', () => {
        const reload = jest.fn();
        Object.defineProperty(window, 'location', { value: { reload }, writable: true });

        render(<YearSelector />);
        const select = screen.getByRole('combobox');
        expect(select).toHaveTextContent(defaultYearFilter.year.toString());

        const otherYear = defaultYearFilter.year - 1;
        fireEvent.change(select, { target: { value: otherYear } });

        expect(localStorage.getItem('year')).toBe(otherYear.toString());
        expect(reload).toHaveBeenCalled();
    });
});
