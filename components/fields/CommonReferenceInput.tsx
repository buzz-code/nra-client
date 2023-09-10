import * as React from 'react';
import { AutocompleteInputProps, ReferenceInput, ReferenceInputProps, FormDataConsumer } from 'react-admin';
import CommonAutocompleteInput from './CommonAutocompleteInput';

type CommonReferenceInputProps = ReferenceInputProps & AutocompleteInputProps & {
    dynamicFilter: Record<string, string>;
};

const defaultOrder = { field: 'name', order: 'ASC' };

export default (props: CommonReferenceInputProps) => {
    const getFilterByFormData = React.useCallback((formData) => {
        const res = {};
        for (const key in props.dynamicFilter) {
            if (Object.hasOwnProperty.call(props.dynamicFilter, key)) {
                const value = formData[key];
                if (value) {
                    res[key] = value;
                }
            }
        }
        return {
            ...(props.filter as any || {}),
            ...res,
        };;
    }, [props.dynamicFilter, props.filter]);

    console.log({props})

    return (
        <FormDataConsumer>
            {({ formData, ...rest }) => (
                <ReferenceInput sort={defaultOrder} {...props} filter={getFilterByFormData(formData)}>
                    <CommonAutocompleteInput {...props} />
                </ReferenceInput>
            )}</FormDataConsumer>
    );
}