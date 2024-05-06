import { handleActionSuccess, handleError } from '@shared/utils/notifyUtil';
import { useDataProvider, useListContext, useNotify } from 'react-admin';
import { useMutation } from 'react-query';
import { BulkRequestButton } from './BulkRequestButton';

export const BulkActionButton = ({ label, icon, name, defaultRequestValues, children }) => {
    const dataProvider = useDataProvider();
    const { selectedIds, onUnselectItems, resource } = useListContext();
    const notify = useNotify();

    const { mutate, isLoading } = useMutation(
        (data) => {
            const params = {
                ...data,
                'extra.ids': selectedIds
            };
            return dataProvider.action(resource, name, params)
                .then(handleActionSuccess(notify))
                .then(() => {
                    onUnselectItems();
                })
                .catch(handleError(notify));
        }
    );

    return <BulkRequestButton label={label} name={name} mutate={mutate} isLoading={isLoading} icon={icon} defaultRequestValues={defaultRequestValues} children={children} />
}
