import React, { useState } from 'react';
import { InputHelperText, useInput } from 'react-admin';
import { Box, FormControl, FormHelperText, FormLabel, Tabs, Tab } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import CreateIcon from '@mui/icons-material/Create';
import ImageUploadTab from './ImageUploadTab';
import DigitalDrawingTab from './DigitalDrawingTab';

const SignatureInput = ({ label, ...props }) => {
  const {
    field: { value, onChange },
    fieldState: { error, invalid },
    isRequired
  } = useInput(props);

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
    <FormControl error={!!error} margin="normal">
      <Box sx={{ mt: 1 }}>
        <FormLabel component="legend">
          {label}
          {isRequired && ' *'}
        </FormLabel>
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
      </Box>
      {invalid && (
        <FormHelperText error={invalid}>
          <InputHelperText error={error?.message} />
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default SignatureInput;
