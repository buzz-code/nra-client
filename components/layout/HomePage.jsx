import { Box, Container, Typography, Button, Grid, Card, CardContent, Chip, Avatar } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import CheckIcon from '@mui/icons-material/Check';
import { Link } from 'react-router-dom';

/**
 * Public marketing/explainer page shown at "/" to anonymous visitors,
 * in place of the login form. Content is per-project - AdminAppShell's
 * `homeContent` prop is spread directly into this component's props.
 *
 * Props:
 *  - eyebrow     {string}  Small badge above the title (e.g. "מערכת ניהול בית ספרית")
 *  - appTitle    {string}  System name (e.g. "נוכחות")
 *  - tagline     {string}  One-line value proposition
 *  - description {string}  Short paragraph explaining the system
 *  - features    {Array<{icon?: Component, title: string, text: string}>}
 *  - steps       {Array<{title: string, text: string}>}  Optional "how it works" walkthrough
 *  - ctaLabel    {string}  Login button label
 *  - closingTitle {string} Optional heading for the closing call-to-action band
 */
export const HomePage = ({
    eyebrow,
    appTitle,
    tagline,
    description,
    features = [],
    steps = [],
    ctaLabel = 'כניסה למערכת',
    closingTitle,
}) => (
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
                {eyebrow && (
                    <Chip
                        label={eyebrow}
                        sx={{
                            mb: 3,
                            bgcolor: 'rgba(255,255,255,0.15)',
                            color: 'common.white',
                            fontWeight: 500,
                        }}
                    />
                )}
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

        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
            {description && (
                <Typography
                    variant="body1"
                    color="text.secondary"
                    textAlign="center"
                    sx={{ mb: 6, maxWidth: 720, mx: 'auto' }}
                >
                    {description}
                </Typography>
            )}

            {features.length > 0 && (
                <Grid container spacing={3}>
                    {/* Avoid a single orphaned card on its own row (e.g. 4 features in 3 columns) */}
                    {features.map((feature) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={features.length % 3 === 1 ? 6 : 4}
                            key={feature.title}
                        >
                            <Card
                                variant="outlined"
                                sx={{
                                    height: '100%',
                                    transition: 'box-shadow 0.2s, transform 0.2s',
                                    '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
                                }}
                            >
                                <CardContent>
                                    {feature.icon && (
                                        <Avatar
                                            sx={{
                                                bgcolor: 'primary.main',
                                                width: 48,
                                                height: 48,
                                                mb: 2,
                                            }}
                                        >
                                            <feature.icon />
                                        </Avatar>
                                    )}
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

        {steps.length > 0 && (
            <Box sx={{ bgcolor: 'grey.50', py: { xs: 6, md: 8 } }}>
                <Container maxWidth="lg">
                    <Typography variant="h4" component="h2" textAlign="center" fontWeight="bold" sx={{ mb: 6 }}>
                        איך זה עובד
                    </Typography>
                    <Grid container spacing={4}>
                        {steps.map((step, index) => (
                            <Grid item xs={12} sm={4} key={step.title} sx={{ textAlign: 'center' }}>
                                <Avatar
                                    sx={{
                                        bgcolor: 'secondary.main',
                                        width: 40,
                                        height: 40,
                                        mx: 'auto',
                                        mb: 2,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {index + 1}
                                </Avatar>
                                <Typography variant="h6" component="h3" gutterBottom>
                                    {step.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {step.text}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        )}

        {closingTitle && (
            <Box
                sx={{
                    py: { xs: 6, md: 8 },
                    textAlign: 'center',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
                    {closingTitle}
                </Typography>
                <Button
                    component={Link}
                    to="/login"
                    variant="contained"
                    size="large"
                    color="primary"
                    startIcon={<CheckIcon />}
                    sx={{ mt: 2 }}
                >
                    {ctaLabel}
                </Button>
            </Box>
        )}
    </Box>
);

export default HomePage;
