import { useGetResourceLabel, useRecordContext } from 'react-admin';

export const CommonEntityNameField = ({ source }) => {
    const record = useRecordContext();
    const getResourceLabel = useGetResourceLabel();

    if (!record || !record[source]) {
        return null;
    }

    return (
        <span>{getResourceLabel(record[source])}</span>
    )
}
