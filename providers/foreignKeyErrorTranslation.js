// When a delete is rejected because another resource still references the row, the server
// (all-exceptions.filter.ts in nra-server) responds 409 with `resource` naming the blocking
// API resource (e.g. 'report_group'), plus a generic fallback message. Rewrite that message
// via i18nProvider.translate, the same lookup useTranslate()/useGetResourceLabel() would do
// inside the app - respects the resource's existing 'singular |||| plural' translation.
const translateForeignKeyError = (error, i18nProvider) => {
    const resource = error?.body?.resource;
    if (resource) {
        const key = `resources.${resource}.name`;
        const label = i18nProvider.translate(key, { smart_count: 1 });
        if (label !== key) {
            error.message = `לא ניתן למחוק רשומה זו - קיימות רשומות מסוג "${label}" המשויכות אליה. יש למחוק אותן תחילה.`;
        }
    }
    throw error;
};

export const withForeignKeyErrorTranslation = (dataProvider, i18nProvider) => ({
    ...dataProvider,
    delete: (resource, params) =>
        dataProvider.delete(resource, params).catch((error) => translateForeignKeyError(error, i18nProvider)),
    deleteMany: (resource, params) =>
        dataProvider.deleteMany(resource, params).catch((error) => translateForeignKeyError(error, i18nProvider)),
});
