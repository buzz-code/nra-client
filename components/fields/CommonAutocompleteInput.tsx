import * as React from 'react';
import { AutocompleteInput, AutocompleteInputProps } from 'react-admin';

export default (props: AutocompleteInputProps) => {
    return (
        <AutocompleteInput noOptionsText={'ra.message.no_options'} {...props} />
    );
}