import React, { forwardRef, useCallback } from "react";
import * as XLSX from 'xlsx';

export const ExcelImportInput = forwardRef<HTMLInputElement, any>(({ fields, onDataParsed, xlsxOptions = {} }, ref) => {
    const processFile = useCallback(file => {
        var name = file.name;
        const reader = new FileReader();
        reader.onload = (evt) => { // evt = on_file_select event
            /* Parse data */
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary', cellText: false, cellDates: true });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws, { header: fields, range: 1, ...xlsxOptions });
            /* Update state */
            onDataParsed({ name, data });
        };
        reader.readAsBinaryString(file);
    }, [fields, onDataParsed]);

    const handleFileUpload = useCallback(e => {
        const { files } = e.target;
        if (files && files.length) {
            processFile(files[0]);
        }
        e.target.value = null;
    }, [processFile]);

    return (
        <input
            type='file' accept='.csv, .xls, .xlsx' style={{ display: 'none' }}
            ref={ref} onChange={handleFileUpload} />
    )
});