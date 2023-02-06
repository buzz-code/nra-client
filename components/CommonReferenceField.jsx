import { ReferenceField, ReferenceOneField, useRecordContext } from 'react-admin';

export const CommonReferenceField = ({ source, reference, target }) => (
    <MultiReferenceField optionalSource={source} reference={reference} optionalTarget={target} />
)

export const MultiReferenceField = ({ source, reference, optionalSource, optionalTarget }) => {
    const record = useRecordContext();
    if (!record) {
        return null;
    }

    if (record[source]) {
        return (
            <ReferenceField source={source} reference={reference} />
        )
    }
    if (record[optionalSource]) {
        return (
            <ReferenceOneField source={optionalSource} reference={reference} target={optionalTarget} />
        )
    }

    return null;
}
