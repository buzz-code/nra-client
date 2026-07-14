import { useState } from 'react';
import {
    Button,
    useListContext,
    useDataProvider,
    useAuthProvider,
    useGetIdentity,
    useGetResourceLabel,
    useNotify,
    useResourceContext,
} from 'react-admin';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';

// Building a dashboard card by hand (pick a resource, then figure out
// yearFilterType, then hand-write a JSON filter) asked users to understand
// internal query syntax nobody actually uses. This captures the resource +
// filters the user has *already* set up through the list's own filter UI -
// the same filters they already understand - and turns them into a card.
export const AddToDashboardButton = () => {
    const resource = useResourceContext();
    const { filterValues } = useListContext();
    const getResourceLabel = useGetResourceLabel();
    const dataProvider = useDataProvider();
    const authProvider = useAuthProvider();
    const { identity } = useGetIdentity();
    const notify = useNotify();
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        try {
            const filter = { ...filterValues };
            let yearFilterType = 'none';
            if ('year:$cont' in filter) {
                yearFilterType = 'year:$cont';
                delete filter['year:$cont'];
            } else if ('year' in filter) {
                yearFilterType = 'year';
                delete filter.year;
            }

            const existingItems = identity?.additionalData?.dashboardItems || [];
            const newItem = {
                title: getResourceLabel(resource, 2),
                resource,
                yearFilterType,
                filter,
                icon: 'List',
            };

            await dataProvider.updateSettings({ data: { dashboardItems: [...existingItems, newItem] } });
            await authProvider.getIdentity(true);
            notify('נוסף ללוח המחוונים', { type: 'info' });
        } catch (e) {
            notify('ההוספה נכשלה', { type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button label="הוסף ללוח מחוונים" onClick={handleClick} disabled={loading}>
            <DashboardCustomizeOutlinedIcon />
        </Button>
    );
};

export default AddToDashboardButton;
