'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { MoodEntry } from '../types';
import { 
  Clock, 
  MapPin, 
  Cloud, 
  Activity,
  Edit,
  Trash2
} from 'lucide-react';

interface MoodCardProps {
  entry: MoodEntry;
  compact?: boolean;
  onEdit?: (entry: MoodEntry) => void;
  onDelete?: (entryId: string) => void;
}

export default function MoodCard({ entry, compact = false, onEdit, onDelete }: MoodCardProps) {
  const getMoodEmoji = (mood: string): string => {
    const emojiMap: Record<string, string> = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      anxious: '😰',
      calm: '😌',
      excited: '🤩',
      tired: '😴',
      grateful: '🙏',
      frustrated: '😤',
      content: '😊',
      overwhelmed: '😵',
      peaceful: '😇',
    };
    return emojiMap[mood] || '😊';
  };

  const getMoodColor = (mood: string): string => {
    const colorMap: Record<string, string> = {
      happy: 'bg-yellow-100 text-yellow-800',
      sad: 'bg-blue-100 text-blue-800',
      angry: 'bg-red-100 text-red-800',
      anxious: 'bg-purple-100 text-purple-800',
      calm: 'bg-green-100 text-green-800',
      excited: 'bg-orange-100 text-orange-800',
      tired: 'bg-gray-100 text-gray-800',
      grateful: 'bg-pink-100 text-pink-800',
      frustrated: 'bg-amber-100 text-amber-800',
      content: 'bg-indigo-100 text-indigo-800',
      overwhelmed: 'bg-violet-100 text-violet-800',
      peaceful: 'bg-cyan-100 text-cyan-800',
    };
    return colorMap[mood] || 'bg-gray-100 text-gray-800';
  };

  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all"
      >
        <div className="text-2xl">{getMoodEmoji(entry.mood)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="font-medium text-gray-800 capitalize truncate">
              {entry.mood}
            </div>
            <div className="text-sm text-gray-500">
              {format(entry.timestamp, 'MMM d, h:mm a')}
            </div>
          </div>
          {entry.description && (
            <p className="text-sm text-gray-600 truncate mt-1">
              {entry.description}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-sm font-medium text-primary-600">
            {entry.intensity}/10
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="mood-card"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{getMoodEmoji(entry.mood)}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 capitalize">
              {entry.mood}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{format(entry.timestamp, 'MMM d, yyyy • h:mm a')}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMoodColor(entry.mood)}`}>
            {entry.intensity}/10
          </span>
          {onEdit && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(entry)}
              className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
            >
              <Edit className="w-4 h-4" />
            </motion.button>
          )}
          {onDelete && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(entry.id)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Description */}
      {entry.description && (
        <div className="mb-4">
          <p className="text-gray-700 leading-relaxed">{entry.description}</p>
        </div>
      )}

      {/* Activities */}
      {entry.activities.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Activities</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {entry.activities.map((activity, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
              >
                {activity}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Context Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {entry.location && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{entry.location}</span>
          </div>
        )}
        
        {entry.weather && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Cloud className="w-4 h-4" />
            <span className="capitalize">{entry.weather}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {entry.tags.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {entry.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AI Analysis Indicator */}
      {entry.aiSentimentScore !== undefined && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">AI Analysis</span>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${
                  entry.aiSentimentScore > 0.3 ? 'bg-green-500' :
                  entry.aiSentimentScore < -0.3 ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
                <span className="text-xs text-gray-500">
                  {entry.aiConfidence ? `${Math.round(entry.aiConfidence * 100)}%` : 'N/A'}
                </span>
              </div>
              {entry.isVerified && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
