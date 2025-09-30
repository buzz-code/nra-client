import React from 'react';
import { Box, Button } from '@mui/material';

const SignaturePreview = ({ src, alt, onRemove }) => (
  <Box sx={{ mt: 2, textAlign: 'center' }}>
    <img src={src} alt={alt} style={{ maxWidth: '300px', maxHeight: '150px', border: '1px solid #ccc' }} />
    <Box sx={{ mt: 1 }}>
      <Button onClick={onRemove}>הסר</Button>
    </Box>
  </Box>
);

export default SignaturePreview;
