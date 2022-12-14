import { Card, CardContent } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { SimpleForm, TextInput, Title, useDataProvider, useNotify, Toolbar, SaveButton, RefreshButton } from 'react-admin';
import { useMutation } from 'react-query';
import { useFormContext } from 'react-hook-form';
import CallEndIcon from '@mui/icons-material/CallEnd'

const defaultValues = {
    ApiCallId: String(Math.random()),
    ApiDID: '', //0774311257
    ApiPhone: '', //0527609942
};
const TEXT_REGEX = /\=t-([^,=\.]*)/
const PARAM_REGEX = /read=t-[^=]*=([^,\.]*)/
const required = (message = 'ra.validation.required') =>
    (value, allValues) => (value || allValues.hangup) ? undefined : message;


const YemotSimulator = () => {
    const dataProvider = useDataProvider();
    const [history, setHistory] = useState([]);
    const [params, setParams] = useState([]);
    const [isHangup, setIsHangup] = useState(false);
    const notify = useNotify();

    const { mutate, isLoading } = useMutation({
        mutationFn: (body) => dataProvider.simulateYemotCall(body),
        onSuccess: (data) => {
            const parsedData = { lines: [], param: '' };
            for (const line of data.body.split('&')) {
                if (line.includes('hangup')) {
                    setIsHangup(true);
                    break;
                }
                const [, text] = TEXT_REGEX.exec(line);
                parsedData.lines.push(text);
                if (line.startsWith('read')) {
                    const [, param] = PARAM_REGEX.exec(line);
                    parsedData.param = param;
                }
            }

            setHistory(prevData => ([...prevData, parsedData.lines]));
            if (parsedData.param)
                setParams(prevData => ([...prevData, parsedData.param]));

            notify("Success", { type: 'info' });
        },
        onError: () => {
            notify("A technical error occured while updating your profile. Please try later.", { type: 'warning' });
        }
    });

    const handleSubmit = useCallback((body) => {
        mutate(body);
    }, [mutate])

    const handleReload = useCallback(() => {
        window.location.reload();
    }, []);

    const toolbar = (
        <Toolbar>
            <SaveButton disabled={isHangup} />
            <RefreshButton onClick={handleReload} />
            <HangupButton params={params} isHangup={isHangup} handleSubmit={handleSubmit} />
        </Toolbar>
    )

    return (
        <Card>
            <Title title="סימולטור" />
            <CardContent>
                <SimpleForm onSubmit={handleSubmit} defaultValues={defaultValues} toolbar={toolbar}>
                    <TextInput source="ApiCallId" validate={required()} disabled />
                    <TextInput source="ApiDID" validate={required()} />
                    <TextInput source="ApiPhone" validate={required()} />
                    {params.map(param => (
                        <TextInput source={param} validate={required()} disabled={isHangup} />
                    ))}
                </SimpleForm>
                {history.map(item => <HistoryStep key={item} lines={item} />)}
                {isHangup && 'hangup'}
            </CardContent>
        </Card>
    );
}

const HistoryStep = ({ lines }) => {
    return (
        <div>
            {lines.map(line => (
                <div>{line}</div>
            ))}
        </div>
    )
}

const HangupButton = ({ params, isHangup, handleSubmit }) => {
    const form = useFormContext();

    const handleClick = useCallback(() => {
        form.setValue('hangup', true);
    }, [form]);

    useEffect(() => {
        if (isHangup) {
            form.setValue('hangup', true);
            form.handleSubmit(handleSubmit);
        }
    }, [isHangup]);

    if (isHangup) {
        return null;
    }
    
    return <SaveButton onClick={handleClick} icon={<CallEndIcon />} disabled={!params.length} />
}
export default YemotSimulator;
