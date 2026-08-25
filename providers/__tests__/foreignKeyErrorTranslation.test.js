import { withForeignKeyErrorTranslation } from '../foreignKeyErrorTranslation';

// Mimics a polyglot-backed i18nProvider: known keys translate, unknown ones echo the key back.
const buildI18nProvider = (translations) => ({
    translate: jest.fn((key) => translations[key] ?? key),
});

const buildError = (resource) => {
    const error = new Error('לא ניתן למחוק רשומה זו - קיימות רשומות מסוג "report group" המשויכות אליה. יש למחוק אותן תחילה.');
    error.body = { statusCode: 409, resource };
    return error;
};

describe('withForeignKeyErrorTranslation', () => {
    it('rewrites the message using i18nProvider.translate for the singular resource label', async () => {
        const i18nProvider = buildI18nProvider({ 'resources.report_group.name': 'קבוצת דיווח' });
        const dataProvider = { delete: jest.fn().mockRejectedValue(buildError('report_group')) };
        const wrapped = withForeignKeyErrorTranslation(dataProvider, i18nProvider);

        await expect(wrapped.delete('report_group', { id: 1 })).rejects.toThrow(
            'לא ניתן למחוק רשומה זו - קיימות רשומות מסוג "קבוצת דיווח" המשויכות אליה. יש למחוק אותן תחילה.',
        );
        expect(i18nProvider.translate).toHaveBeenCalledWith('resources.report_group.name', { smart_count: 1 });
    });

    it('rewrites deleteMany errors the same way', async () => {
        const i18nProvider = buildI18nProvider({ 'resources.report_group.name': 'קבוצת דיווח' });
        const dataProvider = { deleteMany: jest.fn().mockRejectedValue(buildError('report_group')) };
        const wrapped = withForeignKeyErrorTranslation(dataProvider, i18nProvider);

        await expect(wrapped.deleteMany('report_group', { ids: [1] })).rejects.toThrow(
            'לא ניתן למחוק רשומה זו - קיימות רשומות מסוג "קבוצת דיווח" המשויכות אליה. יש למחוק אותן תחילה.',
        );
    });

    it('leaves the server fallback message untouched when the resource has no translation', async () => {
        const i18nProvider = buildI18nProvider({});
        const dataProvider = { delete: jest.fn().mockRejectedValue(buildError('some_other_resource')) };
        const wrapped = withForeignKeyErrorTranslation(dataProvider, i18nProvider);

        await expect(wrapped.delete('some_other_resource', { id: 1 })).rejects.toThrow(
            'לא ניתן למחוק רשומה זו - קיימות רשומות מסוג "report group" המשויכות אליה. יש למחוק אותן תחילה.',
        );
    });

    it('passes through errors unrelated to a foreign key violation', async () => {
        const i18nProvider = buildI18nProvider({});
        const plainError = new Error('boom');
        const dataProvider = { delete: jest.fn().mockRejectedValue(plainError) };
        const wrapped = withForeignKeyErrorTranslation(dataProvider, i18nProvider);

        await expect(wrapped.delete('report_group', { id: 1 })).rejects.toThrow('boom');
    });

    it('preserves other dataProvider methods untouched', () => {
        const getList = jest.fn();
        const dataProvider = { getList, delete: jest.fn() };
        const wrapped = withForeignKeyErrorTranslation(dataProvider, buildI18nProvider({}));

        expect(wrapped.getList).toBe(getList);
    });
});
