'use client';

import { motion } from 'framer-motion';
import { useMoodStore } from '../store/moodStore';
import { 
  Home, 
  Plus, 
  BarChart3, 
  Award, 
  Settings,
  Heart,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export default function Navigation() {
  const { currentView, setCurrentView } = useMoodStore();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      color: 'primary'
    },
    {
      id: 'mood-entry',
      label: 'Log Mood',
      icon: Plus,
      color: 'green'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      color: 'blue'
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: Award,
      color: 'yellow'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      color: 'gray'
    }
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    const baseClasses = 'transition-all duration-200';
    
    if (isActive) {
      switch (color) {
        case 'primary':
          return `${baseClasses} text-primary-600 bg-primary-50`;
        case 'green':
          return `${baseClasses} text-green-600 bg-green-50`;
        case 'blue':
          return `${baseClasses} text-blue-600 bg-blue-50`;
        case 'yellow':
          return `${baseClasses} text-yellow-600 bg-yellow-50`;
        case 'gray':
          return `${baseClasses} text-gray-600 bg-gray-50`;
        default:
          return `${baseClasses} text-primary-600 bg-primary-50`;
      }
    }
    
    return `${baseClasses} text-gray-500 hover:text-gray-700`;
  };

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentView(item.id as any)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl min-w-[60px] ${getColorClasses(item.color, isActive)}`}
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1.2 : 1,
                    rotate: isActive ? [0, 10, -10, 0] : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon className="w-6 h-6" />
                </motion.div>
                
                <motion.span
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-xs font-medium mt-1"
                >
                  {item.label}
                </motion.span>
                
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-1 w-1 h-1 bg-current rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
