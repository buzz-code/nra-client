import React, { useCallback, useRef } from 'react';
import { Button } from 'react-admin';
import UploadIcon from '@mui/icons-material/FileUpload';
import { ExcelImportInput } from './ExcelImportInput';

export const ImportButton = ({ fields, handleDataParse, xlsxOptions, update = false, ...props }) => {
    const fileSelector = useRef();
    const buttonLabel = update ? 'ra.action.update' : 'ra.action.import';

    const handleFileSelect = useCallback((e) => {
        e.preventDefault();
        fileSelector.current?.click();
    }, []);

    return <>
        <Button onClick={handleFileSelect} label={buttonLabel} startIcon={<UploadIcon />} {...props} />
        <ExcelImportInput ref={fileSelector} fields={fields} onDataParsed={handleDataParse} xlsxOptions={xlsxOptions} />
    </>
}