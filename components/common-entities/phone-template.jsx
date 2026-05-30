import {
    BooleanField,
    BooleanInput,
    DateField,
    DateTimeInput,
    required,
    SelectInput,
    TextField,
    TextInput,
    maxLength,
    useNotify,
    useDataProvider,
    useGetRecordId,
    SimpleForm,
} from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { CommonRepresentation } from '@shared/components/CommonRepresentation';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { ActionOrDialogButton } from '@shared/components/crudContainers/ActionOrDialogButton';
import { handleError } from '@shared/utils/notifyUtil';
import PhoneIcon from '@mui/icons-material/Phone';
import { commonAdminFilters } from '@shared/components/fields/PermissionFilter';

const messageTypeChoices = [
    { id: 'text', name: 'resources.phone_template.messageTypes.text' },
];

const filters = [
    ...commonAdminFilters,
    <TextInput source="name:$cont" alwaysOn />,
    <BooleanInput source="isActive" />,
];

const TestCallButton = () => {
    const recordId = useGetRecordId();
    const dataProvider = useDataProvider();
    const notify = useNotify();

    const handleTest = async (values, onClose) => {
        try {
            await dataProvider.action('phone_template', 'test', {
                'extra.templateId': recordId,
                'extra.phoneNumber': values.phoneNumber,
            });
            notify('resources.phone_template.notifications.test_sent', { type: 'success' });
            onClose?.();
        } catch (error) {
            handleError(notify)(error);
        }
    };

    return (
        <ActionOrDialogButton
            label="resources.phone_template.actions.test"
            icon={<PhoneIcon />}
            title="resources.phone_template.dialogs.test_title"
            dialogContent={({ onClose }) => (
                <SimpleForm onSubmit={values => handleTest(values, onClose)}>
                    <TextInput
                        source="phoneNumber"
                        label="resources.phone_template.fields.test_phone"
                        type="tel"
                        validate={required()}
                        placeholder="05XXXXXXXX"
                        fullWidth
                        autoFocus
                    />
                </SimpleForm>
            )}
        />
    );
};

const Datagrid = ({ isAdmin, children, ...props }) => (
    <CommonDatagrid {...props}>
        {children}
        {isAdmin && <TextField source="id" />}
        {isAdmin && <TextField source="userId" />}
        <TextField source="name" />
        <TextField source="description" />
        <BooleanField source="isActive" />
        {isAdmin && <DateField showDate showTime source="createdAt" />}
        {isAdmin && <DateField showDate showTime source="updatedAt" />}
        <TestCallButton />
    </CommonDatagrid>
);

const Inputs = ({ isCreate, isAdmin }) => (
    <>
        {!isCreate && isAdmin && <TextInput source="id" disabled />}
        {isAdmin && <TextInput source="userId" disabled />}
        <TextInput source="name" validate={[required(), maxLength(100)]} />
        <TextInput source="description" validate={[maxLength(500)]} multiline />
        <SelectInput source="messageType" choices={messageTypeChoices} defaultValue="text" />
        <TextInput source="messageText" validate={[required()]} multiline rows={4} fullWidth />
        <TextInput source="callerId" validate={[maxLength(20)]} />
        <BooleanInput source="isActive" defaultValue={true} />
        {!isCreate && isAdmin && <TextInput source="yemotTemplateId" disabled />}
        {!isCreate && isAdmin && <DateTimeInput source="createdAt" disabled />}
        {!isCreate && isAdmin && <DateTimeInput source="updatedAt" disabled />}
    </>
);

const Representation = CommonRepresentation;

const entity = {
    Datagrid,
    Inputs,
    Representation,
    filters,
};

export default getResourceComponents(entity);
