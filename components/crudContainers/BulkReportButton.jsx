import { Button, useDataProvider, useListContext, useNotify } from 'react-admin';
import { useMutation } from 'react-query';
import DownloadingIcon from '@mui/icons-material/Downloading';

export const BulkReportButton = ({ label, icon, name, filename }) => {
    const dataProvider = useDataProvider();
    const { selectedIds, onUnselectItems, resource } = useListContext();
    const notify = useNotify();

    const params = new URLSearchParams({
        'extra.report': name,
        'extra.ids': selectedIds
    });
    const { mutate, isLoading } = useMutation(
        () => dataProvider.execAndDownload(resource, 'report?' + params, {}, filename)
            .then(() => {
                notify('ra.message.report_generation_success');
                onUnselectItems();
            })
            .catch(() => {
                notify('ra.notification.http_error', { type: 'error' });
            })
    );

    return (
        <Button label={label} onClick={() => mutate()} disabled={isLoading}>
            {isLoading ? loader : icon}
        </Button>
    )
}

const loader = <DownloadingIcon />;
