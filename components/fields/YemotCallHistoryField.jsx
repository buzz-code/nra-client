import React, { useMemo, useState } from 'react';
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
import { Visibility as VisibilityIcon, Close as CloseIcon } from '@mui/icons-material';

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

const V2ConversationHistory = ({ history }) => {
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

    const getStepIcon = (stepType) => {
        switch (stepType) {
            case 'ask_input':
            case 'ask_menu':
            case 'ask_confirmation':
                return '❓';
            case 'user_input':
            case 'menu_selection':
            case 'confirmation_result':
                return '✅';
            case 'send_message':
                return '💬';
            case 'hangup_message':
                return '📞';
            default:
                return '🔄';
        }
    };

    const getStepColor = (stepType) => {
        switch (stepType) {
            case 'ask_input':
            case 'ask_menu':
            case 'ask_confirmation':
                return '#1976d2'; // primary
            case 'user_input':
            case 'menu_selection':
            case 'confirmation_result':
                return '#2e7d32'; // success
            case 'send_message':
                return '#0288d1'; // info
            case 'hangup_message':
                return '#ed6c02'; // warning
            default:
                return '#757575'; // default
        }
    };

    return (
        <Box sx={{ maxWidth: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>
                שיחה ({history.length} צעדים)
            </Typography>
            <Stack spacing={1} sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {history.map((step, index) => {
                    const params = step.params || {};
                    const stepType = params.stepType || 'unknown';
                    const prompt = params.prompt;
                    const userResponse = params.userResponse;

                    return (
                        <Paper
                            key={index}
                            elevation={1}
                            sx={{
                                p: 1.5,
                                backgroundColor: userResponse ? '#f8f9fa' : '#fff',
                                borderRight: `3px solid ${getStepColor(stepType)}`
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                <Typography sx={{ fontSize: '1.2em', minWidth: '24px' }}>
                                    {getStepIcon(stepType)}
                                </Typography>
                                <Box sx={{ flex: 1 }}>
                                    {prompt && (
                                        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                                            {prompt}
                                        </Typography>
                                    )}
                                    {userResponse && (
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: '#2e7d32',
                                                backgroundColor: '#e8f5e8',
                                                padding: '4px 8px',
                                                borderRadius: 1,
                                                fontWeight: 600,
                                                mb: 0.5
                                            }}
                                        >
                                            תגובת המשתמש: {userResponse}
                                        </Typography>
                                    )}
                                    <Typography variant="caption" color="textSecondary">
                                        {formatTime(step.time)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
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
