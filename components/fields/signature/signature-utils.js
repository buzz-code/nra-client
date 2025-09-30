// Helper that maps client coordinates to canvas pixels and draws
export const drawOnCanvas = (canvas, e, { begin = false } = {}) => {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
  const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);
  const x = (clientX - rect.left) * scaleX;
  const y = (clientY - rect.top) * scaleY;

  if (begin) {
    ctx.beginPath();
    ctx.moveTo(x, y);
  } else {
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineTo(x, y);
    ctx.stroke();
  }
};

export default drawOnCanvas;
