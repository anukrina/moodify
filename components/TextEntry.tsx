'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MoodType } from '../types';
import { Type, Send } from 'lucide-react';

interface TextEntryProps {
  onMoodSelect: (mood: MoodType) => void;
}

export default function TextEntry({ onMoodSelect }: TextEntryProps) {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = () => {
    if (text.trim().length < 10) {
      return;
    }

    setIsAnalyzing(true);
    
    // Simple mood detection based on keywords
    const lowerText = text.toLowerCase();
    let detectedMood: MoodType = 'calm';

    if (lowerText.includes('happy') || lowerText.includes('joy') || lowerText.includes('excited')) {
      detectedMood = 'happy';
    } else if (lowerText.includes('sad') || lowerText.includes('depressed') || lowerText.includes('down')) {
      detectedMood = 'sad';
    } else if (lowerText.includes('angry') || lowerText.includes('furious') || lowerText.includes('mad')) {
      detectedMood = 'angry';
    } else if (lowerText.includes('anxious') || lowerText.includes('worried') || lowerText.includes('nervous')) {
      detectedMood = 'anxious';
    } else if (lowerText.includes('calm') || lowerText.includes('peaceful') || lowerText.includes('relaxed')) {
      detectedMood = 'calm';
    } else if (lowerText.includes('tired') || lowerText.includes('exhausted') || lowerText.includes('fatigued')) {
      detectedMood = 'tired';
    } else if (lowerText.includes('grateful') || lowerText.includes('thankful') || lowerText.includes('blessed')) {
      detectedMood = 'grateful';
    }

    setTimeout(() => {
      setIsAnalyzing(false);
      onMoodSelect(detectedMood);
    }, 1500);
  };

  return (
    <div className="mood-card">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Describe Your Feelings</h3>
        <p className="text-gray-600">Write about what's affecting your mood today</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="I'm feeling... (write at least 10 characters)"
            className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={6}
            maxLength={500}
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {text.length}/500
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Type className="w-4 h-4" />
            <span>AI will analyze your text to understand your mood</span>
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={text.trim().length < 10 || isAnalyzing}
            className="mood-button bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Analyze Mood
              </>
            )}
          </button>
        </div>
      </div>

      {text.length > 0 && text.length < 10 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
        >
          <p className="text-sm text-yellow-800">
            Please write at least 10 characters for better mood analysis.
          </p>
        </motion.div>
      )}
    </div>
  );
}
