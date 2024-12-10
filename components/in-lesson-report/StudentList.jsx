import React, { useCallback, useContext, useMemo } from 'react';
import { FormDataConsumer, NumberInput, DateInput, minValue, maxValue } from 'react-admin';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { CommonSliderInput } from '../fields/CommonSliderInput';
import { ReportContext } from './context';

export const getDefaultReportDate = () => new Date().toISOString().split('T')[0];

export const StudentList = ({ reportDates, setReportDates }) => {
    const { gradeMode, isShowLate, students } = useContext(ReportContext);

    const columns = useMemo(() => {
        const cols = [];
        if (gradeMode) {
            cols.push({ id: 'grade', label: 'ציון', type: 'number' });
        } else {
            cols.push({ id: 'absence', label: 'חיסורים', type: 'slider' });
            if (isShowLate) {
                cols.push({ id: 'late', label: 'איחורים', type: 'slider' });
            }
        }
        return cols;
    }, [gradeMode, isShowLate]);

    const handleDateChange = useCallback((index) => (date) => {
        setReportDates(reportDates => {
            const newDates = [...reportDates];
            newDates[index] = date;
            return newDates;
        });
    }, [setReportDates]);

    const addReportDate = useCallback(() => {
        setReportDates(reportDates => [...reportDates, getDefaultReportDate()]);
    }, [setReportDates]);

    return (
        <TableContainer component={Paper}>
            <Table stickyHeader size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Button onClick={addReportDate}>הוסף תאריך חדש</Button>
                        </TableCell>
                        {reportDates.map((date, index) => (
                            <TableCell
                                key={`date-${index}`}
                                colSpan={columns.length}
                            >
                                <DateInput
                                    source={`reportDates[${index}]`}
                                    label={`תאריך דוח ${index + 1}`}
                                    defaultValue={date}
                                    onChange={handleDateChange(index)}
                                    fullWidth
                                    helperText={false}
                                />
                            </TableCell>
                        ))}
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Text>שם התלמידה</Text>
                        </TableCell>
                        {reportDates.map((date, index) => (
                            columns.map(column => (
                                <TableCell key={`header-${index}-${column.id}`}>
                                    <Text>{column.label}</Text>
                                </TableCell>
                            ))
                        ))}
                    </TableRow>
                </TableHead>
                <FormDataConsumer>
                    {({ formData, ...rest }) => (
                        <TableBody>
                            {students
                                .filter(student => student.student)
                                .map(student => (
                                    <TableRow key={student.student.id}>
                                        <TableCell>
                                            <Text>{student.student.name}</Text>
                                        </TableCell>
                                        {reportDates.map((date, index) => (
                                            <ReportItemInputs
                                                key={`report-${student.student.id}-${index}`}
                                                index={index}
                                                columns={columns}
                                                studentId={student.student.id}
                                                lessonCount={formData.howManyLessons}
                                                {...rest}
                                            />
                                        ))}
                                    </TableRow>
                                ))}
                        </TableBody>
                    )}
                </FormDataConsumer>
            </Table>
        </TableContainer>
    );
};

const Text = ({ children }) => (
    <Typography variant="body1" component="div">
        {children}
    </Typography>
);

const ReportItemInputs = ({ index, columns, studentId, lessonCount, ...rest }) => (
    columns.map((column) => (
        <TableCell key={column.id}>
            {column.type === 'number' ? (
                <NumberInput
                    source={`${studentId}.${column.id}_${index}`}
                    label={column.label}
                    validate={[minValue(0), maxValue(1_000_000)]}
                    helperText={false}
                    sx={{
                        '& .MuiInputBase-root': {
                            padding: 0,
                            margin: 0
                        },

                    }}
                    {...rest}
                />
            ) : (
                <CommonSliderInput
                    source={`${studentId}.${column.id}_${index}`}
                    max={lessonCount}
                    {...rest}
                />
            )}
        </TableCell>
    ))
);
