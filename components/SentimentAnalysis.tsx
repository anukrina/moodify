'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMoodStore } from '../store/moodStore';
import { 
  AlertCircle, 
  CheckCircle, 
  Lightbulb, 
  Brain,
  TrendingUp,
  X
} from 'lucide-react';

interface SentimentAnalysisProps {
  onClose: () => void;
}

export default function SentimentAnalysis({ onClose }: SentimentAnalysisProps) {
  const { aiAnalysis, currentEntry, updateMoodEntry, setConversationMode, rewardAuthenticity, recordMismatch } = useMoodStore();

  if (!aiAnalysis || !currentEntry) {
    return null;
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'negative':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <CheckCircle className="w-5 h-5" />;
      case 'negative':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Brain className="w-5 h-5" />;
    }
  };

  const handleConfirmMood = () => {
    // User insists; mark verified but switch to neutral conversation
    recordMismatch({ selectedMood: currentEntry.mood, aiSentiment: aiAnalysis.sentiment, confidence: aiAnalysis.confidence, adjusted: false });
    updateMoodEntry(currentEntry.id, { isVerified: true, aiSentimentScore: aiAnalysis.score, aiConfidence: aiAnalysis.confidence, aiSuggestions: aiAnalysis.suggestions });
    setConversationMode('neutral');
    onClose();
  };

  const handleAdjustMood = () => {
    // Adjust mood to match AI sentiment polarity (simple mapping)
    const map: Record<string, string> = { positive: 'happy', negative: 'sad', neutral: 'content' };
    const adjustedMood = (map[aiAnalysis.sentiment] || currentEntry.mood) as any;
    recordMismatch({ selectedMood: currentEntry.mood, aiSentiment: aiAnalysis.sentiment, confidence: aiAnalysis.confidence, adjusted: true });
    updateMoodEntry(currentEntry.id, { mood: adjustedMood, isVerified: true, aiSentimentScore: aiAnalysis.score, aiConfidence: aiAnalysis.confidence, aiSuggestions: aiAnalysis.suggestions });
    setConversationMode('supportive');
    rewardAuthenticity(aiAnalysis.confidence);
    onClose();
  };

  const showMismatch = aiAnalysis.mismatch?.detected;
  const confidencePercent = Math.round(aiAnalysis.confidence * 100);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 rounded-full">
                  <Brain className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">AI Analysis</h2>
                  <p className="text-sm text-gray-600">Confidence: {confidencePercent}%</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Sentiment Overview */}
            <div className={`p-4 rounded-xl border ${getSentimentColor(aiAnalysis.sentiment)}`}>
              <div className="flex items-center space-x-3">
                {getSentimentIcon(aiAnalysis.sentiment)}
                <div>
                  <h3 className="font-semibold capitalize">
                    {aiAnalysis.sentiment} sentiment detected
                  </h3>
                  <p className="text-sm opacity-80">
                    We'll use this to help keep your log authentic and supportive.
                  </p>
                </div>
              </div>
            </div>

            {/* Mismatch Prompt */}
            {showMismatch && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-amber-50 border border-amber-200 rounded-xl"
              >
                <p className="text-amber-800 mb-3">
                  Your words sound a bit different from "{currentEntry.mood}". Are you sure you want to log this mood?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleConfirmMood}
                    className="mood-button bg-gray-100 text-gray-800 hover:bg-gray-200"
                  >
                    Yes, keep "{currentEntry.mood}" (neutral chat)
                  </button>
                  <button
                    onClick={handleAdjustMood}
                    className="mood-button bg-primary-500 text-white hover:bg-primary-600"
                  >
                    Adjust mood (supportive chat + reward)
                  </button>
                </div>
                <p className="text-xs text-amber-700 mt-2">You can always change your mind later. Your privacy is respected.</p>
              </motion.div>
            )}

            {/* Detected Emotions */}
            {aiAnalysis.emotions.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                  Emotions detected
                </h3>
                <div className="flex flex-wrap gap-2">
                  {aiAnalysis.emotions.map((emotion, index) => (
                    <motion.span
                      key={index}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {emotion}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            {/* AI Suggestions */}
            {aiAnalysis.suggestions.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                  Suggestions
                </h3>
                <div className="space-y-3">
                  {aiAnalysis.suggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                    >
                      <p className="text-sm text-yellow-800">{suggestion}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <div className="text-xs text-gray-500 text-center">
              We keep this supportive and private. You control what you share.
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
