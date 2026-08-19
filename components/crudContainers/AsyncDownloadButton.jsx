import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, useDataProvider, useNotify } from 'react-admin';
import DownloadIcon from '@mui/icons-material/Download';
import { handleError } from '@shared/utils/notifyUtil';

/**
 * Triggers an async job via the entity `/action` endpoint, polls the `job`
 * resource until it finishes, then downloads the result. Small results come
 * back as base64 in `result.data`; large ones are delivered by link in
 * `result.url`.
 *
 * Reuses dataProvider.action (buzz-code/nra-client) to enqueue; the action
 * handler is expected to return `{ jobId }`.
 *
 * Props:
 *   label    - button label
 *   resource - resource whose /action enqueues the job
 *   action   - action name passed as extra.action
 *   params   - query params for the action (e.g. { 'extra.ids': [...] })
 *   body     - POST body for the action
 *   icon     - optional button icon
 *   pollMs   - poll interval, default 2000
 */
const TERMINAL = ['completed', 'failed', 'cancelled'];

export const AsyncDownloadButton = ({
    label = 'הורדה',
    resource,
    action,
    params = {},
    body = {},
    icon = <DownloadIcon />,
    pollMs = 2000,
}) => {
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const [loading, setLoading] = useState(false);
    const timer = useRef(null);

    useEffect(() => () => clearInterval(timer.current), []);

    const download = useCallback((result) => {
        if (result?.url) {
            window.open(result.url, '_blank');
            return;
        }
        if (result?.data) {
            const link = document.createElement('a');
            link.href = `data:application/octet-stream;base64,${result.data}`;
            link.download = result.filename || 'download';
            link.click();
        }
    }, []);

    const poll = useCallback((jobId) => {
        timer.current = setInterval(() => {
            dataProvider.getOne('job', { id: jobId })
                .then(({ data: job }) => {
                    if (!TERMINAL.includes(job.status)) return;
                    clearInterval(timer.current);
                    setLoading(false);
                    if (job.status === 'completed') {
                        download(job.result);
                        notify('הקובץ מוכן', { type: 'success' });
                    } else {
                        notify(`המשימה נכשלה: ${job.error || ''}`, { type: 'error' });
                    }
                })
                .catch((err) => {
                    clearInterval(timer.current);
                    setLoading(false);
                    handleError(notify)(err);
                });
        }, pollMs);
    }, [dataProvider, notify, download, pollMs]);

    const handleClick = useCallback(() => {
        setLoading(true);
        dataProvider.action(resource, action, params, body)
            .then(({ data }) => {
                const jobId = data?.jobId ?? data?.id;
                if (!jobId) {
                    throw new Error('missing jobId');
                }
                poll(jobId);
            })
            .catch((err) => {
                setLoading(false);
                handleError(notify)(err);
            });
    }, [dataProvider, resource, action, params, body, poll, notify]);

    return <Button label={label} onClick={handleClick} disabled={loading} startIcon={icon} />;
};

export default AsyncDownloadButton;
