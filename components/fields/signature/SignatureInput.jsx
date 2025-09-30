import React, { useState } from 'react';
import { useInput } from 'react-admin';
import { Tabs, Tab, Paper, Typography } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import CreateIcon from '@mui/icons-material/Create';
import ImageUploadTab from './ImageUploadTab';
import DigitalDrawingTab from './DigitalDrawingTab';

const SignatureInput = ({ source, label }) => {
  const {
    field: { value, onChange },
  } = useInput({ source });

  const [tab, setTab] = useState(0);
  const [uploadedPreview, setUploadedPreview] = useState(value || null);
  const [canvasData, setCanvasData] = useState(null);

  const handleChange = (data, type = 'upload') => {
    if (type === 'upload') {
      setUploadedPreview(data);
      setCanvasData(null);
    } else {
      // canvas
      setCanvasData(data);
      setUploadedPreview(null);
    }

    onChange && onChange(data);
  };

  const handleClear = () => {
    setUploadedPreview(null);
    setCanvasData(null);
    onChange && onChange(null);
  };

  return (
    <Paper elevation={1} sx={{ p: 2, mt: 2, width: '100%' }}>
      {label && <Typography variant="subtitle1">{label}</Typography>}
      <Tabs value={tab} onChange={(e, v) => setTab(v)}>
        <Tab icon={<UploadIcon />} label="העלאת תמונה" />
        <Tab icon={<CreateIcon />} label="ציור דיגיטלי" />
      </Tabs>

      {tab === 0 && (
        <ImageUploadTab
          preview={uploadedPreview}
          onUpload={(data) => handleChange(data, 'upload')}
          onRemove={() => handleClear()}
        />
      )}

      {tab === 1 && (
        <DigitalDrawingTab
          preview={canvasData}
          onSave={(data) => handleChange(data, 'canvas')}
          onClear={() => handleClear()}
        />
      )}
    </Paper>
  );
};

export default SignatureInput;
