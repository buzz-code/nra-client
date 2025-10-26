import HelpIcon from '@mui/icons-material/Help';
import { BulkActionButton } from './BulkActionButton';

export const BulkFixReferenceButton = ({ label = 'תיקון שיוך תלמידה' }) => (
    <BulkActionButton name='fixReferences' label={label} icon={<HelpIcon />} reloadOnEnd />
);
