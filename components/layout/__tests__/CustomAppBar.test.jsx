import { render, screen } from '@testing-library/react';
import { AdminContext } from 'react-admin';
import CustomAppBar from '../CustomAppBar';

jest.mock('../YearSelector', () => () => <span>year-selector</span>);

const renderBar = (props) => render(<AdminContext><CustomAppBar {...props} /></AdminContext>);

describe('CustomAppBar', () => {
    it('shows the year picker by default', () => {
        renderBar();
        expect(screen.getByText('year-selector')).toBeInTheDocument();
    });

    it('shows the given content instead of the year picker', () => {
        renderBar({ content: <span>game-switcher</span> });
        expect(screen.getByText('game-switcher')).toBeInTheDocument();
        expect(screen.queryByText('year-selector')).not.toBeInTheDocument();
    });

    it('shows nothing next to the title for null content', () => {
        renderBar({ content: null });
        expect(screen.queryByText('year-selector')).not.toBeInTheDocument();
    });
});
