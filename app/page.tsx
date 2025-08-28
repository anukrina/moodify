'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMoodStore } from '../store/moodStore';
import Dashboard from '../components/Dashboard';
import MoodEntry from '../components/MoodEntry';
import Analytics from '../components/Analytics';
import Achievements from '../components/Achievements';
import Settings from '../components/Settings';
import Navigation from '../components/Navigation';
import LoadingSpinner from '../components/LoadingSpinner';
import ChatCompanion from '../components/ChatCompanion';

export default function HomePage() {
  const { currentView, isLoading, setLoading } = useMoodStore();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [setLoading]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'mood-entry':
        return <MoodEntry />;
      case 'analytics':
        return <Analytics />;
      case 'achievements':
        return <Achievements />;
      case 'settings':
        return <Settings />;
      case 'chat':
        return <ChatCompanion />;
      default:
        return <Dashboard />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="container mx-auto px-4 py-6">
        <header className="text-center mb-8">
          <motion.h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4" initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
            AI Mood Companion
          </motion.h1>
          <motion.p className="text-lg text-gray-600 max-w-2xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
            Your intelligent emotional support companion that helps you reflect, track, and improve your mental wellness through gamification and AI insights.
          </motion.p>
        </header>
        <main className="mb-8">{renderCurrentView()}</main>
        <Navigation />
      </motion.div>
    </div>
  );
}
