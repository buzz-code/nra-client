import { BooleanField, BooleanInput, Button, DateField, DateTimeInput, EmailField, FormDataConsumer, maxLength, required, TextField, TextInput, useAuthProvider, useDataProvider, useRecordContext, ReferenceField, Labeled } from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { QuickFilter } from '@shared/components/fields/QuickFilter';
import { CommonRepresentation } from '@shared/components/CommonRepresentation';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { CommonJsonField, CommonJsonInput } from '@shared/components/fields/CommonJsonItem';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import CommonReferenceInput from '@shared/components/fields/CommonReferenceInput';

const ImpersonateButton = ({ ...props }) => {
    const record = useRecordContext(props);
    const dataProvider = useDataProvider();
    const authProvider = useAuthProvider();
    const navigate = useNavigate();

    const impersonate = async (e) => {
        e.stopPropagation();
        await dataProvider.impersonate(record.id);
        await authProvider.getIdentity(true);
        navigate('/');
        window.location.reload();
    }

    return (
        <Button label='ra.action.impersonate' startIcon={<PersonIcon />} onClick={impersonate} />
    );
}

const filters = [
    <TextInput source="name" alwaysOn />,
    <TextInput source="email" alwaysOn />,
    <TextInput source="phoneNumber" />,
    <QuickFilter source="fromEmail" defaultValue="gmail" />
];

const Datagrid = ({ isAdmin, ...props }) => {
    return (
        <CommonDatagrid {...props}>
            {isAdmin && <TextField source="id" />}
            <TextField source="name" />
            <EmailField source="email" />
            <TextField source="phoneNumber" />
            {/* {isAdmin && <TextField source="active" />} */}
            {isAdmin && <TextField source="effective_id" />}
            {isAdmin && <CommonJsonField source="permissions" />}
            {isAdmin && <CommonJsonField source="additionalData" />}
            <CommonJsonField source="userInfo" />
            <BooleanField source="isPaid" />
            <ReferenceField source="paymentTrackId" reference="payment_track" />
            <DateField showDate showTime source="createdAt" />
            <DateField showDate showTime source="updatedAt" />
            {isAdmin && <ImpersonateButton />}
        </CommonDatagrid>
    );
}

const Inputs = ({ isCreate, isAdmin }) => {
    return <>
        {isAdmin && <FormDataConsumer>{({ formData }) => <ImpersonateButton record={formData} />}</FormDataConsumer>}
        {!isCreate && isAdmin && <TextInput source="id" disabled />}
        <TextInput source="name" validate={[required(), maxLength(500)]} disabled={!isAdmin} />
        <TextInput source="email" validate={[required(), maxLength(500)]} disabled={!isAdmin} />
        {isAdmin && <TextInput source="password" />}
        <TextInput source="phoneNumber" validate={maxLength(11)} />
        {isAdmin && <TextInput source="active" />}
        {isAdmin && <TextInput source="fromEmail" />}
        {isAdmin && <TextInput source="replyToEmail" />}
        {isAdmin && <TextInput source="effective_id" />}
        {isAdmin && <CommonJsonInput source="permissions" />}
        {isAdmin && <CommonJsonInput source="additionalData" />}
        {isAdmin && <CommonJsonInput source="userInfo" />}
        <BooleanInput source="isPaid" />
        <FormDataConsumer>
            {({ formData, ...rest }) => formData.isPaid &&
                <TextInput source="paymentMethod" validate={required()} {...rest} />
            }
        </FormDataConsumer>
        <CommonReferenceInput source="paymentTrackId" reference="payment_track" />
        <ReferenceField source="paymentTrackId" reference="payment_track" link={false} emptyText="">
            <Labeled label="מחיר לחודש"><TextField source="monthlyPrice" /></Labeled>
            <Labeled label="מחיר לשנה"><TextField source="annualPrice" /></Labeled>
        </ReferenceField>
        <TextInput source="mailAddressAlias" validate={maxLength(255)} />
        <TextInput source="mailAddressTitle" validate={maxLength(255)} />
        {!isCreate && <DateTimeInput source="createdAt" disabled />}
        {!isCreate && <DateTimeInput source="updatedAt" disabled />}
    </>
}

const Representation = CommonRepresentation;

const entity = {
    Datagrid,
    Inputs,
    Representation,
    filters,
};

export default getResourceComponents(entity);
