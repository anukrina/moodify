'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMoodStore } from '../store/moodStore';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Activity,
  Target,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function Analytics() {
  const { moodEntries, getMoodTrends, setCurrentView } = useMoodStore();
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');

  const trends = getMoodTrends(timeRange);
  const recentEntries = moodEntries.slice(0, 14); // Last 14 entries for chart

  // Prepare chart data
  const chartData = recentEntries.map(entry => ({
    date: format(entry.timestamp, 'MMM d'),
    mood: entry.intensity,
    moodType: entry.mood,
  })).reverse();

  // Prepare pie chart data
  const moodDistribution = Object.entries(trends.moodDistribution).map(([mood, count]) => ({
    name: mood,
    value: count,
  }));

  const COLORS = ['#fbbf24', '#3b82f6', '#ef4444', '#8b5cf6', '#10b981', '#f97316', '#6b7280', '#ec4899'];

  const getMoodEmoji = (mood: string): string => {
    const emojiMap: Record<string, string> = {
      happy: '😊', sad: '😢', angry: '😠', anxious: '😰', calm: '😌',
      excited: '🤩', tired: '😴', grateful: '🙏', frustrated: '😤',
      content: '😊', overwhelmed: '😵', peaceful: '😇',
    };
    return emojiMap[mood] || '😊';
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => setCurrentView('dashboard')}
          className="mood-button bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold gradient-text">Mood Analytics</h1>
          <p className="text-gray-600">Track your emotional patterns and insights</p>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeRange === 'week'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeRange === 'month'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        <div className="mood-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Mood</p>
              <p className="text-2xl font-bold text-primary-600">{trends.averageMood.toFixed(1)}/10</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="mood-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Entries</p>
              <p className="text-2xl font-bold text-green-600">{moodEntries.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="mood-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Most Common</p>
              <p className="text-2xl font-bold text-yellow-600 capitalize">{trends.moodDistribution ? Object.keys(trends.moodDistribution)[0] || 'None' : 'None'}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Target className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="mood-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Improvement</p>
              <p className="text-2xl font-bold text-purple-600">{trends.improvement > 0 ? '+' : ''}{trends.improvement}%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Mood Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mood-card"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            Mood Trend Over Time
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="#0ea5e9" 
                  strokeWidth={2}
                  dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Mood Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mood-card"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-green-500" />
            Mood Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={moodDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${getMoodEmoji(name)} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {moodDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mood-card"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-purple-500" />
            Top Activities
          </h3>
          {trends.topActivities.length > 0 ? (
            <div className="space-y-3">
              {trends.topActivities.map((activity, index) => (
                <div key={activity} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm font-semibold text-primary-600">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-800">{activity}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {Math.round((index + 1) / trends.topActivities.length * 100)}% frequency
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No activity data available</p>
            </div>
          )}
        </motion.div>

        {/* Recent Entries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mood-card"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-orange-500" />
            Recent Entries
          </h3>
          {recentEntries.length > 0 ? (
            <div className="space-y-3">
              {recentEntries.slice(0, 5).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getMoodEmoji(entry.mood)}</div>
                    <div>
                      <div className="font-medium text-gray-800 capitalize">{entry.mood}</div>
                      <div className="text-sm text-gray-500">
                        {format(entry.timestamp, 'MMM d, h:mm a')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-primary-600">{entry.intensity}/10</div>
                    <div className="text-xs text-gray-500">Intensity</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No mood entries yet</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
