import { Create, SimpleForm, TopToolbar, ListButton } from 'react-admin';

const CreateActions = () => (
    <TopToolbar>
        <ListButton />
    </TopToolbar>
);

export const CommonCreate = ({ children, ...props }) => (
    <Create actions={<CreateActions />} {...props}>
        <SimpleForm>
            {children}
        </SimpleForm>
    </Create>
)