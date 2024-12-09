import React, { useCallback, useState } from 'react';
import { Container, Paper, Stack } from '@mui/material';
import { ReportContext, defaultContextValue } from './context';
import { LessonSelector } from './LessonSelector';
import { MainReport } from './MainReport';
import { round } from '@shared/utils/numericUtil';

export const InLessonReport = ({
    gradeMode,
    resource,
    Datagrid,
    handleSuccess,
    setDataToSave,
    data,
    saveData,
    isShowLate
}) => {
    const [lesson, setLesson] = useState(null);
    const [students, setStudents] = useState(null);

    const handleLessonFound = useCallback(({ lesson, students }) => {
        setLesson(lesson);
        setStudents(students);
    }, []);

    const handleCancel = useCallback(() => {
        setLesson(null);
        setDataToSave(null);
    }, []);

    const handleSave = useCallback((formData) => {
        const { reportDate, howManyLessons, ...rest } = formData;
        const dataToSave = Object.keys(rest).map((studentId) => ({
            reportDate,
            teacherReferenceId: lesson.teacherReferenceId,
            klassReferenceId: lesson.klassReferenceIds[0],
            lessonReferenceId: lesson.id,
            studentReferenceId: studentId,
            ...(gradeMode
                ? { grade: rest[studentId]?.grade ?? 0 }
                : {
                    howManyLessons,
                    absCount: round(
                        (rest[studentId]?.absence ?? 0) +
                        (rest[studentId]?.late ?? 0) * 0.3
                    ),
                })
        }));
        setDataToSave(dataToSave);
    }, [lesson, gradeMode]);

    const contextValue = {
        ...defaultContextValue,
        gradeMode,
        isShowLate,
        lesson,
        students,
        resource,
        Datagrid,
        data,
        saveData,
        handleSuccess,
        handleCancel,
    };

    return (
        <Container maxWidth="sm" mt={4}>
            <Paper>
                <Stack>
                    {!lesson ? (
                        <LessonSelector onLessonFound={handleLessonFound} />
                    ) : (
                        <ReportContext.Provider value={contextValue}>
                            <MainReport gradeMode={gradeMode} handleSave={handleSave} />
                        </ReportContext.Provider>
                    )}
                </Stack>
            </Paper>
        </Container>
    );
};