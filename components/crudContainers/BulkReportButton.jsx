import { handleError } from '@shared/utils/notifyUtil';
import { useDataProvider, useListContext, useNotify } from 'react-admin';
import { useMutation } from 'react-query';
import { BulkRequestButton } from './BulkRequestButton';

export const BulkReportButton = ({ label, icon, name, filename, defaultRequestValues, children }) => {
    const dataProvider = useDataProvider();
    const { selectedIds, onUnselectItems, resource } = useListContext();
    const notify = useNotify();

    const { mutate, isLoading } = useMutation(
        (data) => {
            const params = new URLSearchParams({
                ...data,
                'extra.report': name,
                'extra.ids': selectedIds
            });

            return dataProvider.execAndDownload(resource, 'report?' + params, {}, filename)
                .then(() => {
                    notify('ra.message.report_generation_success');
                    onUnselectItems();
                })
                .catch(handleError(notify));
        }
    );

    return <BulkRequestButton label={label} mutate={mutate} isLoading={isLoading} icon={icon} defaultRequestValues={defaultRequestValues} children={children} />
}
