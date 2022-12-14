import { ReferenceOneField, TextField } from 'react-admin';

export const CommonReferenceField = ({ source, reference, target }) => (
    <ReferenceOneField source={source} reference={reference} target={target} emptyText="-">
        <TextField source="name" />
    </ReferenceOneField>
)