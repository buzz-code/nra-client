import { useDataProvider, useListContext, useNotify } from 'react-admin';
import { useMutation } from 'react-query';
import DownloadingIcon from '@mui/icons-material/Downloading';
import { BulkRequestButton } from './BulkRequestButton';

export const BulkActionButton = ({ label, icon, name }) => {
    const dataProvider = useDataProvider();
    const { selectedIds, onUnselectItems, resource } = useListContext();
    const notify = useNotify();

    const params = new URLSearchParams({
        'extra.action': name,
        'extra.ids': selectedIds
    });
    const { mutate, isLoading } = useMutation(
        () => dataProvider.exec(resource, 'action?' + params, {})
            .then(() => {
                notify('ra.message.action_success');
                onUnselectItems();
            })
            .catch((error) => {
                notify(
                    typeof error === 'string'
                        ? error
                        : error.message || 'ra.notification.http_error',
                    {
                        type: 'error',
                        messageArgs: {
                            _:
                                typeof error === 'string'
                                    ? error
                                    : error && error.message
                                        ? error.message
                                        : undefined,
                        },
                    }
                );
            })
    );

    return <BulkRequestButton label={label} mutate={mutate} isLoading={isLoading} icon={icon} />
}

const loader = <DownloadingIcon />;
