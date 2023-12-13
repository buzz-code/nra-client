import React, { useCallback, useMemo, useState } from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Button, DateInput, FormDataConsumer, NumberInput, SaveButton, SimpleForm, TextInput, useDataProvider, useNotify, useRedirect } from 'react-admin';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useSavableData } from '../import/util';
import { Datagrid } from 'src/entities/att-report';
import { PreviewListWithSavingDialog } from '../import/PreviewListWithSavingDialog';
import { CommonSliderInput } from '../fields/CommonSliderInput';
import { useIsInLessonReportWithLate } from '@shared/utils/permissionsUtil';

const resource = 'att_report';

export default () => {
    const fileName = useMemo(() => 'דיווח שיעור ' + new Date().toISOString().split('T')[0], []);
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const redirect = useRedirect();
    const isShowLate = useIsInLessonReportWithLate();
    const columnWidth = useMemo(() => isShowLate ? 4 : 6, [isShowLate]);
    const [lessonKey, setLessonKey] = useState(null);
    const [lesson, setLesson] = useState(null);
    const [students, setStudents] = useState(null);
    const [dataToSave, setDataToSave] = useState(null);
    const { data, saveData } = useSavableData(resource, fileName, dataToSave);

    const handleGetLesson = useCallback(async (lessonKey) => {
        try {
            const { data: lessons } = await dataProvider.getManyReference('lesson', {
                target: 'key',
                id: lessonKey,
                pagination: { page: 1, perPage: 1 }
            });
            if (lessons.length === 0) {
                throw new Error('Lesson not found');
            }

            const { data: students } = await dataProvider.getManyReference('student_klass', {
                target: 'klassReferenceId',
                id: lessons[0].klassReferenceIds[0],
                pagination: { page: 1, perPage: 1000 },
                sort: { field: 'student.name', order: 'ASC' }
            });
            setLesson(lessons[0]);
            setStudents(students);
        } catch (e) {
            notify('ra.message.lesson_not_found', { type: 'error' });
        }
    }, [dataProvider, notify, setLesson, setStudents]);

    const handleCancel = useCallback(() => {
        setLesson(null);
        setDataToSave(null);
    }, [setLesson]);

    const handleSave = useCallback((formData) => {
        const { reportDate, howManyLessons, ...rest } = formData;
        const dataToSave = Object.keys(rest).map((studentId) => ({
            reportDate: reportDate,
            teacherReferenceId: lesson.teacherReferenceId,
            klassReferenceId: lesson.klassReferenceIds[0],
            lessonReferenceId: lesson.id,
            studentReferenceId: studentId,
            howManyLessons: howManyLessons,
            absCount: (rest[studentId]?.absence ?? 0) + (rest[studentId]?.late ?? 0) * 0.3,
        }));
        setDataToSave(dataToSave);
    }, [data, lesson, students, setDataToSave]);

    const handleSuccess = useCallback(() => {
        redirect('/att_report_with_report_month');
    }, [redirect]);

    return (
        <Container maxWidth="sm" mt={4}>
            <Paper>
                <Stack>
                    {!lesson && <>
                        <Box padding={2}>
                            <Typography variant="h6" component="div">
                                בחרי שיעור
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                בחרי את השיעור שברצונך להעלות דוח נוכחות עבורו
                            </Typography>
                        </Box>
                        <Divider />
                        <Box padding={2}>
                            <SimpleForm toolbar={null} onSubmit={() => handleGetLesson(lessonKey)}>
                                <TextInput label="מזהה שיעור" source="lessonKey" onChange={(e) => setLessonKey(e.target.value)} />
                                <SaveButton icon={<PlayArrowIcon />} label='הצג שיעור' />
                            </SimpleForm>
                        </Box>
                    </>}
                    {lesson && <>
                        <Box padding={2}>
                            <Typography variant="h6" component="div">
                                סימון נוכחות לתלמידות - שיעור {lesson.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                סמני את התלמידות שחסרו בשיעור
                            </Typography>
                        </Box>
                        <Divider />
                        <SimpleForm toolbar={null} onSubmit={handleSave}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <DateInput source="reportDate" label="תאריך דוח" defaultValue={new Date().toISOString().split('T')[0]} fullWidth />
                                </Grid>
                                <Grid item xs={6} >
                                    <NumberInput source="howManyLessons" label="מספר שיעורים" defaultValue={1} fullWidth />
                                </Grid>
                            </Grid>
                            <Divider />
                            <Grid container spacing={2}>
                                <Grid item xs={columnWidth}>
                                    <Text>שם התלמידה</Text>
                                </Grid>
                                <Grid item xs={columnWidth}>
                                    <Text>חיסורים</Text>
                                </Grid>
                                {isShowLate && <Grid item xs={columnWidth}>
                                    <Text>איחורים</Text>
                                </Grid>}
                            </Grid>
                            <FormDataConsumer>
                                {({ formData, ...rest }) => (
                                    students.filter(student => student.student).map(student => (
                                        <Grid container spacing={2} key={student.student.id}>
                                            <Grid item xs={columnWidth}>
                                                <Text>{student.student.name}</Text>
                                            </Grid>
                                            <Grid item xs={columnWidth}>
                                                <CommonSliderInput source={String(student.student.id) + '.absence'} max={formData.howManyLessons} {...rest} />
                                            </Grid>
                                            {isShowLate && <Grid item xs={columnWidth}>
                                                <CommonSliderInput source={String(student.student.id) + '.late'} max={formData.howManyLessons} {...rest} />
                                            </Grid>}
                                        </Grid>
                                    ))
                                )}
                            </FormDataConsumer>
                            <Divider />
                            <Box padding={2}>
                                <Button onClick={handleCancel}><>ביטול</></Button>
                                <SaveButton alwaysEnable />
                            </Box>
                            <PreviewListWithSavingDialog resource={resource} datagrid={Datagrid}
                                data={data} saveData={saveData}
                                handleSuccess={handleSuccess} handlePreviewCancel={handleCancel} />
                        </SimpleForm>
                    </>}
                </Stack>
            </Paper>
        </Container>
    );
}

const Text = ({ children }) => (
    <Typography variant="body1" component="div">
        {children}
    </Typography>
);
