'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MoodType } from '../types';
import { Palette, RotateCcw, Download } from 'lucide-react';

interface DrawingCanvasProps {
  onMoodSelect: (mood: MoodType) => void;
}

export default function DrawingCanvas({ onMoodSelect }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState('#000000');
  const [hasDrawn, setHasDrawn] = useState(false);

  const colors = [
    '#000000', '#ff0000', '#ff6b35', '#f7931e', '#ffd23f', 
    '#7cb518', '#2196f3', '#9c27b0', '#e91e63', '#795548'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 300;

    // Set initial styles
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
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

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleMoodAnalysis = () => {
    if (!hasDrawn) return;

    // Simple mood detection based on drawing characteristics
    // In a real app, this would use computer vision/AI
    const moods: MoodType[] = ['happy', 'calm', 'excited', 'peaceful'];
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    
    onMoodSelect(randomMood);
  };

  const updateBrush = (color: string, size?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setBrushColor(color);
    ctx.strokeStyle = color;
    
    if (size) {
      setBrushSize(size);
      ctx.lineWidth = size;
    }
  };

  return (
    <div className="mood-card">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Draw Your Mood</h3>
        <p className="text-gray-600">Express your feelings through art</p>
      </div>

      {/* Drawing Tools */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Palette className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Colors:</span>
          </div>
          <div className="flex space-x-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => updateBrush(color)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  brushColor === color ? 'border-gray-800 scale-110' : 'border-gray-300 hover:border-gray-500'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Size:</span>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => updateBrush(brushColor, parseInt(e.target.value))}
            className="w-20"
          />
          <span className="text-sm text-gray-600 w-8">{brushSize}</span>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex justify-center mb-4">
        <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="cursor-crosshair bg-white"
            style={{ width: '400px', height: '300px' }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center">
        <button
          onClick={clearCanvas}
          className="mood-button bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Clear Canvas
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            {hasDrawn ? 'Great! Your drawing is ready for analysis.' : 'Start drawing to express your mood'}
          </p>
          <button
            onClick={handleMoodAnalysis}
            disabled={!hasDrawn}
            className="mood-button bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Analyze Drawing
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          💡 Drawing can help you process emotions that are difficult to express in words
        </p>
      </div>
    </div>
  );
}
