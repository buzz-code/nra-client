import React, { useEffect } from 'react';
import { Box, Card, CardContent, Typography, Container } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import EngineeringIcon from '@mui/icons-material/Engineering';
import authProvider from '@shared/providers/authProvider';
import { useNavigate } from 'react-router-dom';

/**
 * MaintenancePage - Displayed when the system is under maintenance
 * 
 * This component shows a user-friendly maintenance message with RTL support
 * and follows the application's design patterns.
 * 
 * Features:
 * - Gets maintenance data directly from authProvider
 * - Uses plain Hebrew text (not i18n) to ensure it works during redirects
 * - Checks once on mount if maintenance mode is still active
 * - Auto-redirects to dashboard when refreshed and server is back online
 */
export const MaintenancePage = () => {
    const maintenanceInfo = authProvider.getMaintenanceInfo();
    const message = maintenanceInfo?.message;
    const navigate = useNavigate();
    
    useEffect(() => {
        // Check once on mount if maintenance mode is still active
        const checkMaintenanceStatus = async () => {
            try {
                // Try to get identity - if successful, server is no longer in maintenance
                await authProvider.getIdentity(true);
                
                // Success - maintenance mode is over, redirect to dashboard
                authProvider.clearMaintenanceInfo();
                navigate('/');
            } catch (error) {
                // Still in maintenance mode (503 response) or network error - stay on page
            }
        };
        
        checkMaintenanceStatus();
    }, [navigate]);
    
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background decorative elements */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '-10%',
                    right: '-10%',
                    width: '40%',
                    height: '40%',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    filter: 'blur(60px)',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '-10%',
                    left: '-10%',
                    width: '40%',
                    height: '40%',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    filter: 'blur(60px)',
                }}
            />
            
            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                <Card
                    elevation={10}
                    sx={{
                        borderRadius: 4,
                        overflow: 'hidden',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                    }}
                >
                    <Box
                        sx={{
                            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                            padding: 4,
                            textAlign: 'center',
                            color: 'white',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                mb: 2,
                            }}
                        >
                            <EngineeringIcon sx={{ fontSize: 80, mr: 2 }} />
                            <BuildIcon sx={{ fontSize: 60 }} />
                        </Box>
                        <Typography variant="h4" component="h1" fontWeight="bold">
                            המערכת בתחזוקה
                        </Typography>
                    </Box>
                    
                    <CardContent sx={{ p: 4 }}>
                        <Typography
                            variant="h6"
                            color="text.primary"
                            textAlign="center"
                            mb={3}
                            fontWeight="500"
                        >
                            {message || 'אנו מבצעים עבודות תחזוקה כדי לשפר את המערכת. המערכת תחזור לפעול בקרוב.'}
                        </Typography>
                        
                        <Box
                            sx={{
                                borderTop: '1px solid',
                                borderColor: 'divider',
                                pt: 3,
                                mt: 3,
                            }}
                        >
                            <Typography variant="body2" color="text.secondary" textAlign="center">
                                תודה על סבלנותך. נעשה הכל כדי להחזיר את המערכת לפעולה במהירות האפשרית.
                            </Typography>
                        </Box>
                        
                        {/* Animated dots to indicate ongoing work */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: 1,
                                mt: 3,
                            }}
                        >
                            {[0, 1, 2].map((index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: '50%',
                                        backgroundColor: 'primary.main',
                                        animation: 'pulse 1.5s ease-in-out infinite',
                                        animationDelay: `${index * 0.2}s`,
                                        '@keyframes pulse': {
                                            '0%, 100%': {
                                                opacity: 0.3,
                                                transform: 'scale(0.8)',
                                            },
                                            '50%': {
                                                opacity: 1,
                                                transform: 'scale(1.2)',
                                            },
                                        },
                                    }}
                                />
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default MaintenancePage;
