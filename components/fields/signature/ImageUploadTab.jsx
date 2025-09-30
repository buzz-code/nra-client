import React, { useCallback, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import SignaturePreview from './SignaturePreview';

const MAX_BYTES = 2 * 1024 * 1024; // 2MB

const ImageUploadTab = ({ preview, onUpload, onRemove }) => {
  const [error, setError] = useState(null);

  const handleFileChange = useCallback((e) => {
    setError(null);
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (file.size > MAX_BYTES) {
      setError('התמונה גדולה מדי — יש לבחור קובץ עד 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      onUpload && onUpload(ev.target.result);
    };
    reader.readAsDataURL(file);
  }, [onUpload]);

  return (
    <Box sx={{ mt: 2, textAlign: 'center' }}>
      <input
        id="signature-upload"
        type="file"
        accept="image/png,image/jpeg"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <label htmlFor="signature-upload">
        <Button variant="contained" component="span">בחר תמונת חתימה</Button>
      </label>
      <Box sx={{ mt: 1, fontSize: '0.875rem', color: 'text.secondary' }}>PNG או JPG, מקסימום 2MB</Box>
      {error && (
        <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>
      )}
      {preview && (
        <SignaturePreview src={preview} alt="upload-preview" onRemove={() => onRemove && onRemove()} />
      )}
    </Box>
  );
};

export default ImageUploadTab;
