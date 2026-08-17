import { render, screen } from '@testing-library/react';

const mockUseGetIdentity = jest.fn();

jest.mock('react-admin', () => ({
    useGetIdentity: () => mockUseGetIdentity(),
}));

const Tutorial = require('../Tutorial').default;

describe('Tutorial', () => {
    it('interpolates the user personal yemot webhook token into the ext.ini snippet', () => {
        mockUseGetIdentity.mockReturnValue({
            data: { additionalData: { yemotWebhookToken: 'abc123' } },
        });
        render(<Tutorial />);
        expect(screen.getByText(/handle-call\/abc123/)).toBeInTheDocument();
    });

    it('falls back to the legacy link and shows a loading hint when the token is not loaded yet', () => {
        mockUseGetIdentity.mockReturnValue({ data: undefined });
        render(<Tutorial />);
        expect(screen.getByText(/handle-call$/m)).toBeInTheDocument();
        expect(screen.getByText(/הקישור האישי שלכם ייטען/)).toBeInTheDocument();
    });
});
