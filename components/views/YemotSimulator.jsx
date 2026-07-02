import { Card, CardContent, Chip, Box, Paper, Typography } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SimpleForm, TextInput, Title, useDataProvider, useGetIdentity, useNotify, useTranslate, Toolbar, SaveButton, RefreshButton } from 'react-admin';
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
    TEXT: /[=.]t-([^=.]*)/g,
    FILE: /[=.]f-([^=.]*)/g,
    PARAM: /read=t-[^=]*=([^,\.]*)/
};

// Utility Functions
const required = (message = 'ra.validation.required') =>
    (value, allValues) => (value || allValues.hangup) ? undefined : message;

export const parseResponseLine = (line) => {
    const messages = [];

    // Collect all text messages (a single line may contain multiple =t- segments)
    for (const match of line.matchAll(REGEX_PATTERNS.TEXT)) {
        messages.push({ type: 'text', content: match[1] });
    }

    // Collect all file messages
    for (const match of line.matchAll(REGEX_PATTERNS.FILE)) {
        messages.push({ type: 'file', content: match[1] });
    }

    return messages;
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

export const parseYemotResponse = (responseBody) => {
    const parsedData = { lines: [], param: '', hangup: false };
    const lines = responseBody.split('&');

    for (const line of lines) {

        const messages = parseResponseLine(line);
        parsedData.lines.push(...messages);

        const param = parseParameterFromLine(line);
        if (param) {
            parsedData.param = param;
        }

        if (line.includes('hangup')) {
            parsedData.hangup = true;
        }
    }

    return parsedData;
};

const getPromptText = (lines) => {
    const textLines = (lines || []).filter(line => line.type === 'text');
    return textLines.length ? textLines[textLines.length - 1].content : '';
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

const SystemMessageBubble = ({ lines }) => (
    <Paper
        elevation={1}
        sx={{
            alignSelf: 'flex-start',
            maxWidth: '75%',
            padding: 1.5,
            borderRadius: 2,
            backgroundColor: '#f8f9fa',
            borderRight: '3px solid #1976d2',
        }}
    >
        {lines.map((line, index) => (
            <div key={index} style={{ marginBottom: index < lines.length - 1 ? '4px' : 0 }}>
                <MessageDisplay line={line} />
            </div>
        ))}
    </Paper>
);

const UserAnswerBubble = ({ answer }) => (
    <Paper
        elevation={0}
        sx={{
            alignSelf: 'flex-end',
            maxWidth: '75%',
            padding: 1,
            borderRadius: 2,
            backgroundColor: '#e8f5e8',
            color: '#2e7d32',
            fontWeight: 600,
        }}
    >
        {answer}
    </Paper>
);

const TranscriptStep = ({ step }) => (
    <>
        <SystemMessageBubble lines={step.prompt} />
        {step.answer && <UserAnswerBubble answer={step.answer} />}
    </>
);

const ConversationTranscript = ({ history }) => {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ block: 'nearest' });
    }, [history]);

    if (!history.length) {
        return null;
    }

    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                maxHeight: '50vh',
                overflowY: 'auto',
                padding: 1,
                marginY: 1,
            }}
        >
            {history.map((step, index) => (
                <TranscriptStep key={index} step={step} />
            ))}
            <div ref={bottomRef} />
        </Box>
    );
};

const PhonePrefill = ({ phase }) => {
    const { identity } = useGetIdentity();
    const form = useFormContext();

    useEffect(() => {
        if (phase !== 'setup' || !identity?.phoneNumber) {
            return;
        }
        if (!form.getValues('ApiPhone')) {
            form.setValue('ApiPhone', identity.phoneNumber);
        }
    }, [phase, identity?.phoneNumber, form]);

    return null;
};

const CallSetupSummary = ({ values }) => {
    if (!values) return null;

    return (
        <Box sx={{ width: '100%', display: 'flex', gap: 1, flexWrap: 'wrap', marginBottom: 1 }}>
            <Chip size="small" variant="outlined" label={`מספר מערכת: ${values.ApiDID}`} />
            <Chip size="small" variant="outlined" label={`מאת: ${values.ApiPhone}`} />
            {values.ApiEnterID && (
                <Chip size="small" variant="outlined" label={`מספר זיהוי: ${values.ApiEnterID}`} />
            )}
        </Box>
    );
};

