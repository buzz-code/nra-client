import { Box, Container, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { Link } from 'react-router-dom';

/**
 * Public marketing/explainer page shown at "/" to anonymous visitors,
 * in place of the login form. Content is per-project (see LoginPage's
 * `homeContent` prop, threaded from AdminAppShell).
 *
 * Props:
 *  - appTitle    {string}  System name (e.g. "נוכחות")
 *  - tagline     {string}  One-line value proposition
 *  - description {string}  Short paragraph explaining the system
 *  - features    {Array<{title: string, text: string}>}
 *  - ctaLabel    {string}  Login button label
 */
export const HomePage = ({ appTitle, tagline, description, features = [], ctaLabel = 'כניסה למערכת' }) => (
    <Box sx={{ minHeight: '100vh', overflow: 'auto' }}>
        <Box
            sx={{
                background: (theme) =>
                    `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                color: 'common.white',
                py: { xs: 8, md: 12 },
            }}
        >
            <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                    {appTitle}
                </Typography>
                {tagline && (
                    <Typography variant="h6" component="p" sx={{ opacity: 0.9, mb: 4 }}>
                        {tagline}
                    </Typography>
                )}
                <Button
                    component={Link}
                    to="/login"
                    variant="contained"
                    size="large"
                    color="secondary"
                    startIcon={<LoginIcon />}
                    sx={{ color: 'common.white' }}
                >
                    {ctaLabel}
                </Button>
            </Container>
        </Box>

        <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
            {description && (
                <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
                    {description}
                </Typography>
            )}

            {features.length > 0 && (
                <Grid container spacing={3}>
                    {features.map((feature) => (
                        <Grid item xs={12} sm={6} md={4} key={feature.title}>
                            <Card variant="outlined" sx={{ height: '100%' }}>
                                <CardContent>
                                    <Typography variant="h6" component="h2" gutterBottom>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {feature.text}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    </Box>
);

export default HomePage;
