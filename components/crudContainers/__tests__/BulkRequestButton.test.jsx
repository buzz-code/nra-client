import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BulkRequestButton } from '../BulkRequestButton';

const mockSetRequestValues = jest.fn();
let mockCachedValues = {};

jest.mock('react-admin', () => ({
    Button: ({ label, onClick, children }) => <button onClick={onClick}>{label}{children}</button>,
    Form: ({ children, onSubmit, defaultValues }) => (
        <form
            data-testid="form"
            data-default-values={JSON.stringify(defaultValues)}
            onSubmit={(e) => { e.preventDefault(); onSubmit({ field: 'value' }); }}
        >
            {children}
        </form>
    ),
    SaveButton: ({ label }) => <button type="submit">{label}</button>,
    useTranslate: () => (key) => key,
    useStore: () => [mockCachedValues, mockSetRequestValues],
    useResourceContext: () => 'resource',
    useRefresh: () => jest.fn(),
}));

const renderAndSubmit = (props, mutate = jest.fn()) => {
    render(
        <BulkRequestButton label="פעולה" name="action" mutate={mutate} {...props}>
            <input />
        </BulkRequestButton>
    );
    fireEvent.click(screen.getByText('פעולה'));
    const form = screen.getByTestId('form');
    const defaultValues = JSON.parse(form.getAttribute('data-default-values'));
    fireEvent.submit(form);
    return { mutate, defaultValues };
};

describe('BulkRequestButton', () => {
    beforeEach(() => {
        mockSetRequestValues.mockClear();
        mockCachedValues = { field: 'cached' };
    });

    it('opens with the cached values and caches the submitted values by default', () => {
        const { mutate, defaultValues } = renderAndSubmit({});
        expect(defaultValues).toEqual({ field: 'cached' });
        expect(mockSetRequestValues).toHaveBeenCalledWith({ field: 'value' });
        expect(mutate).toHaveBeenCalledWith({ 'extra.field': 'value' }, expect.anything());
    });

    it('opens with defaultRequestValues and does not cache when cacheValues is false', () => {
        const { mutate, defaultValues } = renderAndSubmit({ cacheValues: false, defaultRequestValues: { field: 'default' } });
        expect(defaultValues).toEqual({ field: 'default' });
        expect(mockSetRequestValues).not.toHaveBeenCalled();
        expect(mutate).toHaveBeenCalledWith({ 'extra.field': 'value' }, expect.anything());
    });

    it('keeps the dialog open when the request fails', async () => {
        const mutate = jest.fn((data, options) => options.onSettled());
        renderAndSubmit({}, mutate);
        expect(mutate).toHaveBeenCalled();
        // longer than the dialog's close transition
        await new Promise((resolve) => setTimeout(resolve, 500));
        expect(screen.getByTestId('form')).toBeInTheDocument();
    });

    it('closes the dialog when the request succeeds', async () => {
        const mutate = jest.fn((data, options) => { options.onSuccess(); options.onSettled(); });
        renderAndSubmit({}, mutate);
        await waitFor(() => expect(screen.queryByTestId('form')).not.toBeInTheDocument());
    });
});
