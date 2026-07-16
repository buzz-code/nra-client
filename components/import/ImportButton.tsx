import React, { useCallback, useRef } from 'react';
import { Button } from 'react-admin';
import UploadIcon from '@mui/icons-material/FileUpload';
import { ExcelImportInput } from './ExcelImportInput';
import { ImportFieldsInfo } from './ImportFieldsInfo';

export const ImportButton = ({ fields, handleDataParse, xlsxOptions, resource, update = false, ...props }) => {
    const fileSelector = useRef();
    const buttonLabel = update ? 'ra.action.update' : 'ra.action.import';

    const handleFileSelect = useCallback((e) => {
        e.preventDefault();
        fileSelector.current?.click();
    }, []);

    return <>
        <Button onClick={handleFileSelect} label={buttonLabel} startIcon={<UploadIcon />} {...props} />
        {resource && <ImportFieldsInfo resource={resource} fields={fields} />}
        <ExcelImportInput ref={fileSelector} fields={fields} onDataParsed={handleDataParse} xlsxOptions={xlsxOptions} />
    </>
}