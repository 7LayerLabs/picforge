'use client';

import { useState, useRef, useEffect } from 'react';
import { Brush, Eraser, Square, Circle, Wand2, Undo, Redo, Trash2, Download, Zap } from 'lucide-react';

interface SelectionArea {
  id: string;
  mask: string; // Base64 mask image
  prompt: string;
  color: string;
  name: string;
}

interface SelectiveEditorProps {
  imageUrl: string;
  onApply: (areas: SelectionArea[]) => void;
}

export default function SelectiveEditor({ imageUrl, onApply }: SelectiveEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'brush' | 'eraser' | 'rect' | 'circle'>('brush');
  const [brushSize, setBrushSize] = useState(20);
  const [currentColor, setCurrentColor] = useState('#FF0000');
  const [areas, setAreas] = useState<SelectionArea[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const colors = [
    { name: 'Area 1', color: '#FF0000' },
    { name: 'Area 2', color: '#00FF00' },
    { name: 'Area 3', color: '#0000FF' },
    { name: 'Area 4', color: '#FFFF00' },
    { name: 'Area 5', color: '#FF00FF' },
    { name: 'Area 6', color: '#00FFFF' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!canvas || !maskCanvas) return;

    const ctx = canvas.getContext('2d');
    const maskCtx = maskCanvas.getContext('2d');
    if (!ctx || !maskCtx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      maskCanvas.width = img.width;
      maskCanvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      // Save initial state
      const imageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
      setHistory([imageData]);
      setHistoryIndex(0);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const saveToHistory = () => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;

    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return;

    const imageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const maskCanvas = maskCanvasRef.current;
      if (!maskCanvas) return;

      const maskCtx = maskCanvas.getContext('2d');
      if (!maskCtx) return;

      setHistoryIndex(historyIndex - 1);
      maskCtx.putImageData(history[historyIndex - 1], 0, 0);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const maskCanvas = maskCanvasRef.current;
      if (!maskCanvas) return;

      const maskCtx = maskCanvas.getContext('2d');
      if (!maskCtx) return;

      setHistoryIndex(historyIndex + 1);
      maskCtx.putImageData(history[historyIndex + 1], 0, 0);
    }
  };

  const clearMask = () => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;

    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return;

    maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
    saveToHistory();
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const pos = getMousePos(e);
    setStartPos(pos);

    if (tool === 'brush' || tool === 'eraser') {
      draw(e);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;

    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return;

    const pos = getMousePos(e);

    maskCtx.lineCap = 'round';
    maskCtx.lineJoin = 'round';
    maskCtx.lineWidth = brushSize;

    if (tool === 'brush') {
      maskCtx.globalCompositeOperation = 'source-over';
      maskCtx.strokeStyle = currentColor;
      maskCtx.globalAlpha = 0.5;
    } else if (tool === 'eraser') {
      maskCtx.globalCompositeOperation = 'destination-out';
      maskCtx.globalAlpha = 1.0;
    }

    maskCtx.beginPath();
    maskCtx.moveTo(startPos.x, startPos.y);
    maskCtx.lineTo(pos.x, pos.y);
    maskCtx.stroke();

    setStartPos(pos);
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;

    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return;

    const pos = getMousePos(e);

    if (tool === 'rect') {
      maskCtx.globalCompositeOperation = 'source-over';
      maskCtx.fillStyle = currentColor;
      maskCtx.globalAlpha = 0.5;
      maskCtx.fillRect(
        Math.min(startPos.x, pos.x),
        Math.min(startPos.y, pos.y),
        Math.abs(pos.x - startPos.x),
        Math.abs(pos.y - startPos.y)
      );
    } else if (tool === 'circle') {
      const radius = Math.sqrt(
        Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2)
      );
      maskCtx.globalCompositeOperation = 'source-over';
      maskCtx.fillStyle = currentColor;
      maskCtx.globalAlpha = 0.5;
      maskCtx.beginPath();
      maskCtx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      maskCtx.fill();
    }

    saveToHistory();
  };

  const saveCurrentArea = () => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas || !currentPrompt.trim()) {
      alert('Please enter a prompt for this area');
      return;
    }

    const maskDataUrl = maskCanvas.toDataURL();
    const newArea: SelectionArea = {
      id: Date.now().toString(),
      mask: maskDataUrl,
      prompt: currentPrompt,
      color: currentColor,
      name: colors.find(c => c.color === currentColor)?.name || 'Custom Area',
    };

    setAreas([...areas, newArea]);
    setCurrentPrompt('');
    clearMask();
  };

  const removeArea = (id: string) => {
    setAreas(areas.filter(a => a.id !== id));
  };

  const applySelections = () => {
    if (areas.length === 0) {
      alert('Please create at least one selection area');
      return;
    }
    onApply(areas);
  };

  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-6">
      {/* Canvas Area */}
      <div className="space-y-4">
        <div className="relative inline-block">
          <canvas
            ref={canvasRef}
            className="max-w-full h-auto border-2 border-gray-300 rounded-lg"
          />
          <canvas
            ref={maskCanvasRef}
            className="absolute top-0 left-0 max-w-full h-auto pointer-events-auto cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 p-4 bg-gray-100 rounded-lg">
          <button
            onClick={() => setTool('brush')}
            className={`p-2 rounded-lg transition-all ${
              tool === 'brush' ? 'bg-teal-500 text-white' : 'bg-white hover:bg-gray-50'
            }`}
            title="Brush Tool"
          >
            <Brush className="w-5 h-5" />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`p-2 rounded-lg transition-all ${
              tool === 'eraser' ? 'bg-teal-500 text-white' : 'bg-white hover:bg-gray-50'
            }`}
            title="Eraser Tool"
          >
            <Eraser className="w-5 h-5" />
          </button>
          <button
            onClick={() => setTool('rect')}
            className={`p-2 rounded-lg transition-all ${
              tool === 'rect' ? 'bg-teal-500 text-white' : 'bg-white hover:bg-gray-50'
            }`}
            title="Rectangle Selection"
          >
            <Square className="w-5 h-5" />
          </button>
          <button
            onClick={() => setTool('circle')}
            className={`p-2 rounded-lg transition-all ${
              tool === 'circle' ? 'bg-teal-500 text-white' : 'bg-white hover:bg-gray-50'
            }`}
            title="Circle Selection"
          >
            <Circle className="w-5 h-5" />
          </button>

          <div className="h-8 w-px bg-gray-300 mx-2" />

          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-2 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo"
          >
            <Undo className="w-5 h-5" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo"
          >
            <Redo className="w-5 h-5" />
          </button>
          <button
            onClick={clearMask}
            className="p-2 rounded-lg bg-white hover:bg-gray-50"
            title="Clear Selection"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          <div className="h-8 w-px bg-gray-300 mx-2" />

          <div className="flex items-center gap-2 bg-white px-3 rounded-lg">
            <span className="text-sm">Brush Size:</span>
            <input
              type="range"
              min="5"
              max="100"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-24"
            />
            <span className="text-sm font-medium w-8">{brushSize}</span>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="space-y-4">
        {/* Color/Area Selection */}
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
          <h3 className="font-bold text-gray-900 mb-3">Select Area</h3>
          <div className="grid grid-cols-3 gap-2">
            {colors.map((c) => (
              <button
                key={c.color}
                onClick={() => setCurrentColor(c.color)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  currentColor === c.color
                    ? 'border-teal-500 ring-2 ring-teal-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className="w-full h-8 rounded"
                  style={{ backgroundColor: c.color, opacity: 0.5 }}
                />
                <p className="text-xs text-center mt-1 font-medium">{c.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Prompt for Current Selection */}
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
          <h3 className="font-bold text-gray-900 mb-3">Edit This Area</h3>
          <textarea
            value={currentPrompt}
            onChange={(e) => setCurrentPrompt(e.target.value)}
            placeholder="Describe what you want in this area (e.g., 'sunset sky', 'tropical beach', 'city skyline')"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none resize-none"
            rows={3}
          />
          <button
            onClick={saveCurrentArea}
            className="w-full mt-3 px-4 py-2 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Save Area
          </button>
        </div>

        {/* Saved Areas */}
        {areas.length > 0 && (
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <h3 className="font-bold text-gray-900 mb-3">Saved Areas ({areas.length})</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {areas.map((area) => (
                <div
                  key={area.id}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: area.color, opacity: 0.7 }}
                      />
                      <span className="font-medium text-sm">{area.name}</span>
                    </div>
                    <button
                      onClick={() => removeArea(area.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">{area.prompt}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Apply Button */}
        <button
          onClick={applySelections}
          disabled={areas.length === 0}
          className="w-full px-6 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-bold text-lg hover:from-teal-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
        >
          <Zap className="w-5 h-5" />
          Apply All Selections
        </button>
      </div>
    </div>
  );
}
