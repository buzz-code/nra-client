/**
 * Returns the color for the first threshold whose min <= val, or undefined.
 * @param {unknown} val
 * @param {Array<{min: number, color: string}>} thresholds - sorted high→low
 * @returns {string|undefined}
 */
export function getColorForValue(val, thresholds) {
    if (!thresholds?.length) return undefined;
    const n = Number(val);
    if (isNaN(n) || val === null || val === undefined || val === '') return undefined;
    return thresholds.find(t => n >= t.min)?.color;
}
