
import React from 'react';
import { SimpleForm, DateInput, NumberInput } from 'react-admin';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import { ReportHeader } from './ReportHeader';
import { StudentList } from './StudentList';
import { FormActions } from './FormActions';

export const MainReport = ({ gradeMode, handleSave }) => (
    <>
        <ReportHeader />
        <SimpleForm toolbar={null} onSubmit={handleSave}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <DateInput 
                        source="reportDate" 
                        label="תאריך דוח" 
                        defaultValue={new Date().toISOString().split('T')[0]} 
                        fullWidth 
                    />
                </Grid>
                {!gradeMode && (
                    <Grid item xs={6}>
                        <NumberInput 
                            source="howManyLessons" 
                            label="מספר שיעורים" 
                            defaultValue={1} 
                            fullWidth 
                        />
                    </Grid>
                )}
            </Grid>
            <Divider />
            <StudentList />
            <FormActions />
        </SimpleForm>
    </>
);