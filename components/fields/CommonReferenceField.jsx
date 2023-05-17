import { ReferenceField, ReferenceOneField, useRecordContext } from 'react-admin';
import get from 'lodash/get';

export const CommonReferenceField = ({ source, reference, target, ...props }) => (
    <MultiReferenceField optionalSource={source} reference={reference} optionalTarget={target} {...props} />
)

export const MultiReferenceField = ({ source, reference, optionalSource, optionalTarget, sortBy, ...props }) => {
    const record = useRecordContext();
    if (!record) {
        return null;
    }

    if (get(record, source)) {
        return (
            <ReferenceField source={source} reference={reference} sortBy={sortBy} {...props} />
        )
    }
    if (record[optionalSource]) {
        return (
            <ReferenceOneField source={optionalSource} reference={reference} target={optionalTarget} sortBy={sortBy} {...props} />
        )
    }

    return null;
}
