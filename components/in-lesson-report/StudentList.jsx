import React, { useContext, useMemo } from 'react';
import { FormDataConsumer, NumberInput } from 'react-admin';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { CommonSliderInput } from '../fields/CommonSliderInput';
import { ReportContext } from './context';

const Text = ({ children }) => (
    <Typography variant="body1" component="div">
        {children}
    </Typography>
);

export const StudentList = () => {
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

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Text>שם התלמידה</Text>
                        </TableCell>
                        <ReportItemHeader columns={columns} />
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
                                        <ReportItemInputs
                                            columns={columns}
                                            studentId={student.student.id}
                                            maxValue={formData.howManyLessons}
                                            {...rest}
                                        />
                                    </TableRow>
                                ))}
                        </TableBody>
                    )}
                </FormDataConsumer>
            </Table>
        </TableContainer>
    );
};

const ReportItemHeader = ({ columns }) => (
    columns.map(column => (
        <TableCell key={column.id}>
            <Text>{column.label}</Text>
        </TableCell>
    ))
);

const ReportItemInputs = ({ columns, studentId, maxValue, ...rest }) => (
    columns.map(column => (
        <TableCell key={column.id}>
            {column.type === 'number' ? (
                <NumberInput
                    source={`${studentId}.${column.id}`}
                    label={column.label}
                    min={0}
                    max={1_000_000}
                    {...rest}
                />
            ) : (
                <CommonSliderInput
                    source={`${studentId}.${column.id}`}
                    max={maxValue}
                    {...rest}
                />
            )}
        </TableCell>
    ))
);
