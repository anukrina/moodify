'use client';

import { motion } from 'framer-motion';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: string;
  color: 'primary' | 'green' | 'yellow' | 'blue' | 'purple' | 'red';
  onClick: () => void;
}

export default function QuickActionCard({ 
  title, 
  description, 
  icon, 
  color, 
  onClick 
}: QuickActionCardProps) {
  const getColorClasses = (color: string) => {
    const colorMap = {
      primary: 'bg-primary-50 border-primary-200 text-primary-700 hover:bg-primary-100',
      green: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100',
      blue: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
      purple: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
      red: 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.primary;
  };

  return (
    <motion.button
      whileHover={{ 
        scale: 1.05,
        y: -5,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 ${getColorClasses(color)}`}
    >
      <div className="text-center">
        <motion.div
          className="text-4xl mb-3"
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          {icon}
        </motion.div>
        
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm opacity-80">{description}</p>
      </div>
    </motion.button>
  );
}
