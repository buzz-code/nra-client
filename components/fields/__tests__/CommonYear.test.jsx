import { CommonYearField, CommonYearInputFilter } from '../CommonYear';

describe('CommonYearField', () => {
    it('exposes source on the element itself so Datagrid can resolve the column label and sort target', () => {
        // Datagrid reads field.props.source directly off the unrendered element
        // (see DatagridHeaderCell) - a source only set inside the component's own
        // render body would be invisible there and produce a blank header.
        const element = <CommonYearField />;
        expect(element.props.source).toBe('year');
    });

    it('still lets callers override the source explicitly', () => {
        const element = <CommonYearField source="otherYear" />;
        expect(element.props.source).toBe('otherYear');
    });
});

describe('CommonYearInputFilter', () => {
    it('exposes source on the element itself so the "add filter" menu can resolve its label', () => {
        // FilterButtonMenuItem reads filter.props.source/label directly off the
        // unrendered element to build each checkbox's title - a source only set
        // inside the component's own render body would be invisible there and
        // produce a blank checkbox.
        const element = <CommonYearInputFilter />;
        expect(element.props.source).toBe('year');
    });

    it('still lets callers override the source explicitly', () => {
        const element = <CommonYearInputFilter source="otherYear" />;
        expect(element.props.source).toBe('otherYear');
    });
});
