import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import { HomePage } from '../HomePage';

const renderHomePage = (props) => render(<HomePage {...props} />, { wrapper: MemoryRouter });

describe('HomePage', () => {
  it('renders the hero content', () => {
    renderHomePage({ eyebrow: 'תג', appTitle: 'שם המערכת', tagline: 'תיאור קצר' });
    expect(screen.getByText('תג')).toBeInTheDocument();
    expect(screen.getByText('שם המערכת')).toBeInTheDocument();
    expect(screen.getByText('תיאור קצר')).toBeInTheDocument();
  });

  it('renders feature cards with icons when provided', () => {
    renderHomePage({
      appTitle: 'שם',
      features: [{ icon: CheckIcon, title: 'תכונה', text: 'תיאור תכונה' }],
    });
    expect(screen.getByText('תכונה')).toBeInTheDocument();
    expect(screen.getByText('תיאור תכונה')).toBeInTheDocument();
    expect(screen.getByTestId('CheckIcon')).toBeInTheDocument();
  });

  it('omits the "how it works" and closing sections when not provided', () => {
    renderHomePage({ appTitle: 'שם' });
    expect(screen.queryByText('איך זה עובד')).not.toBeInTheDocument();
  });

  it('renders numbered steps and the closing CTA when provided', () => {
    renderHomePage({
      appTitle: 'שם',
      steps: [{ title: 'שלב ראשון', text: 'תיאור שלב' }],
      closingTitle: 'מוכנים להתחיל?',
      ctaLabel: 'כניסה',
    });
    expect(screen.getByText('איך זה עובד')).toBeInTheDocument();
    expect(screen.getByText('שלב ראשון')).toBeInTheDocument();
    expect(screen.getByText('מוכנים להתחיל?')).toBeInTheDocument();
    expect(screen.getAllByText('כניסה').length).toBeGreaterThan(1); // hero + closing CTA buttons
  });
});
