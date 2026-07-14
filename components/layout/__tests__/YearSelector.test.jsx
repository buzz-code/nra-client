import { render, screen, fireEvent } from '@testing-library/react';
import YearSelector from '../YearSelector';
import { defaultYearFilter, yearChoices } from '@shared/utils/yearFilter';

describe('YearSelector', () => {
    afterEach(() => {
        localStorage.removeItem('year');
    });

    it('shows the current year as a button, and switches it via the menu like LocalesMenuButton', () => {
        const reload = jest.fn();
        Object.defineProperty(window, 'location', { value: { reload }, writable: true });

        const currentChoice = yearChoices.find((choice) => choice.id === defaultYearFilter.year);
        const otherChoice = yearChoices.find((choice) => choice.id !== defaultYearFilter.year);

        render(<YearSelector />);
        fireEvent.click(screen.getByRole('button', { name: currentChoice.name }));
        fireEvent.click(screen.getByRole('menuitem', { name: otherChoice.name }));

        expect(localStorage.getItem('year')).toBe(otherChoice.id.toString());
        expect(reload).toHaveBeenCalled();
    });
});
