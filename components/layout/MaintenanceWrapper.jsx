import React, { useEffect, useState } from 'react';
import { MaintenancePage } from './MaintenancePage';
import authProvider from '@shared/providers/authProvider';

/**
 * MaintenanceWrapper - Wraps the application and shows maintenance page when needed
 * 
 * This component periodically checks for maintenance mode and displays
 * the MaintenancePage when the system is under maintenance.
 */
export const MaintenanceWrapper = ({ children }) => {
    const [maintenanceInfo, setMaintenanceInfo] = useState(null);
    const [isChecking, setIsChecking] = useState(true);

    const checkMaintenanceMode = () => {
        const info = authProvider.getMaintenanceInfo();
        if (info && info.active) {
            setMaintenanceInfo(info);
        } else {
            setMaintenanceInfo(null);
        }
        setIsChecking(false);
    };

    useEffect(() => {
        // Initial check
        checkMaintenanceMode();

        // Set up periodic checking (every 30 seconds)
        const interval = setInterval(checkMaintenanceMode, 30000);

        return () => clearInterval(interval);
    }, []);

    // Show nothing while checking initially
    if (isChecking) {
        return null;
    }

    // Show maintenance page if in maintenance mode
    if (maintenanceInfo && maintenanceInfo.active) {
        return (
            <MaintenancePage
                message={maintenanceInfo.message}
            />
        );
    }

    // Otherwise, render the normal app
    return <>{children}</>;
};

export default MaintenanceWrapper;
