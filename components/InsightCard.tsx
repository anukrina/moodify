'use client';

import { motion } from 'framer-motion';
import { MoodInsight } from '../types';
import { Sparkles, TrendingUp, Lightbulb, Target } from 'lucide-react';

interface InsightCardProps {
  insight: MoodInsight;
  onRead?: (id: string) => void;
}

export default function InsightCard({ insight, onRead }: InsightCardProps) {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pattern':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'suggestion':
        return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      case 'achievement':
        return <Target className="w-5 h-5 text-green-500" />;
      case 'trend':
        return <TrendingUp className="w-5 h-5 text-purple-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-primary-500" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'pattern':
        return 'border-blue-200 bg-blue-50';
      case 'suggestion':
        return 'border-yellow-200 bg-yellow-50';
      case 'achievement':
        return 'border-green-200 bg-green-50';
      case 'trend':
        return 'border-purple-200 bg-purple-50';
      default:
        return 'border-primary-200 bg-primary-50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-xl border-2 transition-all duration-300 ${getInsightColor(insight.type)} ${
        !insight.read ? 'ring-2 ring-primary-200' : ''
      }`}
      onClick={() => onRead && onRead(insight.id)}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          {getInsightIcon(insight.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-800">
              {insight.title}
            </h4>
            {!insight.read && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 bg-primary-500 rounded-full"
              />
            )}
          </div>
          
          <p className="text-sm text-gray-700 leading-relaxed">
            {insight.description}
          </p>
          
          {insight.data && (
            <div className="mt-3 p-2 bg-white/50 rounded-lg">
              <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                {JSON.stringify(insight.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
      
      {!insight.read && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 pt-2 border-t border-current/20"
        >
          <p className="text-xs text-current/70">
            Tap to mark as read
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
