import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DateInput, ReferenceField, TextField, useDataProvider } from 'react-admin';
import { NullableBooleanInput, TextInput } from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { YemotCallDetailsDialog, LastSentMessageField } from '@shared/components/fields/YemotCallHistoryField';
import StatusChipField from '@shared/components/fields/StatusChipField';
import CommonPhoneField from '@shared/components/fields/CommonPhoneField';
import CommonDateTimeField from '@shared/components/fields/CommonDateTimeField';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { CommonJsonField } from '@shared/components/fields/CommonJsonItem';
import { adminUserFilter, adminUpdatedAtFilters } from '@shared/components/fields/PermissionFilter';

const filters = [
    adminUserFilter,
    ...adminUpdatedAtFilters,
    <TextInput source="phone:$cont" alwaysOn />,
    <NullableBooleanInput source="isOpen" />,
    <NullableBooleanInput source="hasError" />,
    <TextInput source="errorMessage:$cont" />,
    <DateInput source="createdAt:$gte" />,
    <DateInput source="createdAt:$lte" />,
];

// Opening the call details is a row-level action (any click on the row, not
// just a field's own icon), and is deep-linkable via the callId URL param -
// both need one shared "which call is open" state above the per-row fields.
const Datagrid = ({ isAdmin, children, ...props }) => {
    const [openRecord, setOpenRecord] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const dataProvider = useDataProvider();
    const callId = searchParams.get('callId');

    useEffect(() => {
        if (!callId || String(openRecord?.id) === callId) {
            return;
        }
        let cancelled = false;
        dataProvider.getOne('yemot_call', { id: callId }).then(({ data }) => {
            if (!cancelled) setOpenRecord(data);
        }).catch(() => {});
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callId]);

    const openCall = (record) => {
        if (record?.data?.version !== 'v2') {
            return false;
        }
        setOpenRecord(record);
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set('callId', record.id);
            return next;
        });
        return false;
    };

    const closeDialog = () => {
        setOpenRecord(null);
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.delete('callId');
            return next;
        });
    };

    return (
        <>
            <CommonDatagrid {...props} readonly rowClick={(_id, _resource, record) => openCall(record)}>
                {children}
                {isAdmin && <TextField source="id" />}
                {isAdmin && <ReferenceField source="userId" reference="user" />}
                {isAdmin && <TextField source="apiCallId" />}
                <CommonPhoneField source="phone" />
                <StatusChipField source="isOpen" />
                <StatusChipField source="hasError" trueColor="error" />
                <TextField source="errorMessage" />
                <LastSentMessageField source="lastSentMessage" />
                {isAdmin && <TextField source="currentStep" />}
                {isAdmin && <CommonJsonField source="data" />}
                <CommonDateTimeField source="createdAt" />
                {isAdmin && <CommonDateTimeField source="updatedAt" />}
            </CommonDatagrid>
            <YemotCallDetailsDialog record={openRecord} onClose={closeDialog} />
        </>
    );
}

const entity = {
    Datagrid,
    filters,
    exporter: false,
    sort: { field: 'createdAt', order: 'DESC' },
};

export default getResourceComponents(entity);
