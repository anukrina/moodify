'use client';

import { motion } from 'framer-motion';
import { useMoodStore } from '../store/moodStore';
import { format } from 'date-fns';
import { 
  TrendingUp, 
  Award, 
  Target, 
  Activity, 
  Heart, 
  Zap,
  Calendar,
  BarChart3,
  Sparkles
} from 'lucide-react';
import MoodCard from './MoodCard';
import InsightCard from './InsightCard';
import QuickActionCard from './QuickActionCard';
import ProgressRing from './ProgressRing';

export default function Dashboard() {
  const { 
    user, 
    moodEntries, 
    gamification, 
    insights, 
    getCurrentStreak, 
    getAverageMood,
    getMostFrequentMood,
    setCurrentView,
    supportiveReply,
    setSupportiveReply,
  } = useMoodStore();

  const recentEntries = moodEntries.slice(0, 3);
  const unreadInsights = insights.filter(insight => !insight.read).slice(0, 2);
  const currentStreak = getCurrentStreak();
  const averageMood = getAverageMood();
  const mostFrequentMood = getMostFrequentMood();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants} className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome back, {user?.name}! 👋</h2>
        <p className="text-gray-600">{format(new Date(), 'EEEE, MMMM do')} • Let's check in on your mood</p>
        {supportiveReply && (
          <div className="mt-4 flex justify-center">
            <div className="max-w-xl w-full text-left p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <div className="text-sm text-gray-500 mb-1">Companion</div>
              <div className="text-gray-800 leading-relaxed">
                {supportiveReply}
              </div>
              <div className="mt-2 text-right">
                <button onClick={() => setSupportiveReply(null)} className="text-xs text-gray-500 hover:text-gray-700">Dismiss</button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="mood-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-primary-600">{currentStreak} days</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-full"><TrendingUp className="w-6 h-6 text-primary-600" /></div>
          </div>
        </div>
        <div className="mood-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Entries</p>
              <p className="text-2xl font-bold text-primary-600">{moodEntries.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full"><Activity className="w-6 h-6 text-green-600" /></div>
          </div>
        </div>
        <div className="mood-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Mood</p>
              <p className="text-2xl font-bold text-primary-600">{averageMood.toFixed(1)}/10</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full"><Heart className="w-6 h-6 text-yellow-600" /></div>
          </div>
        </div>
        <div className="mood-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Level</p>
              <p className="text-2xl font-bold text-primary-600">{gamification.level}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full"><Award className="w-6 h-6 text-purple-600" /></div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="mood-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-500" />
            Experience Progress
          </h3>
          <div className="flex items-center justify-center">
            <ProgressRing progress={(gamification.experience % 100) / 100} size={120} strokeWidth={8} color="#0ea5e9" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">XP to next level</p>
              <p className="text-xl font-bold text-primary-600">{gamification.experienceToNext}</p>
            </div>
          </div>
        </div>
        <div className="mood-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
            Most Common Mood
          </h3>
          <div className="text-center">
            <div className="text-4xl mb-2">{getMoodEmoji(mostFrequentMood)}</div>
            <p className="text-lg font-semibold capitalize text-gray-800">{mostFrequentMood}</p>
            <p className="text-sm text-gray-600">Your most frequent mood this week</p>
          </div>
        </div>
        <div className="mood-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-green-500" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button onClick={() => setCurrentView('mood-entry')} className="w-full mood-button bg-primary-500 text-white hover:bg-primary-600">Log Mood</button>
            <button onClick={() => setCurrentView('chat')} className="w-full mood-button bg-pink-100 text-pink-700 hover:bg-pink-200">Open Chat</button>
            <button onClick={() => setCurrentView('analytics')} className="w-full mood-button bg-gray-100 text-gray-700 hover:bg-gray-200">View Analytics</button>
            <button onClick={() => setCurrentView('achievements')} className="w-full mood-button bg-yellow-100 text-yellow-700 hover:bg-yellow-200">Check Achievements</button>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="mood-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-indigo-500" />
            Recent Entries
          </h3>
          {recentEntries.length > 0 ? (
            <div className="space-y-3">{recentEntries.map((entry) => (<MoodCard key={entry.id} entry={entry} compact />))}</div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📝</div>
              <p className="text-gray-600">No mood entries yet</p>
              <button onClick={() => setCurrentView('mood-entry')} className="mt-2 mood-button bg-primary-500 text-white hover:bg-primary-600">Log Your First Mood</button>
            </div>
          )}
        </div>
        <div className="mood-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
            AI Insights
          </h3>
          {unreadInsights.length > 0 ? (
            <div className="space-y-3">{unreadInsights.map((insight) => (<InsightCard key={insight.id} insight={insight} />))}</div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🤖</div>
              <p className="text-gray-600">No new insights</p>
              <p className="text-sm text-gray-500">Log more moods to unlock personalized insights</p>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickActionCard title="Mood Check-in" description="How are you feeling right now?" icon="😊" color="primary" onClick={() => setCurrentView('mood-entry')} />
        <QuickActionCard title="Chat" description="Talk with your companion" icon="💬" color="purple" onClick={() => setCurrentView('chat')} />
        <QuickActionCard title="View Trends" description="See your mood patterns over time" icon="📈" color="green" onClick={() => setCurrentView('analytics')} />
        <QuickActionCard title="Achievements" description="Check your progress and badges" icon="🏆" color="yellow" onClick={() => setCurrentView('achievements')} />
      </motion.div>
    </motion.div>
  );
}

function getMoodEmoji(mood: string): string {
  const emojiMap: Record<string, string> = { happy: '😊', sad: '😢', angry: '😠', anxious: '😰', calm: '😌', excited: '🤩', tired: '😴', grateful: '🙏', frustrated: '😤', content: '😊', overwhelmed: '😵', peaceful: '😇' };
  return emojiMap[mood] || '😊';
}