const HangupButton = ({ params, phase, ...props }) => {
    const form = useFormContext();

    const handleClick = useCallback(() => {
        form.setValue('hangup', 'yes');
    }, [form]);

    if (phase === 'hangup') {
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

const NewCallButton = ({ onNewCall, ...props }) => {
    const { identity } = useGetIdentity();
    const form = useFormContext();

    const handleClick = useCallback(() => {
        form.reset({
            ...DEFAULT_VALUES,
            ApiCallId: String(Math.random()).slice(2),
            ApiPhone: identity?.phoneNumber || DEFAULT_VALUES.ApiPhone,
        });
        onNewCall();
    }, [form, identity?.phoneNumber, onNewCall]);

    return (
        <RefreshButton
            onClick={handleClick}
            label="ra.yemot_simulator.new_call"
            sx={{ marginInline: '1rem' }}
            size='medium'
            {...props}
        />
    );
};

const SimulatorToolbar = ({ phase, params, onNewCall }) => (
    <Toolbar>
        {phase !== 'hangup' && (
            <SaveButton
                label={phase === 'setup' ? 'ra.yemot_simulator.start_call' : 'ra.yemot_simulator.send'}
                alwaysEnable={true}
            />
        )}
        <NewCallButton onNewCall={onNewCall} />
        <HangupButton
            params={params}
            phase={phase}
            alwaysEnable={true}
            formNoValidate
        />
    </Toolbar>
);

const CallInputs = ({ phase, params, activeLabel }) => {
    const translate = useTranslate();

    return (
        <>
            <TextInput source="ApiCallId" validate={required()} readOnly sx={{ display: 'none' }} />
            <TextInput source="ApiExtension" validate={required()} readOnly sx={{ display: 'none' }} />
            <TextInput
                source="ApiDID"
                label="מספר מערכת"
                validate={required()}
                sx={{ display: phase === 'setup' ? undefined : 'none' }}
            />
            <TextInput
                source="ApiPhone"
                label="מאת מס׳ טלפון"
                validate={required()}
                sx={{ display: phase === 'setup' ? undefined : 'none' }}
            />
            <TextInput
                source="ApiEnterID"
                label="מספר זיהוי"
                sx={{ display: phase === 'setup' ? undefined : 'none' }}
            />
            {phase === 'in-call' && params.map(param => (
                <TextInput
                    source={param}
                    key={param}
                    label={activeLabel || translate('ra.yemot_simulator.answer_label')}
                    validate={required()}
                />
            ))}
        </>
    );
};

const HangupMessage = ({ phase }) => {
    const translate = useTranslate();

    if (phase !== 'hangup') return null;

    return (
        <Box sx={{ marginY: 2, padding: 2, backgroundColor: '#ffebee', borderRadius: 1, textAlign: 'center' }}>
            <Typography>{translate('ra.yemot_simulator.hangup_message')}</Typography>
        </Box>
    );
};

// Main Component
const YemotSimulator = () => {
    const dataProvider = useDataProvider();
    const { identity } = useGetIdentity();
    const [history, setHistory] = useState([]);
    const [params, setParams] = useState([]);
    const [phase, setPhase] = useState('setup');
    const [setupValues, setSetupValues] = useState(null);
    const notify = useNotify();
    const sessionRef = useRef(0);

    const { mutate } = useMutation({
        mutationFn: (body) => dataProvider.simulateYemotCall(body),
        onMutate: () => ({ session: sessionRef.current }),
        onSuccess: (data, variables, context) => {
            if (context.session !== sessionRef.current) {
                return;
            }

            const parsedData = parseYemotResponse(data.body);

            if (phase === 'setup') {
                setSetupValues({
                    ApiDID: variables.ApiDID,
                    ApiPhone: variables.ApiPhone,
                    ApiEnterID: variables.ApiEnterID,
                });
                setPhase('in-call');
            }

            if (parsedData.lines.length > 0) {
                setHistory(prevData => ([...prevData, { prompt: parsedData.lines }]));
            }

            if (parsedData.param) {
                setParams([parsedData.param]);
            }

            if (parsedData.hangup) {
                setPhase('hangup');
                return;
            }

            notify('ra.yemot_simulator.step_success', { type: 'info' });
        },
        onError: (error, variables, context) => {
            if (context.session !== sessionRef.current) {
                return;
            }
            notify('ra.message.error', { type: 'error' });
        }
    });

    const handleSubmit = useCallback((body) => {
        setHistory(prevData => {
            if (prevData.length === 0) {
                return prevData;
            }
            const answer = params.map(param => body[param]).filter(Boolean).join(', ');
            if (!answer) {
                return prevData;
            }
            const updated = [...prevData];
            updated[updated.length - 1] = { ...updated[updated.length - 1], answer };
            return updated;
        });
        mutate(body);
    }, [mutate, params]);

    const handleNewCall = useCallback(() => {
        sessionRef.current += 1;
        setHistory([]);
        setParams([]);
        setPhase('setup');
        setSetupValues(null);
    }, []);

    const activeLabel = history.length ? getPromptText(history[history.length - 1].prompt) : '';
    const initialDefaultValues = {
        ...DEFAULT_VALUES,
        ApiPhone: identity?.phoneNumber || DEFAULT_VALUES.ApiPhone,
    };

    return (
        <Card>
            <Title title="סימולטור" />
            <CardContent>
                <SimpleForm
                    onSubmit={handleSubmit}
                    defaultValues={initialDefaultValues}
                    toolbar={
                        <SimulatorToolbar
                            phase={phase}
                            params={params}
                            onNewCall={handleNewCall}
                        />
                    }
                >
                    <PhonePrefill phase={phase} />
                    <CallSetupSummary values={phase !== 'setup' ? setupValues : null} />
                    <ConversationTranscript history={history} />
                    <CallInputs phase={phase} params={params} activeLabel={activeLabel} />
                </SimpleForm>
                <HangupMessage phase={phase} />
            </CardContent>
        </Card>
    );
};

export default YemotSimulator;
