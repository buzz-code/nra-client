import React, { useRef, useState } from 'react';
import { Box, Button } from '@mui/material';
import SignaturePreview from './SignaturePreview';
import { drawOnCanvas } from './signature-utils';

const DigitalDrawingTab = ({ preview, onSave, onClear }) => {
  const localCanvasRef = useRef(null);
  const [isDrawingLocal, setIsDrawingLocal] = useState(false);

  const start = (e) => {
    setIsDrawingLocal(true);
    drawOnCanvas(localCanvasRef.current, e, { begin: true });
  };

  const onDraw = (e) => {
    if (!isDrawingLocal) return;
    drawOnCanvas(localCanvasRef.current, e, { begin: false });
  };

  const stop = () => setIsDrawingLocal(false);

  const clearLocal = () => {
    const canvas = localCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onClear && onClear();
  };

  const saveLocal = () => {
    const canvas = localCanvasRef.current;
    if (!canvas) return;
    const data = canvas.toDataURL('image/png');
    onSave && onSave(data);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <canvas
        ref={localCanvasRef}
        width={400}
        height={200}
        style={{ border: '2px solid #ccc', width: '100%', height: 'auto', cursor: 'crosshair' }}
        onMouseDown={start}
        onMouseMove={onDraw}
        onMouseUp={stop}
        onMouseLeave={stop}
        onTouchStart={(e) => { start(e); e.preventDefault(); }}
        onTouchMove={(e) => { onDraw(e); e.preventDefault(); }}
        onTouchEnd={(e) => { stop(e); e.preventDefault(); }}
      />
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Button onClick={clearLocal} sx={{ mr: 1 }}>נקה</Button>
        <Button variant="contained" onClick={saveLocal}>שמור חתימה</Button>
      </Box>
      {preview && <SignaturePreview src={preview} alt="canvas-preview" onRemove={() => onClear && onClear()} />}
    </Box>
  );
};

export default DigitalDrawingTab;
