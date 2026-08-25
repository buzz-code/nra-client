// When a delete is rejected because another resource still references the row, the server
// (all-exceptions.filter.ts in nra-server) responds 409 with `resource` naming the blocking
// API resource (e.g. 'report_group'), plus a generic fallback message. Rewrite that message
// using the project's own domainTranslations, which already carries the Hebrew resource name.
const translateForeignKeyError = (error, domainTranslations) => {
    const resource = error?.body?.resource;
    const translation = resource && domainTranslations?.resources?.[resource]?.name;
    const [label] = translation ? translation.split(' |||| ') : [];
    if (label) {
        error.message = `לא ניתן למחוק רשומה זו - קיימות רשומות מסוג "${label}" המשויכות אליה. יש למחוק אותן תחילה.`;
    }
    throw error;
};

export const withForeignKeyErrorTranslation = (dataProvider, domainTranslations) => ({
    ...dataProvider,
    delete: (resource, params) =>
        dataProvider.delete(resource, params).catch((error) => translateForeignKeyError(error, domainTranslations)),
    deleteMany: (resource, params) =>
        dataProvider.deleteMany(resource, params).catch((error) => translateForeignKeyError(error, domainTranslations)),
});
