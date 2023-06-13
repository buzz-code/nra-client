import * as React from 'react';
import { AutocompleteInput, AutocompleteInputProps, ReferenceInput, ReferenceInputProps, FormDataConsumer } from 'react-admin';

type CommonReferenceInputProps = ReferenceInputProps & AutocompleteInputProps & {
    dynamicFilter: Record<string, string>;
};

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

    return (
        <FormDataConsumer>
            {({ formData, ...rest }) => (
                <ReferenceInput {...props} filter={getFilterByFormData(formData)}>
                    <AutocompleteInput {...props} />
                </ReferenceInput>
            )}</FormDataConsumer>
    );
}