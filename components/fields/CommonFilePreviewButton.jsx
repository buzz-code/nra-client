import { useRecordContext } from 'react-admin';
import get from 'lodash/get';
import { unwrapFileDataValue, isImageFileRecord, getMimeTypeFromFileData, getFileDisplayTitle } from '@shared/utils/fileField.util';
import { ActionOrDialogButton } from '@shared/components/crudContainers/ActionOrDialogButton';
import { Box, Button, DialogContent, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';

const getMimeFromSrc = (src) => {
    if (!src) return null;
    const dataUrlMatch = src.match(/^data:([^;]+);/);
    if (dataUrlMatch) return dataUrlMatch[1];
    const ext = src.split('?')[0].split('#')[0].split('.').pop()?.toLowerCase();
    const extMap = {
        pdf: 'application/pdf',
        mp3: 'audio/mpeg', ogg: 'audio/ogg', wav: 'audio/wav', flac: 'audio/flac', m4a: 'audio/mp4',
        mp4: 'video/mp4', webm: 'video/webm', ogv: 'video/ogg', mov: 'video/quicktime',
    };
    return extMap[ext] || null;
};

const downloadFile = (src, title) => {
    const link = document.createElement('a');
    link.href = src;
    link.download = title || 'file';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const DownloadButton = ({ src, title, variant = 'outlined', size = 'small' }) => (
    <Button
        startIcon={<GetAppIcon />}
        onClick={e => { e.stopPropagation(); downloadFile(src, title); }}
        variant={variant}
        size={size}
    >
        הורד
    </Button>
);

const FileViewer = ({ src, mimeType, title }) => {
    if (mimeType?.startsWith('image/') || isImageFileRecord({ mimeType }, src)) {
        return <img src={src} alt={title} style={{ maxWidth: '100%', display: 'block' }} />;
    }
    if (mimeType === 'application/pdf') {
        return <iframe src={src} title={title} style={{ width: '100%', height: '70vh', border: 'none' }} />;
    }
    if (mimeType?.startsWith('audio/')) {
        return <audio controls src={src} style={{ width: '100%' }} />;
    }
    if (mimeType?.startsWith('video/')) {
        return <video controls src={src} style={{ maxWidth: '100%', width: '100%' }} />;
    }
    return <Typography variant="body1">לא ניתן להציג קובץ זה בדפדפן</Typography>;
};

const useFileInfo = (source, srcField, titleField) => {
    const record = useRecordContext();
    const resolvedSource = source ? get(record, source) : record;
    const fileRecord = unwrapFileDataValue(resolvedSource) ?? resolvedSource;
    if (!fileRecord) return null;
    const srcValue = get(fileRecord, srcField);
    if (!srcValue) return null;
    const displayTitle = getFileDisplayTitle(fileRecord, titleField);
    const mimeType = getMimeTypeFromFileData(fileRecord) || getMimeFromSrc(srcValue);
    return { srcValue, displayTitle, mimeType };
};

const CommonFilePreviewButton = ({ source = 'fileData', srcField = 'src', titleField = 'title', label = '' }) => {
    const info = useFileInfo(source, srcField, titleField);
    if (!info) return null;
    const { srcValue, displayTitle, mimeType } = info;

    return (
        <ActionOrDialogButton
            label={label}
            startIcon={<VisibilityIcon />}
            title={displayTitle}
            dialogContent={
                <DialogContent>
                    <FileViewer src={srcValue} mimeType={mimeType} title={displayTitle} />
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <DownloadButton src={srcValue} title={displayTitle} />
                    </Box>
                </DialogContent>
            }
        />
    );
};

export const CommonFileDownloadButton = ({ source = 'fileData', srcField = 'src', titleField = 'title', label = '' }) => {
    const info = useFileInfo(source, srcField, titleField);
    if (!info) return null;
    const { srcValue, displayTitle } = info;

    return <DownloadButton src={srcValue} title={displayTitle} />;
};

export default CommonFilePreviewButton;
