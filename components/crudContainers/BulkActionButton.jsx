import { useDataProvider, useListContext, useNotify } from 'react-admin';
import { useMutation } from 'react-query';
import { BulkRequestButton } from './BulkRequestButton';

export const BulkActionButton = ({ label, icon, name, children }) => {
    const dataProvider = useDataProvider();
    const { selectedIds, onUnselectItems, resource } = useListContext();
    const notify = useNotify();

    const { mutate, isLoading } = useMutation(
        (data) => {
            const params = new URLSearchParams({
                ...data,
                'extra.action': name,
                'extra.ids': selectedIds
            });

            return dataProvider.exec(resource, 'action?' + params, {})
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
                                _: typeof error === 'string'
                                    ? error
                                    : error && error.message
                                        ? error.message
                                        : undefined
                            }
                        }
                    );
                });
        }
    );

    return <BulkRequestButton label={label} mutate={mutate} isLoading={isLoading} icon={icon} children={children} />
}
