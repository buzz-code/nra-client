import React, { useCallback, useState } from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { BooleanInput, Button, SaveButton, SimpleForm, TextInput, useDataProvider, useNotify } from 'react-admin';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

export default () => {
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const [lessonKey, setLessonKey] = useState(null);
    const [lesson, setLesson] = useState(null);
    const [students, setStudents] = useState(null);

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
                        <SimpleForm toolbar={null} onSubmit={() => { }}>
                            <Box padding={2}>
                                {students.filter(student => student.student).map(student => (
                                    <Box key={student.student.id}>
                                        <BooleanInput label={student.student.name} source={String(student.student.id)} />
                                    </Box>
                                ))}
                            </Box>
                            <Divider />
                            <Box padding={2}>
                                <Button onClick={() => setLesson(null)}><>ביטול</></Button>
                                <SaveButton onClick={() => setLesson(null)} />
                            </Box>
                        </SimpleForm>
                    </>}
                </Stack>
            </Paper>
        </Container>
    );
}