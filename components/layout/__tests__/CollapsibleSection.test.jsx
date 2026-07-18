import { render, screen, fireEvent } from '@testing-library/react';
import { CollapsibleSection } from '../CollapsibleSection';

describe('CollapsibleSection', () => {
    it('renders the title and is collapsed by default', () => {
        render(<CollapsibleSection title="פרטים"><div>תוכן</div></CollapsibleSection>);
        expect(screen.getByText('פרטים')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'פרטים', expanded: false })).toBeInTheDocument();
    });

    it('expands on click', () => {
        render(<CollapsibleSection title="פרטים"><div>תוכן</div></CollapsibleSection>);
        fireEvent.click(screen.getByRole('button', { name: 'פרטים' }));
        expect(screen.getByRole('button', { name: 'פרטים', expanded: true })).toBeInTheDocument();
    });

    it('passes accordion props like defaultExpanded through', () => {
        render(<CollapsibleSection title="פרטים" defaultExpanded><div>תוכן</div></CollapsibleSection>);
        expect(screen.getByRole('button', { name: 'פרטים', expanded: true })).toBeInTheDocument();
    });

    it('supports a custom title typography variant', () => {
        render(<CollapsibleSection title="כותרת" titleVariant="subtitle2"><div /></CollapsibleSection>);
        expect(screen.getByText('כותרת')).toHaveClass('MuiTypography-subtitle2');
    });

    it('wires id into aria-controls/id when passed, for a list of sections', () => {
        render(<CollapsibleSection title="פרטים" id="42"><div /></CollapsibleSection>);
        const summary = screen.getByRole('button', { name: 'פרטים' });
        expect(summary).toHaveAttribute('id', '42-header');
        expect(summary).toHaveAttribute('aria-controls', '42-content');
    });

    it('accepts titleColor without affecting rendering', () => {
        render(<CollapsibleSection title="פרטים" titleColor="text.secondary"><div /></CollapsibleSection>);
        expect(screen.getByText('פרטים')).toBeInTheDocument();
    });

    it('accepts summarySx/detailsSx without affecting rendering', () => {
        render(
            <CollapsibleSection title="פרטים" summarySx={{ minHeight: 0 }} detailsSx={{ px: 0 }}>
                <div>תוכן</div>
            </CollapsibleSection>,
        );
        expect(screen.getByRole('button', { name: 'פרטים' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'פרטים' }));
        expect(screen.getByText('תוכן')).toBeVisible();
    });
});
