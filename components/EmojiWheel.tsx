'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MoodType } from '../types';

interface EmojiWheelProps {
  onMoodSelect: (mood: MoodType) => void;
}

const moodOptions = [
  { mood: 'happy', emoji: '😊', label: 'Happy', color: '#fbbf24' },
  { mood: 'excited', emoji: '🤩', label: 'Excited', color: '#f97316' },
  { mood: 'grateful', emoji: '🙏', label: 'Grateful', color: '#ec4899' },
  { mood: 'calm', emoji: '😌', label: 'Calm', color: '#10b981' },
  { mood: 'content', emoji: '😊', label: 'Content', color: '#8b5cf6' },
  { mood: 'peaceful', emoji: '😇', label: 'Peaceful', color: '#06b6d4' },
  { mood: 'sad', emoji: '😢', label: 'Sad', color: '#3b82f6' },
  { mood: 'angry', emoji: '😠', label: 'Angry', color: '#ef4444' },
  { mood: 'anxious', emoji: '😰', label: 'Anxious', color: '#8b5cf6' },
  { mood: 'frustrated', emoji: '😤', label: 'Frustrated', color: '#f59e0b' },
  { mood: 'overwhelmed', emoji: '😵', label: 'Overwhelmed', color: '#7c3aed' },
  { mood: 'tired', emoji: '😴', label: 'Tired', color: '#6b7280' },
];

export default function EmojiWheel({ onMoodSelect }: EmojiWheelProps) {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [hoveredMood, setHoveredMood] = useState<MoodType | null>(null);

  const handleMoodClick = (mood: MoodType) => {
    setSelectedMood(mood);
    setTimeout(() => onMoodSelect(mood), 500);
  };

  return (
    <div className="mood-card">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Choose Your Mood</h3>
        <p className="text-gray-600">Tap an emoji that best represents how you're feeling</p>
      </div>

      <div className="relative">
        {/* Main Wheel */}
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          {moodOptions.map((option, index) => (
            <motion.button
              key={option.mood}
              whileHover={{ 
                scale: 1.1,
                rotate: 5,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMoodClick(option.mood as MoodType)}
              onMouseEnter={() => setHoveredMood(option.mood as MoodType)}
              onMouseLeave={() => setHoveredMood(null)}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                selectedMood === option.mood
                  ? 'border-primary-500 bg-primary-50 shadow-lg'
                  : hoveredMood === option.mood
                  ? 'border-primary-300 bg-primary-25 shadow-md'
                  : 'border-gray-200 bg-white hover:border-primary-200'
              }`}
              style={{
                background: selectedMood === option.mood 
                  ? `linear-gradient(135deg, ${option.color}15, ${option.color}25)`
                  : hoveredMood === option.mood
                  ? `linear-gradient(135deg, ${option.color}10, ${option.color}20)`
                  : undefined
              }}
            >
              {/* Emoji */}
              <motion.div
                className="text-4xl mb-2"
                animate={{
                  scale: selectedMood === option.mood ? [1, 1.2, 1] : 1,
                  rotate: selectedMood === option.mood ? [0, 10, -10, 0] : 0,
                }}
                transition={{ duration: 0.6 }}
              >
                {option.emoji}
              </motion.div>

              {/* Label */}
              <div className="font-medium text-gray-800 capitalize">
                {option.label}
              </div>

              {/* Selection Indicator */}
              {selectedMood === option.mood && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-white text-sm"
                  >
                    ✓
                  </motion.div>
                </motion.div>
              )}

              {/* Hover Effect */}
              {hoveredMood === option.mood && selectedMood !== option.mood && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 rounded-2xl border-2 border-primary-300 pointer-events-none"
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Selected Mood Display */}
        {selectedMood && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl border border-primary-200"
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="text-3xl">
                {moodOptions.find(opt => opt.mood === selectedMood)?.emoji}
              </div>
              <div className="text-center">
                <div className="font-semibold text-primary-700 capitalize">
                  {moodOptions.find(opt => opt.mood === selectedMood)?.label}
                </div>
                <div className="text-sm text-primary-600">
                  Great choice! Let's continue...
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          💡 Tip: Take a moment to really feel your emotions before selecting
        </p>
      </div>
    </div>
  );
}
