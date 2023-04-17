import { Button, useDataProvider, useListContext, useNotify } from 'react-admin';
import { useMutation } from 'react-query';

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
    );

    return (
        <Button label={label} icon={icon} onClick={() => mutate()} disabled={isLoading} />
    )
}
