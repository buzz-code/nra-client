import React from 'react';
import { render, screen } from '@testing-library/react';
import { MaintenancePage } from './MaintenancePage';
import authProvider from '@shared/providers/authProvider';

// Mock authProvider
jest.mock('@shared/providers/authProvider', () => ({
    getMaintenanceInfo: jest.fn(),
}));

// Mock useTranslate
jest.mock('react-admin', () => ({
    useTranslate: () => (key) => {
        const translations = {
            'ra.page.maintenance.title': 'המערכת בתחזוקה',
            'ra.page.maintenance.default_message': 'אנו מבצעים עבודות תחזוקה כדי לשפר את המערכת.',
            'ra.page.maintenance.thank_you': 'תודה על סבלנותך.',
        };
        return translations[key] || key;
    },
}));

describe('MaintenancePage', () => {
    beforeEach(() => {
        authProvider.getMaintenanceInfo.mockReturnValue(null);
    });

    it('renders maintenance page with default message', () => {
        render(<MaintenancePage />);
        expect(screen.getByText('המערכת בתחזוקה')).toBeInTheDocument();
    });

    it('renders custom message from authProvider', () => {
        const customMessage = 'אנו משדרגים את המערכת';
        authProvider.getMaintenanceInfo.mockReturnValue({
            active: true,
            message: customMessage,
        });
        
        render(<MaintenancePage />);
        expect(screen.getByText(customMessage)).toBeInTheDocument();
    });

    it('renders engineering icons', () => {
        const { container } = render(<MaintenancePage />);

        // Check for SVG icons (MUI icons render as SVG)
        const svgs = container.querySelectorAll('svg');
        expect(svgs.length).toBeGreaterThan(0);
    });

    it('renders animated dots', () => {
        const { container } = render(<MaintenancePage />);

        // Check that dots are rendered (3 divs with animation styles)
        const dots = container.querySelectorAll('div[class*="css-"]');
        expect(dots.length).toBeGreaterThan(2); // At least 3 dots
    });
});
