import React, { useState } from 'react';
import { SimpleForm, NumberInput } from 'react-admin';
import Divider from '@mui/material/Divider';
import { ReportHeader } from './ReportHeader';
import { getDefaultReportDate, StudentList } from './StudentList';
import { FormActions } from './FormActions';

export const MainReport = ({ gradeMode, handleSave }) => {
    const [reportDates, setReportDates] = useState([getDefaultReportDate()]);

    return (
        <>
            <ReportHeader />
            <SimpleForm toolbar={null} onSubmit={handleSave}>
                {!gradeMode && (
                    <NumberInput
                        source="howManyLessons"
                        label="מספר שיעורים"
                        defaultValue={1}
                        fullWidth
                    />
                )}
                <Divider />
                <StudentList
                    reportDates={reportDates}
                    setReportDates={setReportDates}
                />
                <FormActions />
            </SimpleForm>
        </>
    );
};