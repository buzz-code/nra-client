export const defaultSortBy = { field: 'name', order: 'ASC' };

export const getDynamicFilter = (dynamicFilter, fullValues) => {
    const res = {};
    for (const key in dynamicFilter) {
        if (Object.hasOwnProperty.call(dynamicFilter, key)) {
            const value = fullValues[key];
            if (value) {
                res[key] = value;
            }
        }
    }
    return res;
}