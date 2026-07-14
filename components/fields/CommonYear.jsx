import { SelectField } from 'react-admin';
import { yearChoices, defaultYearFilter } from '@shared/utils/yearFilter';
import CommonAutocompleteInput from './CommonAutocompleteInput';

export const CommonYearField = (props) => (
    <SelectField source="year" choices={yearChoices} {...props} />
);

// Datagrid resolves each column's header label (and sort target) by reading
// `source`/`sortBy` directly off the unrendered <CommonYearField /> element,
// before it ever renders - a JS default parameter wouldn't be visible there,
// only a static defaultProps is (React merges it into the element's props at
// createElement time). Without this, every grid using this field showed a
// blank header and couldn't sort by year.
CommonYearField.defaultProps = {
    source: 'year',
};

export const CommonYearInput = (props) => (
    <CommonAutocompleteInput
        source="year"
        choices={yearChoices}
        defaultValue={defaultYearFilter.year}
        {...props}
    />
);

export const CommonYearInputFilter = (props) => (
    <CommonYearInput alwaysOn {...props} />
);
