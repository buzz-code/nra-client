import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const mockUseGetIdentity = jest.fn();
const mockUpdateSettings = jest.fn().mockResolvedValue({ success: true });
const mockGetIdentity = jest.fn().mockResolvedValue({});
const mockNotify = jest.fn();

jest.mock('react-admin', () => ({
    useGetIdentity: () => mockUseGetIdentity(),
    useDataProvider: () => ({ updateSettings: mockUpdateSettings }),
    useAuthProvider: () => ({ getIdentity: mockGetIdentity }),
    useNotify: () => mockNotify,
}));

const { YemotMigrationBanner } = require('../YemotMigrationBanner');

describe('YemotMigrationBanner', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUpdateSettings.mockResolvedValue({ success: true });
        mockGetIdentity.mockResolvedValue({});
    });

    it('renders nothing while identity is loading', () => {
        mockUseGetIdentity.mockReturnValue({ data: undefined });
        const { container } = render(<YemotMigrationBanner />);
        expect(container).toBeEmptyDOMElement();
    });

    it('renders nothing for a user who never configured a Yemot phone line', () => {
        mockUseGetIdentity.mockReturnValue({ data: { phoneNumber: null, additionalData: {} } });
        const { container } = render(<YemotMigrationBanner />);
        expect(container).toBeEmptyDOMElement();
    });

    it('renders nothing once yemotUrlMigrated is true', () => {
        mockUseGetIdentity.mockReturnValue({
            data: { phoneNumber: '035586526', additionalData: { yemotUrlMigrated: true } },
        });
        const { container } = render(<YemotMigrationBanner />);
        expect(container).toBeEmptyDOMElement();
    });

    it('shows the nag banner for a Yemot user not yet migrated', () => {
        mockUseGetIdentity.mockReturnValue({
            data: { phoneNumber: '035586526', additionalData: {} },
        });
        render(<YemotMigrationBanner />);
        expect(screen.getByText(/ext.ini/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'עדכנתי' })).toBeInTheDocument();
    });

    it('confirming saves the setting and refreshes identity', async () => {
        mockUseGetIdentity.mockReturnValue({
            data: { phoneNumber: '035586526', additionalData: {} },
        });
        render(<YemotMigrationBanner />);

        fireEvent.click(screen.getByRole('button', { name: 'עדכנתי' }));

        await waitFor(() => {
            expect(mockUpdateSettings).toHaveBeenCalledWith({ data: { yemotUrlMigrated: true } });
        });
        expect(mockGetIdentity).toHaveBeenCalledWith(true);
    });

    it('notifies on save failure', async () => {
        mockUpdateSettings.mockRejectedValue(new Error('boom'));
        mockUseGetIdentity.mockReturnValue({
            data: { phoneNumber: '035586526', additionalData: {} },
        });
        render(<YemotMigrationBanner />);

        fireEvent.click(screen.getByRole('button', { name: 'עדכנתי' }));

        await waitFor(() => {
            expect(mockNotify).toHaveBeenCalledWith('העדכון נכשל, נסו שוב', { type: 'error' });
        });
    });
});
