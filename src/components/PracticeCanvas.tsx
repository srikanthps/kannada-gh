import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Paintbrush, RotateCcw, Eye, EyeOff } from 'lucide-react';

interface PracticeCanvasProps {
  guideLetter?: string;
}

export default function PracticeCanvas({ guideLetter = '' }: PracticeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#de2910'); // Elegant vermillion/red by default
  const [brushWidth, setBrushWidth] = useState(4);
  const [showGuide, setShowGuide] = useState(true);

  // Get coordinates relative to canvas
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent | TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    
    // Check if it's a touch event
    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();

    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Adjust canvas resolution on mount/resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      const width = entry.contentRect.width;
      
      // Save current content of canvas to preserve it across resize
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) {
        tempCtx.drawImage(canvas, 0, 0);
      }

      // Update actual canvas dimensions
      canvas.width = width;
      canvas.height = 250;

      // Draw the previous drawing back
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.drawImage(tempCanvas, 0, 0);
      }
    });

    resizeObserver.observe(parent);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Clear canvas when guideLetter changes
  useEffect(() => {
    clearCanvas();
  }, [guideLetter]);

  return (
    <div className="flex flex-col items-center w-full bg-orange-50/50 p-4 rounded-2xl border border-orange-100 shadow-inner">
      <div className="flex items-center justify-between w-full mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 font-mono">
          Writing Practice Pad
        </span>
        <div className="flex gap-2">
          {guideLetter && (
            <button
              id="btn-toggle-guide"
              onClick={() => setShowGuide(!showGuide)}
              className="p-2.5 rounded-xl bg-white border border-amber-200 text-amber-800 hover:bg-amber-50 active:bg-amber-100 transition min-w-[42px] min-h-[42px] flex items-center justify-center shadow-sm"
              title={showGuide ? 'Hide guidelines' : 'Show guidelines'}
            >
              {showGuide ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
          <button
            id="btn-clear-canvas"
            onClick={clearCanvas}
            className="p-2.5 px-3.5 rounded-xl bg-white border border-amber-200 text-red-600 hover:bg-red-50 active:bg-red-100 transition flex items-center gap-1.5 text-xs font-semibold shadow-sm min-h-[42px]"
            title="Clear canvas"
          >
            <RotateCcw size={16} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      <div className="relative w-full h-[250px] bg-white rounded-xl border border-amber-200/80 overflow-hidden shadow-sm">
        {/* Background Guide Letter */}
        {guideLetter && showGuide && (
          <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
            <span className="text-[120px] font-bold text-slate-100 select-none animate-pulse">
              {guideLetter}
            </span>
          </div>
        )}

        {/* Drawing Canvas */}
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
        />
      </div>

      {/* Canvas Tool Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between w-full mt-4 gap-4">
        {/* Color Palette */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-amber-800 font-semibold uppercase tracking-wider font-mono">Ink:</span>
          <div className="flex gap-2">
            {[
              { hex: '#de2910', label: 'Kumkum Red' },
              { hex: '#1e3a8a', label: 'Ink Blue' },
              { hex: '#0f172a', label: 'Slate Black' },
              { hex: '#15803d', label: 'Leaf Green' }
            ].map((c) => (
              <button
                key={c.hex}
                id={`btn-ink-${c.hex.replace('#', '')}`}
                onClick={() => setColor(c.hex)}
                className={`w-9 h-9 rounded-full border transition-all ${
                  color === c.hex
                    ? 'ring-4 ring-amber-400 scale-110 border-white shadow-md'
                    : 'border-slate-200 hover:scale-105 active:scale-95'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.label}
              />
            ))}
          </div>
        </div>

        {/* Thickness */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-amber-800 font-semibold uppercase tracking-wider font-mono">Brush:</span>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="2"
              max="12"
              value={brushWidth}
              onChange={(e) => setBrushWidth(Number(e.target.value))}
              className="w-24 accent-amber-600 h-1.5 bg-amber-100 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-amber-800 font-mono font-bold w-6 text-right">{brushWidth}px</span>
          </div>
        </div>
      </div>
    </div>
  );
}
