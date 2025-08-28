'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MoodType } from '../types';
import { Palette } from 'lucide-react';

interface ColorPickerProps {
  onMoodSelect: (mood: MoodType) => void;
}

const moodColors = [
  { color: '#fbbf24', mood: 'happy', label: 'Happy', emoji: '😊' },
  { color: '#f97316', mood: 'excited', label: 'Excited', emoji: '🤩' },
  { color: '#ec4899', mood: 'grateful', label: 'Grateful', emoji: '🙏' },
  { color: '#10b981', mood: 'calm', label: 'Calm', emoji: '😌' },
  { color: '#8b5cf6', mood: 'content', label: 'Content', emoji: '😊' },
  { color: '#06b6d4', mood: 'peaceful', label: 'Peaceful', emoji: '😇' },
  { color: '#3b82f6', mood: 'sad', label: 'Sad', emoji: '😢' },
  { color: '#ef4444', mood: 'angry', label: 'Angry', emoji: '😠' },
  { color: '#8b5cf6', mood: 'anxious', label: 'Anxious', emoji: '😰' },
  { color: '#f59e0b', mood: 'frustrated', label: 'Frustrated', emoji: '😤' },
  { color: '#7c3aed', mood: 'overwhelmed', label: 'Overwhelmed', emoji: '😵' },
  { color: '#6b7280', mood: 'tired', label: 'Tired', emoji: '😴' },
];

export default function ColorPicker({ onMoodSelect }: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  const handleColorSelect = (color: string, mood: MoodType) => {
    setSelectedColor(color);
    setTimeout(() => onMoodSelect(mood), 500);
  };

  const getMoodFromColor = (color: string): MoodType => {
    const moodColor = moodColors.find(mc => mc.color === color);
    return moodColor?.mood as MoodType || 'calm';
  };

  return (
    <div className="mood-card">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Choose Your Mood Color</h3>
        <p className="text-gray-600">Select a color that represents how you're feeling</p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-6">
        {moodColors.map(({ color, mood, label, emoji }) => (
          <motion.button
            key={color}
            whileHover={{ 
              scale: 1.1,
              rotate: 5,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleColorSelect(color, mood as MoodType)}
            onMouseEnter={() => setHoveredColor(color)}
            onMouseLeave={() => setHoveredColor(null)}
            className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
              selectedColor === color
                ? 'border-gray-800 shadow-lg'
                : hoveredColor === color
                ? 'border-gray-400 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            style={{ backgroundColor: color }}
          >
            <div className="text-3xl mb-2">{emoji}</div>
            <div className="font-medium text-white drop-shadow-lg capitalize">
              {label}
            </div>
            
            {selectedColor === color && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg"
              >
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Color Wheel Visualization */}
      <div className="relative mb-6">
        <div className="w-64 h-64 mx-auto rounded-full bg-gradient-conic from-yellow-400 via-red-500 via-purple-500 via-blue-500 via-green-500 to-yellow-400 animate-spin-slow">
          <div className="w-48 h-48 bg-white rounded-full absolute top-8 left-8 flex items-center justify-center">
            <div className="text-center">
              <Palette className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Mood Spectrum</p>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Color Display */}
      {selectedColor && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl border border-gray-200"
          style={{ backgroundColor: `${selectedColor}20` }}
        >
          <div className="flex items-center justify-center space-x-3">
            <div 
              className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
              style={{ backgroundColor: selectedColor }}
            />
            <div className="text-center">
              <div className="font-semibold text-gray-800 capitalize">
                {getMoodFromColor(selectedColor)}
              </div>
              <div className="text-sm text-gray-600">
                Great choice! Let's continue...
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          💡 Colors can be a powerful way to express emotions that are hard to put into words
        </p>
      </div>
    </div>
  );
}
