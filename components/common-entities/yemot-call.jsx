import { ArrayField, BooleanField, ChipField, DateField, ReferenceField, ReferenceInput, SingleFieldList, TextField } from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { CommonJsonField } from '@shared/components/fields/CommonJsonItem';

const filters = [
    ({ isAdmin }) => isAdmin && <ReferenceInput source="userId" reference="user" />,
];

const Datagrid = ({ isAdmin, children, ...props }) => {
    return (
        <CommonDatagrid {...props} readonly>
            {children}
            <TextField source="id" />
            <ReferenceField source="userId" reference="user" />
            <TextField source="apiCallId" />
            <TextField source="phone" />
            <ArrayField source="history">
                <SingleFieldList>
                    <ChipField source="params.ApiCallId" />
                </SingleFieldList>
            </ArrayField>
            <CommonJsonField source="history" />
            <TextField source="currentStep" />
            <TextField source="data" />
            <BooleanField source="isOpen" />
            <BooleanField source="hasError" />
            <TextField source="errorMessage" />
            <DateField showDate showTime source="createdAt" />
            <DateField showDate showTime source="updatedAt" />
        </CommonDatagrid>
    );
}

const entity = {
    Datagrid,
    filters,
    exporter: false,
};

export default getResourceComponents(entity);
