'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Plus, X } from 'lucide-react';

interface ActivitySelectorProps {
  selectedActivities: string[];
  onChange: (activities: string[]) => void;
}

const commonActivities = [
  'Exercise', 'Reading', 'Cooking', 'Walking', 'Meditation', 'Yoga',
  'Gaming', 'Music', 'Art', 'Writing', 'Socializing', 'Work',
  'Study', 'Shopping', 'Cleaning', 'Gardening', 'Photography', 'Travel',
  'Sleeping', 'Eating', 'Drinking', 'Smoking', 'Watching TV', 'Browsing',
  'Calling', 'Texting', 'Emailing', 'Meeting', 'Commuting', 'Resting'
];

export default function ActivitySelector({ selectedActivities, onChange }: ActivitySelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customActivity, setCustomActivity] = useState('');

  const filteredActivities = commonActivities.filter(activity =>
    activity.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedActivities.includes(activity)
  );

  const handleAddActivity = (activity: string) => {
    if (!selectedActivities.includes(activity)) {
      onChange([...selectedActivities, activity]);
    }
  };

  const handleRemoveActivity = (activity: string) => {
    onChange(selectedActivities.filter(a => a !== activity));
  };

  const handleAddCustomActivity = () => {
    if (customActivity.trim() && !selectedActivities.includes(customActivity.trim())) {
      handleAddActivity(customActivity.trim());
      setCustomActivity('');
      setShowCustomInput(false);
    }
  };

  return (
    <div className="mood-card">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Activity className="w-5 h-5 mr-2 text-green-500" />
        What have you been doing?
      </h3>

      {/* Selected Activities */}
      {selectedActivities.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {selectedActivities.map((activity) => (
              <motion.div
                key={activity}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="flex items-center space-x-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
              >
                <span>{activity}</span>
                <button
                  onClick={() => handleRemoveActivity(activity)}
                  className="hover:text-primary-900 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Add */}
      <div className="space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Add Custom Activity */}
        {!showCustomInput ? (
          <button
            onClick={() => setShowCustomInput(true)}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add custom activity</span>
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex space-x-2"
          >
            <input
              type="text"
              placeholder="Enter custom activity..."
              value={customActivity}
              onChange={(e) => setCustomActivity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomActivity()}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              onClick={handleAddCustomActivity}
              disabled={!customActivity.trim()}
              className="px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowCustomInput(false);
                setCustomActivity('');
              }}
              className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
          </motion.div>
        )}
      </div>

      {/* Activity Suggestions */}
      {filteredActivities.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Suggestions:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <AnimatePresence>
              {filteredActivities.slice(0, 9).map((activity) => (
                <motion.button
                  key={activity}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAddActivity(activity)}
                  className="p-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  {activity}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          💡 Select activities that might be affecting your mood
        </p>
      </div>
    </div>
  );
}
