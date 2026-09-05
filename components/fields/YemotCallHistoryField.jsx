import { useMemo, useState } from 'react';
import { useRecordContext, ArrayField, SingleFieldList } from 'react-admin';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import {
    Box,
    Typography,
    Paper,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';

const YemotCallHistoryField = ({ source }) => {
    const record = useRecordContext();

    if (!record || !record[source] || !Array.isArray(record[source])) {
        return <Typography variant="body2" color="textSecondary">אין היסטוריה</Typography>;
    }

    const history = record[source];
    const isV2Call = record.data?.version === 'v2';

    if (isV2Call) {
        return <V2ConversationSummary history={history} />;
    }

    // Fallback to legacy display
    return (
        <ArrayField source={source}>
            <SingleFieldList>
                <LegacyYemotCallHistoryItem />
            </SingleFieldList>
        </ArrayField>
    );
};

const V2ConversationSummary = ({ history }) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const summary = useMemo(() => {
        if (!history || history.length === 0) {
            return { steps: 0, lastAction: 'אין פעילות', status: 'ריק' };
        }

        const userResponses = history.filter(step =>
            step.params?.userResponse &&
            ['user_input', 'menu_selection', 'confirmation_result'].includes(step.params?.stepType)
        );

        const lastResponse = userResponses[userResponses.length - 1];
        const lastStep = history[history.length - 1];

        let lastAction = 'לא ידוע';
        if (lastResponse?.params?.userResponse) {
            lastAction = lastResponse.params.userResponse;
        } else if (lastStep?.params?.stepType === 'hangup_message') {
            lastAction = 'השיחה הסתיימה';
        }

        let status = 'בתהליך';
        if (lastStep?.params?.stepType === 'hangup_message') {
            status = 'הסתיים';
        }

        return {
            steps: history.length,
            lastAction: lastAction.length > 20 ? lastAction.substring(0, 20) + '...' : lastAction,
            status,
            userResponseCount: userResponses.length
        };
    }, [history]);

    const handleOpenDialog = (e) => {
        e.stopPropagation();
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                    size="small"
                    label={`${summary.steps} צעדים`}
                    color="primary"
                    variant="outlined"
                />
                <Chip
                    size="small"
                    label={summary.lastAction}
                    color={summary.status === 'הסתיים' ? 'success' : 'default'}
                />
                <IconButton
                    size="small"
                    onClick={handleOpenDialog}
                    sx={{ padding: '2px' }}
                >
                    <VisibilityIcon fontSize="small" />
                </IconButton>
            </Box>

            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">פרטי השיחה</Typography>
                    <IconButton onClick={handleCloseDialog}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <V2ConversationHistory history={history} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>סגור</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

const USER_STEP_TYPES = ['user_input', 'menu_selection', 'confirmation_result'];

// Finds raw ask_input/user_input steps duplicating an adjacent ask_confirmation/menu_selection
// (older calls only, server-side logging bug now fixed). Never touches a genuine retry.
const findDuplicateStepIndexes = (history) => {
    const skip = new Set();
    for (let i = 0; i < history.length; i++) {
        const cur = history[i]?.params || {};
        const next = history[i + 1]?.params;
        const after = history[i + 2]?.params;
        if (cur.stepType !== 'ask_input' || !next || next.stepType !== 'user_input' || next.userResponse === undefined || !after) {
            continue;
        }
        const rawResponse = String(next.userResponse);
        const richResponse = after.userResponse !== undefined ? String(after.userResponse) : '';
        const sameExchange = richResponse === rawResponse || richResponse.startsWith(`${rawResponse} `);
        if (!sameExchange) {
            continue;
        }
        if (after.stepType === 'confirmation_result' && history[i - 1]?.params?.stepType === 'ask_confirmation') {
            skip.add(i); // raw question, already shown by the preceding ask_confirmation
            skip.add(i + 1); // raw answer, already shown by confirmation_result
        } else if (after.stepType === 'menu_selection') {
            skip.add(i + 1); // raw answer only - the ask_input is the only record of the question, keep it
        }
    }
    return skip;
};

// Strips the legacy "[1: ..., 2: ...]" legend; already-clean data is untouched.
const cleanBotText = (text) => text.replace(/\s*\[\d+:\s*.+?\]\s*$/, '');

// "1 (הקישי 1 - כן)" -> "1 (כן)" - uses the digit already shown, not a guess at the wording around it.
const cleanUserText = (text) => {
    const match = text.match(/^(\d+) \((.+)\)$/);
    if (!match) {
        return text;
    }
    const [, digit, label] = match;
    const marker = `${digit} - `;
    const markerIndex = label.indexOf(marker);
    return markerIndex === -1 ? text : `${digit} (${label.slice(markerIndex + marker.length).trim()})`;
};

const V2ConversationHistory = ({ history }) => {
    const duplicateIndexes = useMemo(() => findDuplicateStepIndexes(history), [history]);

    const formatTime = (timeString) => {
        try {
            const time = new Date(timeString);
            return time.toLocaleString('he-IL', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        } catch {
            return timeString;
        }
    };

    return (
        <Box sx={{ maxWidth: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>
                שיחה ({history.length} צעדים)
            </Typography>
            <Stack spacing={1} sx={{ maxHeight: '60vh', overflowY: 'auto', p: 1 }}>
                {history.map((step, index) => {
                    if (duplicateIndexes.has(index)) {
                        return null;
                    }

                    const params = step.params || {};
                    const stepType = params.stepType || 'unknown';
                    const prompt = params.prompt;
                    const userResponse = params.userResponse;

                    if (stepType === 'hangup_message') {
                        return (
                            <Box key={index} sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
                                <Chip size="small" label={`📞 ${prompt || 'השיחה הסתיימה'}`} sx={{ backgroundColor: '#eeeeee' }} />
                            </Box>
                        );
                    }

                    const isUserMessage = USER_STEP_TYPES.includes(stepType) && userResponse;
                    const rawText = isUserMessage ? userResponse : prompt;
                    if (!rawText) {
                        return null;
                    }
                    const bubbleText = isUserMessage ? cleanUserText(rawText) : cleanBotText(rawText);

                    return (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                justifyContent: isUserMessage ? 'flex-end' : 'flex-start'
                            }}
                        >
                            <Paper
                                elevation={1}
                                sx={{
                                    maxWidth: '75%',
                                    p: 1.2,
                                    borderRadius: 2,
                                    backgroundColor: isUserMessage ? '#dcf5dc' : '#e3f0fd',
                                    color: isUserMessage ? '#1b5e20' : '#0d47a1'
                                }}
                            >
                                <Typography variant="body2" sx={{ fontWeight: isUserMessage ? 600 : 400 }}>
                                    {bubbleText}
                                </Typography>
                                <Typography variant="caption" sx={{ display: 'block', opacity: 0.6, mt: 0.3 }}>
                                    {formatTime(step.time)}
                                </Typography>
                            </Paper>
                        </Box>
                    );
                })}
            </Stack>
        </Box>
    );
};

// Legacy component for older calls
const LegacyYemotCallHistoryItem = () => {
    const record = useRecordContext();
    if (!record || !record.response) {
        return null;
    }

    const parsedResponse = useMemo(() => {
        return record.response?.split('&')
            .map((item) => {
                const [key, value] = item.split('=');
                return { key, value };
            })
            .filter(({ key, value }) => Boolean(value))
            .map(({ key, value }) => {
                const [type, text] = value.split('-');
                return text ?? value;
            })
            .join(', ');
    }, [record.response]);

    if (!parsedResponse) {
        return null;
    }

    return (
        <Tooltip title={record.time}>
            <Chip label={parsedResponse} />
        </Tooltip>
    );
};

export default YemotCallHistoryField;
