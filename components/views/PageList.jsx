import { List, RichTextField, useListContext } from "react-admin";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CollapsibleSection } from '../layout/CollapsibleSection';


export default (props) => {
    return (
        <List resource="page" sort={{ field: 'order', order: 'ASC' }} emptyWhileLoading
            exporter={false} pagination={false} {...props}>
            <PagesData />
        </List>
    );
}

const PagesData = ({ ...props }) => {
    const { data } = useListContext();
    return (
        <Stack spacing={2} sx={{ padding: 2 }}>
            {data.map(page => (
                <CollapsibleSection key={page.id} id={page.id} title={page.description} titleVariant="body1">
                    <Typography>
                        <RichTextField record={page} source='value' />
                    </Typography>
                </CollapsibleSection>
            ))}
        </Stack>
    );
}
