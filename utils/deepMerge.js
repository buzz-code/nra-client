export const deepMerge = (objA, objB) => {
    if (!objA || typeof objA != 'object') {
        return objB;
    }

    const res = JSON.parse(JSON.stringify(objA));
    for (const key in objB) {
        res[key] = deepMerge(objA[key], objB[key]);
    }
    return res;
}