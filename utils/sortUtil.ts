import { SortPayload } from 'react-admin';

export type SortOrder = 'ASC' | 'DESC';
export type SortLevel = { field: string; order: SortOrder };

// react-admin keeps a single { field, order } sort (also in the URL). A multi-level
// sort is stored in those same two strings as comma-separated lists, e.g.
// { field: 'klass.order,teacher.name', order: 'ASC,DESC' }, so it survives
// reloads and shared links; the dataProvider expands it back into levels.
const SEPARATOR = ',';

export const parseSort = (sort?: Partial<SortPayload> | null): SortLevel[] => {
    if (!sort?.field) {
        return [];
    }
    const fields = sort.field.split(SEPARATOR).filter(Boolean);
    const orders = String(sort.order ?? 'ASC').split(SEPARATOR);
    return fields.map((field, index) => ({
        field,
        order: (orders[index] ?? orders[0]) === 'DESC' ? 'DESC' : 'ASC',
    }));
};

export const serializeSort = (levels: SortLevel[]): SortPayload => ({
    field: levels.map(({ field }) => field).join(SEPARATOR),
    order: levels.map(({ order }) => order).join(SEPARATOR) as SortOrder,
});
