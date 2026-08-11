import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotify, useGetIdentity } from 'react-admin';
import { Box, Card, CardContent, Container, TextField, Button, Typography, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import dataProvider from '@shared/providers/dataProvider';
import { readAsDataURL } from '@shared/utils/fileUtil';

const emptyValues = { name: '', email: '', phone: '', message: '' };

/**
 * Public "contact us" page - reachable by both anonymous and logged-in users
 * (registered as a noLayout route, see CommonRoutes.jsx). Submits directly to
 * the shared server's POST /contact endpoint, which emails the message (with
 * any attached files) to the app's support address.
 */
export const ContactPage = () => {
    const notify = useNotify();
    const { identity } = useGetIdentity();
    const [values, setValues] = useState(emptyValues);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    // Prefill name/email for logged-in users; anonymous visitors just get blank fields.
    useEffect(() => {
        if (!identity) return;
        setValues((prev) => ({
            ...prev,
            name: prev.name || identity.fullName || '',
            email: prev.email || identity.email || identity.username || '',
        }));
    }, [identity]);

    const handleChange = (field) => (event) => setValues((prev) => ({ ...prev, [field]: event.target.value }));

    const handleFilesChange = (event) => setFiles(Array.from(event.target.files || []));

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const uploadedFiles = await Promise.all(
                files.map(async (file) => ({ name: file.name, src: await readAsDataURL(file) }))
            );
            await dataProvider.sendContactMessage({ ...values, files: uploadedFiles });
            notify('ההודעה נשלחה בהצלחה', { type: 'success' });
            setValues(emptyValues);
            setFiles([]);
        } catch (error) {
            notify('אירעה שגיאה בשליחת ההודעה, נסו שוב', { type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'grey.50',
                py: 6,
            }}
        >
            <Container maxWidth="sm">
                <Card>
                    <CardContent component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
                        <Typography variant="h5" component="h1" gutterBottom textAlign="center">
                            צור קשר
                        </Typography>
                        <TextField
                            label="שם"
                            value={values.name}
                            onChange={handleChange('name')}
                            required
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="אימייל"
                            type="email"
                            value={values.email}
                            onChange={handleChange('email')}
                            required
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="טלפון"
                            value={values.phone}
                            onChange={handleChange('phone')}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="הודעה"
                            value={values.message}
                            onChange={handleChange('message')}
                            required
                            fullWidth
                            multiline
                            rows={4}
                            margin="normal"
                        />
                        <Button component="label" variant="outlined" startIcon={<AttachFileIcon />} sx={{ mt: 2 }}>
                            צירוף קבצים
                            <input type="file" multiple hidden onChange={handleFilesChange} />
                        </Button>
                        {files.length > 0 && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {files.map((file) => file.name).join(', ')}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
                            sx={{ mt: 3 }}
                        >
                            שליחה
                        </Button>
                        <Box textAlign="center" sx={{ mt: 2 }}>
                            <Link to="/">חזרה לדף הבית</Link>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default ContactPage;
