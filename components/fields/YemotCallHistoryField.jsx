import { useMemo } from 'react';
import { useRecordContext, useNotify } from 'react-admin';
import get from 'lodash/get';
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
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Standalone dialog, rendered once by the list (not per-row) and driven by
// whichever record is passed in - see yemot-call.jsx for how it's opened
// (row click, or a deep link via the callId URL param).
export const YemotCallDetailsDialog = ({ record, onClose }) => {
    const notify = useNotify();
    const history = get(record, 'history');

    const handleCopyLink = async () => {
        const url = new URL(window.location.href);
        url.search = `?callId=${record.id}`;
        try {
            await navigator.clipboard.writeText(url.toString());
            notify('הקישור הועתק');
        } catch {
            notify('העתקת הקישור נכשלה', { type: 'error' });
        }
    };

    return (
        <Dialog
            open={Boolean(record)}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">פרטי השיחה</Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {history && <V2ConversationHistory history={history} />}
            </DialogContent>
            <DialogActions>
                <Button startIcon={<ContentCopyIcon />} onClick={handleCopyLink}>העתק קישור</Button>
                <Button onClick={onClose}>סגור</Button>
            </DialogActions>
        </Dialog>
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

// Last bot prompt actually sent, regardless of whether/how the caller
// answered it (or whether they answered at all). Only the v2 conversation
// tracker ever writes params.prompt - legacy steps' params is the raw Yemot
// webhook body - so this naturally has nothing to find on legacy calls
// without needing a separate data.version check.
const getLastSentMessage = (history) => {
    for (let i = history.length - 1; i >= 0; i--) {
        const prompt = get(history[i], 'params.prompt');
        if (prompt) {
            return cleanBotText(prompt);
        }
    }
    return null;
};

// Its own column - plain text like every other TextField-shaped column, not
// a chip, plus a view-dialog button. The row itself is already clickable
// (see yemot-call.jsx's rowClick) but nothing signaled that, so this button
// is the visible affordance; onOpen is the same handler the row uses, just
// invoked directly instead of relying on the click bubbling up.
export const LastSentMessageField = ({ onOpen }) => {
    const record = useRecordContext();
    const history = get(record, 'history');
    const isEmpty = !Array.isArray(history) || history.length === 0;
    const message = isEmpty ? null : getLastSentMessage(history);
    const isV2Call = get(record, 'data.version') === 'v2';

    const handleOpen = (e) => {
        e.stopPropagation();
        onOpen?.(record);
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isEmpty ? (
                <Typography component="span" variant="body2" color="text.secondary">אין פעילות</Typography>
            ) : message ? (
                <Tooltip title={message}>
                    <Typography component="span" variant="body2" noWrap sx={{ maxWidth: 220, display: 'inline-block' }}>
                        {message}
                    </Typography>
                </Tooltip>
            ) : null}
            {isV2Call && (
                <Tooltip title="צפייה בפרטי השיחה">
                    <IconButton size="small" onClick={handleOpen} sx={{ padding: '2px' }}>
                        <VisibilityIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            )}
        </Box>
    );
};
