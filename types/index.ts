export interface MoodEntry {
  id: string;
  timestamp: Date;
  mood: MoodType;
  intensity: number; // 1-10
  description?: string;
  activities: string[];
  location?: string;
  weather?: string;
  aiSentimentScore?: number; // -1 to 1
  aiConfidence?: number; // 0 to 1
  aiSuggestions?: string[];
  isVerified: boolean;
  tags: string[];
}

export type MoodType = 
  | 'happy' 
  | 'sad' 
  | 'angry' 
  | 'anxious' 
  | 'calm' 
  | 'excited' 
  | 'tired' 
  | 'grateful'
  | 'frustrated'
  | 'content'
  | 'overwhelmed'
  | 'peaceful';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: UserPreferences;
  stats: UserStats;
  achievements: Achievement[];
  streaks: StreakData;
  createdAt: Date;
  lastActive: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    dailyReminder: boolean;
    weeklyInsights: boolean;
    achievementAlerts: boolean;
    moodCheckIn: boolean;
  };
  privacy: {
    shareData: boolean;
    anonymousMode: boolean;
    storeJournal: boolean; // opt-in to store text description
  };
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    reducedMotion: boolean;
  };
  gamification: {
    difficulty: 'easy' | 'medium' | 'hard';
    rewards: RewardType[];
  };
}

export interface UserStats {
  totalEntries: number;
  currentStreak: number;
  longestStreak: number;
  averageMood: number;
  mostFrequentMood: MoodType;
  totalPoints: number;
  level: number;
  experience: number;
  entriesThisWeek: number;
  entriesThisMonth: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

export type AchievementCategory = 
  | 'consistency' 
  | 'reflection' 
  | 'growth' 
  | 'community' 
  | 'special';

export interface StreakData {
  current: number;
  longest: number;
  lastEntryDate?: Date;
  milestones: number[];
}

export type RewardType = 
  | 'badge' 
  | 'theme' 
  | 'avatar' 
  | 'insight' 
  | 'challenge';

export interface MoodAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  emotions: Emotion[];
  suggestions: string[];
  patterns: Pattern[];
  recommendations: string[];
}

export interface Emotion {
  name: string;
  intensity: number;
  confidence: number;
}

export interface Pattern {
  type: 'daily' | 'weekly' | 'monthly' | 'trigger';
  description: string;
  confidence: number;
  data: any;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // days
  requirements: ChallengeRequirement[];
  rewards: Reward[];
  progress: number;
  completed: boolean;
  expiresAt: Date;
}

export type ChallengeType = 
  | 'daily_checkin' 
  | 'mood_exploration' 
  | 'gratitude' 
  | 'mindfulness' 
  | 'social' 
  | 'creative';

export interface ChallengeRequirement {
  type: string;
  target: number;
  current: number;
  description: string;
}

export interface Reward {
  type: RewardType;
  value: string | number;
  description: string;
}

export interface MoodInsight {
  id: string;
  type: 'pattern' | 'suggestion' | 'achievement' | 'trend';
  title: string;
  description: string;
  data?: any;
  timestamp: Date;
  read: boolean;
}

export interface MoodTrend {
  period: 'day' | 'week' | 'month';
  averageMood: number;
  moodDistribution: Record<MoodType, number>;
  topActivities: string[];
  topTriggers: string[];
  improvement: number; // percentage
}

export interface AISentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number; // -1 to 1
  confidence: number;
  emotions: string[];
  suggestions: string[];
  mismatch?: {
    detected: boolean;
    reason: string;
    suggestion: string;
  };
}

export interface GamificationState {
  points: number;
  level: number;
  experience: number;
  experienceToNext: number;
  badges: Badge[];
  streaks: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  challenges: Challenge[];
  achievements: Achievement[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
}

export interface MoodEntryMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'emoji' | 'drawing' | 'text' | 'game' | 'voice' | 'color';
  enabled: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface PrivacySettings {
  dataSharing: boolean;
  anonymousMode: boolean;
  exportData: boolean;
  deleteData: boolean;
  thirdPartyAccess: boolean;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  colorBlindFriendly: boolean;
}
