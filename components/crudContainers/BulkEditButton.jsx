import EditIcon from '@mui/icons-material/Edit';
import { BulkActionButton } from './BulkActionButton';

// Opens a dialog with the given inputs and sets the filled ones on all selected rows;
// the server only applies fields listed in the entity's bulkEditFields.
export const BulkEditButton = ({ label = 'עריכה מרוכזת', children }) => (
    <BulkActionButton label={label} icon={<EditIcon />} name="bulkEdit" reloadOnEnd cacheValues={false}>
        {children}
    </BulkActionButton>
);
