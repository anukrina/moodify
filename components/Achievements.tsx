'use client';

import { motion } from 'framer-motion';
import { useMoodStore } from '../store/moodStore';
import { 
  Award, 
  Trophy, 
  Star, 
  Target, 
  TrendingUp, 
  ArrowLeft,
  Zap,
  Heart,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function Achievements() {
  const { gamification, setCurrentView } = useMoodStore();

  const achievements = [
    {
      id: 'first-entry',
      name: 'First Steps',
      description: 'Log your first mood entry',
      icon: '🌟',
      category: 'consistency',
      rarity: 'common',
      points: 10,
      unlocked: gamification.achievements.some(a => a.id === 'first-entry'),
      progress: gamification.achievements.some(a => a.id === 'first-entry') ? 1 : 0,
      maxProgress: 1,
    },
    {
      id: 'week-streak',
      name: 'Week Warrior',
      description: 'Log moods for 7 consecutive days',
      icon: '🔥',
      category: 'consistency',
      rarity: 'rare',
      points: 50,
      unlocked: gamification.streaks.daily >= 7,
      progress: Math.min(gamification.streaks.daily, 7),
      maxProgress: 7,
    },
    {
      id: 'month-streak',
      name: 'Monthly Master',
      description: 'Log moods for 30 consecutive days',
      icon: '👑',
      category: 'consistency',
      rarity: 'epic',
      points: 200,
      unlocked: gamification.streaks.daily >= 30,
      progress: Math.min(gamification.streaks.daily, 30),
      maxProgress: 30,
    },
    {
      id: 'level-5',
      name: 'Rising Star',
      description: 'Reach level 5',
      icon: '⭐',
      category: 'growth',
      rarity: 'common',
      points: 25,
      unlocked: gamification.level >= 5,
      progress: Math.min(gamification.level, 5),
      maxProgress: 5,
    },
    {
      id: 'level-10',
      name: 'Mood Master',
      description: 'Reach level 10',
      icon: '🏆',
      category: 'growth',
      rarity: 'rare',
      points: 100,
      unlocked: gamification.level >= 10,
      progress: Math.min(gamification.level, 10),
      maxProgress: 10,
    },
    {
      id: 'positive-week',
      name: 'Positive Vibes',
      description: 'Have 7 consecutive positive mood entries',
      icon: '😊',
      category: 'growth',
      rarity: 'rare',
      points: 75,
      unlocked: false, // This would need more complex logic
      progress: 0,
      maxProgress: 7,
    },
    {
      id: 'reflection-master',
      name: 'Reflection Master',
      description: 'Write detailed descriptions for 20 entries',
      icon: '✍️',
      category: 'reflection',
      rarity: 'epic',
      points: 150,
      unlocked: false, // This would need more complex logic
      progress: 0,
      maxProgress: 20,
    },
    {
      id: 'ai-friend',
      name: 'AI Companion',
      description: 'Use AI sentiment analysis 10 times',
      icon: '🤖',
      category: 'special',
      rarity: 'legendary',
      points: 300,
      unlocked: false, // This would need more complex logic
      progress: 0,
      maxProgress: 10,
    },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'border-gray-300 bg-gray-50';
      case 'rare':
        return 'border-blue-300 bg-blue-50';
      case 'epic':
        return 'border-purple-300 bg-purple-50';
      case 'legendary':
        return 'border-yellow-300 bg-yellow-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'text-gray-600';
      case 'rare':
        return 'text-blue-600';
      case 'epic':
        return 'text-purple-600';
      case 'legendary':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

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
          <h1 className="text-3xl font-bold gradient-text">Achievements</h1>
          <p className="text-gray-600">Track your progress and unlock rewards</p>
        </div>
      </div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        <div className="mood-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Points</p>
              <p className="text-2xl font-bold text-primary-600">{gamification.points}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-full">
              <Zap className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="mood-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Level</p>
              <p className="text-2xl font-bold text-green-600">{gamification.level}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="mood-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Achievements</p>
              <p className="text-2xl font-bold text-yellow-600">{unlockedAchievements.length}/{achievements.length}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="mood-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-purple-600">{gamification.streaks.daily} days</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mood-card mb-8"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-blue-500" />
          Level Progress
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Level {gamification.level}</span>
            <span>Level {gamification.level + 1}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((gamification.experience % 100) / 100) * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full"
            />
          </div>
          <div className="text-center">
            <span className="text-sm text-gray-600">
              {gamification.experienceToNext} XP to next level
            </span>
          </div>
        </div>
      </motion.div>

      {/* Achievements Grid */}
      <div className="space-y-8">
        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
              Unlocked Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unlockedAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-2xl border-2 ${getRarityColor(achievement.rarity)}`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{achievement.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {achievement.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {achievement.description}
                    </p>
                    <div className="flex items-center justify-center space-x-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getRarityText(achievement.rarity)} bg-white`}>
                        {achievement.rarity}
                      </span>
                      <span className="text-sm font-semibold text-primary-600">
                        +{achievement.points} XP
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Locked Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <Star className="w-6 h-6 mr-2 text-gray-500" />
            Locked Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl border-2 border-gray-200 bg-gray-50 opacity-75"
              >
                <div className="text-center">
                  <div className="text-4xl mb-3 filter grayscale">{achievement.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    {achievement.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {achievement.description}
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                      <span>{Math.round((achievement.progress / achievement.maxProgress) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gray-400 h-2 rounded-full"
                        style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2 mt-3">
                    <span className="text-xs font-medium px-2 py-1 rounded-full text-gray-500 bg-white">
                      {achievement.rarity}
                    </span>
                    <span className="text-sm font-semibold text-gray-500">
                      +{achievement.points} XP
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Encouragement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 text-center"
      >
        <div className="mood-card">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-500" />
            <h3 className="text-xl font-semibold text-gray-800">Keep Going!</h3>
            <Sparkles className="w-8 h-8 text-yellow-500" />
          </div>
          <p className="text-gray-600 mb-4">
            Every mood entry brings you closer to unlocking new achievements and understanding yourself better.
          </p>
          <button
            onClick={() => setCurrentView('mood-entry')}
            className="mood-button bg-primary-500 text-white hover:bg-primary-600"
          >
            Log Your Mood
          </button>
        </div>
      </motion.div>
    </div>
  );
}
