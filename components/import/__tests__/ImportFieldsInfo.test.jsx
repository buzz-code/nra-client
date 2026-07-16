import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImportFieldsInfo } from '../ImportFieldsInfo';

const translations = {
    'resources.student.fields.first_name': 'שם פרטי',
    'resources.student.fields.last_name': 'שם משפחה',
    'ra.action.import_fields_info': 'עמודות לייבוא',
    'ra.action.download_template': 'הורדת קובץ לדוגמה',
    'ra.action.cancel': 'ביטול',
};

jest.mock('react-admin', () => ({
    Button: ({ label, onClick }) => <button onClick={onClick}>{translations[label] ?? label}</button>,
    useTranslate: () => (key, options) => translations[key] ?? options?._ ?? key,
}));

const mockWriteFile = jest.fn();
jest.mock('xlsx', () => ({
    utils: {
        aoa_to_sheet: jest.fn(() => ({})),
        book_new: jest.fn(() => ({})),
        book_append_sheet: jest.fn(),
    },
    writeFile: (...args) => mockWriteFile(...args),
}));

describe('ImportFieldsInfo', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders nothing when there are no fields', () => {
        const { container } = render(<ImportFieldsInfo resource="student" fields={[]} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('shows the translated field labels, in order, when opened', () => {
        render(<ImportFieldsInfo resource="student" fields={['first_name', 'last_name', 'unknown_key']} />);

        fireEvent.click(screen.getByRole('button', { name: 'עמודות לייבוא' }));

        expect(screen.getByText('1. שם פרטי')).toBeInTheDocument();
        expect(screen.getByText('2. שם משפחה')).toBeInTheDocument();
        expect(screen.getByText('3. unknown_key')).toBeInTheDocument();
    });

    it('downloads a template with the translated labels as the header row', () => {
        render(<ImportFieldsInfo resource="student" fields={['first_name', 'last_name']} />);

        fireEvent.click(screen.getByRole('button', { name: 'עמודות לייבוא' }));
        fireEvent.click(screen.getByText('הורדת קובץ לדוגמה'));

        expect(mockWriteFile).toHaveBeenCalledWith(expect.anything(), 'student.xlsx');
    });
});
