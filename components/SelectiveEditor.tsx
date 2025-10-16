'use client';

import { useState, useRef, useEffect } from 'react';
import { Brush, Eraser, Square, Circle, Wand2, Undo, Redo, Trash2, Download, Zap } from 'lucide-react';

interface SelectionArea {
  id: string;
  mask: string; // Base64 mask image
  prompt: string;
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
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const selectionColor = '#FF0000'; // Fixed red color for selections

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
      maskCtx.strokeStyle = selectionColor;
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
      maskCtx.fillStyle = selectionColor;
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
      maskCtx.fillStyle = selectionColor;
      maskCtx.globalAlpha = 0.5;
      maskCtx.beginPath();
      maskCtx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      maskCtx.fill();
    }

    saveToHistory();
  };

  const applySelection = () => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas || !currentPrompt.trim()) {
      alert('Please enter a prompt and make a selection');
      return;
    }

    // Check if there's actually a selection (non-empty mask)
    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return;

    const imageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
    const hasSelection = imageData.data.some(pixel => pixel > 0);

    if (!hasSelection) {
      alert('Please make a selection on the image first');
      return;
    }

    const maskDataUrl = maskCanvas.toDataURL();
    const selectionArea: SelectionArea = {
      id: Date.now().toString(),
      mask: maskDataUrl,
      prompt: currentPrompt,
    };

    onApply([selectionArea]);
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
        {/* Selection Info */}
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
          <h3 className="font-bold text-gray-900 mb-3">Selection Tool</h3>
          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
            <div
              className="w-6 h-6 rounded"
              style={{ backgroundColor: selectionColor, opacity: 0.7 }}
            />
            <span className="text-sm font-medium text-gray-700">
              Paint over the area you want to change
            </span>
          </div>
        </div>

        {/* Prompt for Selection */}
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
          <h3 className="font-bold text-gray-900 mb-3">What do you want here?</h3>
          <textarea
            value={currentPrompt}
            onChange={(e) => setCurrentPrompt(e.target.value)}
            placeholder="Describe what you want in the selected area (e.g., 'sunset sky', 'tropical beach', 'city skyline')"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none resize-none"
            rows={4}
          />
        </div>


        {/* Apply Button */}
        <button
          onClick={applySelection}
          className="w-full px-6 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-bold text-lg hover:from-teal-600 hover:to-teal-700 transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          <Zap className="w-5 h-5" />
          Transform Selection
        </button>
      </div>
    </div>
  );
}
