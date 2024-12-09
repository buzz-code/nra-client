import React, { useMemo, useState } from 'react';
import { useRedirect } from 'react-admin';
import { useSavableData } from '../import/util';
import { Datagrid as AttDatagrid } from 'src/entities/att-report';
import { Datagrid as GradeDatagrid } from 'src/entities/grade';
import { useIsInLessonReportWithLate } from '@shared/utils/permissionsUtil';
import { InLessonReport } from '../in-lesson-report';

const attResource = 'att_report';
const gradeResource = 'grade';

export default ({ gradeMode = false }) => {
    const fileContext = gradeMode ? 'ציון' : 'נוכחות';
    const fileName = useMemo(() => 'דיווח ' + fileContext + ' ' + new Date().toISOString().split('T')[0], []);
    const redirect = useRedirect();
    const isShowLate = useIsInLessonReportWithLate();

    const resource = gradeMode ? gradeResource : attResource;
    const Datagrid = gradeMode ? GradeDatagrid : AttDatagrid;
    const [dataToSave, setDataToSave] = useState(null);
    const { data, saveData } = useSavableData(resource, fileName, dataToSave);

    const handleSuccess = () => {
        const redirectUrl = gradeMode ? '/grade' : '/att_report_with_report_month';
        redirect(redirectUrl);
    };

    return (
        <InLessonReport
            gradeMode={gradeMode}
            resource={resource}
            Datagrid={Datagrid}
            fileName={fileName}
            handleSuccess={handleSuccess}
            setDataToSave={setDataToSave}
            data={data}
            saveData={saveData}
            isShowLate={isShowLate}
        />
    );
};