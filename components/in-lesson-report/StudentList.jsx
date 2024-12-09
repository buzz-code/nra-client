import React, { useContext, useMemo } from 'react';
import { Grid, Typography } from '@mui/material';
import { FormDataConsumer, NumberInput } from 'react-admin';
import { CommonSliderInput } from '../fields/CommonSliderInput';
import { ReportContext } from './context';

const Text = ({ children }) => (
    <Typography variant="body1" component="div">
        {children}
    </Typography>
);

export const StudentList = () => {
    const { gradeMode, isShowLate, students } = useContext(ReportContext);
    const columnWidth = useMemo(() => !gradeMode && isShowLate ? 4 : 6, [isShowLate]);

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={columnWidth}>
                    <Text>שם התלמידה</Text>
                </Grid>
                {gradeMode ? (
                    <Grid item xs={columnWidth}>
                        <Text>ציון</Text>
                    </Grid>
                ) : (
                    <>
                        <Grid item xs={columnWidth}>
                            <Text>חיסורים</Text>
                        </Grid>
                        {isShowLate && (
                            <Grid item xs={columnWidth}>
                                <Text>איחורים</Text>
                            </Grid>
                        )}
                    </>
                )}
            </Grid>
            <FormDataConsumer>
                {({ formData, ...rest }) => (
                    students.filter(student => student.student).map(student => (
                        <Grid container spacing={2} key={student.student.id}>
                            <Grid item xs={columnWidth}>
                                <Text>{student.student.name}</Text>
                            </Grid>
                            {gradeMode ? (
                                <Grid item xs={columnWidth}>
                                    <NumberInput source={String(student.student.id) + '.grade'} label='ציון' {...rest} min={0} max={1_000_000} />
                                </Grid>
                            ) : <>
                                <Grid item xs={columnWidth}>
                                    <CommonSliderInput source={String(student.student.id) + '.absence'} max={formData.howManyLessons} {...rest} />
                                </Grid>
                                {isShowLate && <Grid item xs={columnWidth}>
                                    <CommonSliderInput source={String(student.student.id) + '.late'} max={formData.howManyLessons} {...rest} />
                                </Grid>}
                            </>}
                        </Grid>
                    ))
                )}
            </FormDataConsumer>
        </>
    );
};