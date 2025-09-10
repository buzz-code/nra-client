import { Card, CardContent, Chip, Box } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { SimpleForm, TextInput, Title, useDataProvider, useNotify, Toolbar, SaveButton, RefreshButton } from 'react-admin';
import { useMutation } from '@tanstack/react-query';
import { useFormContext } from 'react-hook-form';
import CallEndIcon from '@mui/icons-material/CallEnd'
import AudioFileIcon from '@mui/icons-material/AudioFile'

// Constants
const DEFAULT_VALUES = {
    ApiCallId: String(Math.random()).slice(2),
    ApiExtension: '123',
    ApiDID: '', //0774311257
    ApiPhone: '', //0527609942
    ApiEnterID: '',
};

const REGEX_PATTERNS = {
    TEXT: /\=t-([^=\.]*)/,
    FILE: /\=f-([^=\.]*)/,
    PARAM: /read=t-[^=]*=([^,\.]*)/
};

// Utility Functions
const required = (message = 'ra.validation.required') =>
    (value, allValues) => (value || allValues.hangup) ? undefined : message;

const parseResponseLine = (line) => {
    // Check for text messages
    const textMatch = REGEX_PATTERNS.TEXT.exec(line);
    if (textMatch) {
        const [, text] = textMatch;
        return { type: 'text', content: text };
    }
    
    // Check for file messages
    const fileMatch = REGEX_PATTERNS.FILE.exec(line);
    if (fileMatch) {
        const [, filename] = fileMatch;
        return { type: 'file', content: filename };
    }
    
    return null;
};

const parseParameterFromLine = (line) => {
    if (line.startsWith('read')) {
        const paramMatch = REGEX_PATTERNS.PARAM.exec(line);
        if (paramMatch) {
            const [, param] = paramMatch;
            return param;
        }
    }
    return null;
};

const parseYemotResponse = (responseBody) => {
    const parsedData = { lines: [], param: '' };
    const lines = responseBody.split('&');
    
    for (const line of lines) {
        if (line.includes('hangup')) {
            return { ...parsedData, hangup: true };
        }
        
        const messageResult = parseResponseLine(line);
        if (messageResult) {
            parsedData.lines.push(messageResult);
        }
        
        const param = parseParameterFromLine(line);
        if (param) {
            parsedData.param = param;
        }
    }
    
    return parsedData;
};


// Components
const MessageDisplay = ({ line }) => {
    if (line.type === 'file') {
        return (
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
        );
    }
    
    return <span>{line.content}</span>;
};

const HistoryStep = ({ lines }) => {
    return (
        <Box sx={{ marginY: 1, padding: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            {lines.map((line, index) => (
                <div key={index} style={{ marginBottom: '4px' }}>
                    <MessageDisplay line={line} />
                </div>
            ))}
        </Box>
    );
};

const HangupButton = ({ params, isHangup, handleSubmit, ...props }) => {
    const form = useFormContext();

    const handleClick = useCallback(() => {
        form.setValue('hangup', 'yes');
    }, [form]);

    useEffect(() => {
        if (isHangup) {
            form.setValue('hangup', 'yes');
            form.handleSubmit(handleSubmit);
        }
    }, [isHangup, form, handleSubmit]);

    if (isHangup) {
        return null;
    }

    return (
        <SaveButton 
            onClick={handleClick} 
            label={'ra.action.hangup'} 
            icon={<CallEndIcon />} 
            disabled={!params.length} 
            {...props} 
        />
    );
};

const SimulatorToolbar = ({ isHangup, params, handleSubmit, handleReload }) => (
    <Toolbar>
        <SaveButton disabled={isHangup} alwaysEnable={true} />
        <RefreshButton onClick={handleReload} sx={{ marginInline: '1rem' }} size='medium' />
        <HangupButton 
            params={params} 
            isHangup={isHangup} 
            handleSubmit={handleSubmit} 
            alwaysEnable={true} 
            formNoValidate 
        />
    </Toolbar>
);

const CallInputs = ({ params, isHangup }) => (
    <>
        <TextInput source="ApiCallId" label="מזהה שיחה" validate={required()} readOnly />
        <TextInput source="ApiExtension" label="שלוחה" validate={required()} readOnly />
        <TextInput source="ApiDID" label="מספר מערכת" validate={required()} />
        <TextInput source="ApiPhone" label="מאת מס׳ טלפון" validate={required()} />
        <TextInput source="ApiEnterID" label="מספר זיהוי" />
        {params.map(param => (
            <TextInput 
                source={param} 
                key={param} 
                validate={required()} 
                disabled={isHangup} 
            />
        ))}
    </>
);

const CallHistory = ({ history }) => (
    <>
        {history.map((item, index) => (
            <HistoryStep key={index} lines={item} />
        ))}
    </>
);

const HangupMessage = ({ isHangup }) => {
    if (!isHangup) return null;
    
    return (
        <Box sx={{ marginY: 2, padding: 2, backgroundColor: '#ffebee', borderRadius: 1, textAlign: 'center' }}>
            השיחה נותקה, אפשר לרענן בשביל להתחיל שיחה חדשה
        </Box>
    );
};

// Main Component
const YemotSimulator = () => {
    const dataProvider = useDataProvider();
    const [history, setHistory] = useState([]);
    const [params, setParams] = useState([]);
    const [isHangup, setIsHangup] = useState(false);
    const notify = useNotify();

    const { mutate, isPending } = useMutation({
        mutationFn: (body) => dataProvider.simulateYemotCall(body),
        onSuccess: (data) => {
            const parsedData = parseYemotResponse(data.body);
            
            if (parsedData.hangup) {
                setIsHangup(true);
                return;
            }

            setHistory(prevData => ([...prevData, parsedData.lines]));
            if (parsedData.param) {
                setParams(prevData => ([parsedData.param]));
            }

            notify('ra.yemot_simulator.step_success', { type: 'info' });
        },
        onError: () => {
            notify('ra.message.error', { type: 'error' });
        }
    });

    const handleSubmit = useCallback((body) => {
        mutate(body);
    }, [mutate]);

    const handleReload = useCallback(() => {
        window.location.reload();
    }, []);

    // todo: autofill user phone
    return (
        <Card>
            <Title title="סימולטור" />
            <CardContent>
                <SimpleForm 
                    onSubmit={handleSubmit} 
                    defaultValues={DEFAULT_VALUES} 
                    toolbar={
                        <SimulatorToolbar 
                            isHangup={isHangup}
                            params={params}
                            handleSubmit={handleSubmit}
                            handleReload={handleReload}
                        />
                    }
                >
                    <CallInputs params={params} isHangup={isHangup} />
                </SimpleForm>
                <CallHistory history={history} />
                <HangupMessage isHangup={isHangup} />
            </CardContent>
        </Card>
    );
};

export default YemotSimulator;
