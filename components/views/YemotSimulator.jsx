import { Card, CardContent, Chip, Box } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { SimpleForm, TextInput, Title, useDataProvider, useNotify, Toolbar, SaveButton, RefreshButton } from 'react-admin';
import { useMutation } from '@tanstack/react-query';
import { useFormContext } from 'react-hook-form';
import CallEndIcon from '@mui/icons-material/CallEnd'
import AudioFileIcon from '@mui/icons-material/AudioFile'

const defaultValues = {
    ApiCallId: String(Math.random()).slice(2),
    ApiExtension: '123',
    ApiDID: '', //0774311257
    ApiPhone: '', //0527609942
    ApiEnterID: '',
};
const TEXT_REGEX = /\=t-([^=\.]*)/
const FILE_REGEX = /\=f-([^=\.]*)/
const PARAM_REGEX = /read=t-[^=]*=([^,\.]*)/
const required = (message = 'ra.validation.required') =>
    (value, allValues) => (value || allValues.hangup) ? undefined : message;


const YemotSimulator = () => {
    const dataProvider = useDataProvider();
    const [history, setHistory] = useState([]);
    const [params, setParams] = useState([]);
    const [isHangup, setIsHangup] = useState(false);
    const notify = useNotify();

    const { mutate, isPending } = useMutation({
        mutationFn: (body) => dataProvider.simulateYemotCall(body),
        onSuccess: (data) => {
            const parsedData = { lines: [], param: '' };
            for (const line of data.body.split('&')) {
                if (line.includes('hangup')) {
                    setIsHangup(true);
                    break;
                }
                
                // Check for text messages
                const textMatch = TEXT_REGEX.exec(line);
                if (textMatch) {
                    const [, text] = textMatch;
                    parsedData.lines.push({ type: 'text', content: text });
                }
                
                // Check for file messages
                const fileMatch = FILE_REGEX.exec(line);
                if (fileMatch) {
                    const [, filename] = fileMatch;
                    parsedData.lines.push({ type: 'file', content: filename });
                }
                
                if (line.startsWith('read')) {
                    const paramMatch = PARAM_REGEX.exec(line);
                    if (paramMatch) {
                        const [, param] = paramMatch;
                        parsedData.param = param;
                    }
                }
            }

            setHistory(prevData => ([...prevData, parsedData.lines]));
            if (parsedData.param)
                setParams(prevData => ([parsedData.param]));

            notify('ra.yemot_simulator.step_success', { type: 'info' });
        },
        onError: () => {
            notify('ra.message.error', { type: 'error' });
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
            <SaveButton disabled={isHangup} alwaysEnable={true} />
            <RefreshButton onClick={handleReload} sx={{ marginInline: '1rem' }} size='medium' />
            <HangupButton params={params} isHangup={isHangup} handleSubmit={handleSubmit} alwaysEnable={true} formNoValidate />
        </Toolbar>
    )

    // todo: autofill user phone
    return (
        <Card>
            <Title title="סימולטור" />
            <CardContent>
                <SimpleForm onSubmit={handleSubmit} defaultValues={defaultValues} toolbar={toolbar}>
                    <TextInput source="ApiCallId" label="מזהה שיחה" validate={required()} readOnly />
                    <TextInput source="ApiExtension" label="שלוחה" validate={required()} readOnly />
                    <TextInput source="ApiDID" label="מספר מערכת" validate={required()} />
                    <TextInput source="ApiPhone" label="מאת מס׳ טלפון" validate={required()} />
                    <TextInput source="ApiEnterID" label="מספר זיהוי" />
                    {params.map(param => (
                        <TextInput source={param} key={param} validate={required()} disabled={isHangup} />
                    ))}
                </SimpleForm>
                {history.map(item => <HistoryStep key={item} lines={item} />)}
                {isHangup && 'השיחה נותקה, אפשר לרענן בשביל להתחיל שיחה חדשה'}
            </CardContent>
        </Card>
    );
}

const HistoryStep = ({ lines }) => {
    return (
        <Box sx={{ marginY: 1, padding: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            {lines.map((line, index) => (
                <div key={index} style={{ marginBottom: '4px' }}>
                    {line.type === 'file' ? (
                        <Chip 
                            icon={<AudioFileIcon />}
                            label={line.content}
                            variant="outlined"
                            color="secondary"
                            size="small"
                            sx={{ 
                                backgroundColor: '#e3f2fd',
                                borderColor: '#1976d2',
                                '& .MuiChip-label': {
                                    fontWeight: 'bold'
                                }
                            }}
                        />
                    ) : (
                        <span>{line.content}</span>
                    )}
                </div>
            ))}
        </Box>
    )
}

const HangupButton = ({ params, isHangup, handleSubmit, ...props }) => {
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

    return <SaveButton onClick={handleClick} label={'ra.action.hangup'} icon={<CallEndIcon />} disabled={!params.length} {...props} />
}
export default YemotSimulator;
