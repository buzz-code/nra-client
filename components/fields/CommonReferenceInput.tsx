import * as React from 'react';
import { AutocompleteInput, AutocompleteInputProps, ReferenceInput, ReferenceInputProps } from 'react-admin';

export default (props: ReferenceInputProps | AutocompleteInputProps) => (
    <ReferenceInput {...props}>
        <AutocompleteInput {...props} />
    </ReferenceInput>
)