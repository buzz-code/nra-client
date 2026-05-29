import { SelectField } from 'react-admin';
import { yearChoices, defaultYearFilter } from '@shared/utils/yearFilter';
import CommonAutocompleteInput from './CommonAutocompleteInput';

export const CommonYearField = (props) => (
    <SelectField source="year" choices={yearChoices} {...props} />
);

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
