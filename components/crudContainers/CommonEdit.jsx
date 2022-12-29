import { Edit, SimpleForm, TopToolbar, ListButton } from 'react-admin';

const EditActions = () => (
    <TopToolbar>
        <ListButton />
    </TopToolbar>
);

export const CommonEdit = ({ children, ...props }) => (
    <Edit actions={<EditActions />} {...props}>
        <SimpleForm>
            {children}
        </SimpleForm>
    </Edit>
)