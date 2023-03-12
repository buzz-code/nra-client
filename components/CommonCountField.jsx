import { useRecordContext } from 'react-admin';

export const CommonCountField = ({ source }) => {
    const record = useRecordContext();

    if (!record || !record[source]) {
        return null;
    }

    return (
        <span>{record[source].length}</span>
    )
}
