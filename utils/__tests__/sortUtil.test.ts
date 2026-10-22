import { parseSort, serializeSort } from '../sortUtil';

describe('sortUtil', () => {
    it('parses a single-field sort as one level', () => {
        expect(parseSort({ field: 'name', order: 'DESC' })).toEqual([{ field: 'name', order: 'DESC' }]);
    });

    it('parses comma-separated fields and orders into levels', () => {
        expect(parseSort({ field: 'klass.order,teacher.name', order: 'ASC,DESC' as any })).toEqual([
            { field: 'klass.order', order: 'ASC' },
            { field: 'teacher.name', order: 'DESC' },
        ]);
    });

    it('reuses the first order when fewer orders than fields are given', () => {
        expect(parseSort({ field: 'a,b', order: 'DESC' })).toEqual([
            { field: 'a', order: 'DESC' },
            { field: 'b', order: 'DESC' },
        ]);
    });

    it('treats anything but DESC as ASC', () => {
        expect(parseSort({ field: 'a', order: 'bogus' as any })).toEqual([{ field: 'a', order: 'ASC' }]);
    });

    it('returns no levels without a field', () => {
        expect(parseSort(undefined)).toEqual([]);
        expect(parseSort({ field: '', order: 'ASC' })).toEqual([]);
    });

    it('serializes levels back to a react-admin sort and round-trips', () => {
        const levels = [{ field: 'klass.order', order: 'ASC' as const }, { field: 'teacher.name', order: 'DESC' as const }];
        const sort = serializeSort(levels);
        expect(sort).toEqual({ field: 'klass.order,teacher.name', order: 'ASC,DESC' });
        expect(parseSort(sort)).toEqual(levels);
    });
});
