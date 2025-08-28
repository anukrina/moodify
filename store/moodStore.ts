import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  MoodEntry, 
  User, 
  MoodType, 
  Achievement, 
  Challenge, 
  AISentimentResult,
  GamificationState,
  MoodTrend,
  MoodInsight
} from '../types';

interface MismatchRecord {
  id: string;
  timestamp: Date;
  selectedMood: MoodType;
  aiSentiment: 'positive' | 'negative' | 'neutral';
  confidence: number; // 0-1
  adjusted: boolean; // user adjusted mood
}

interface MoodState {
  user: User | null;
  isAuthenticated: boolean;
  moodEntries: MoodEntry[];
  currentEntry: MoodEntry | null;
  aiAnalysis: AISentimentResult | null;
  insights: MoodInsight[];
  gamification: GamificationState;
  conversationMode: 'neutral' | 'supportive';
  authenticityScore: number; // 0-100
  mismatchHistory: MismatchRecord[];
  supportiveReply: string | null;
  isLoading: boolean;
  currentView: 'dashboard' | 'mood-entry' | 'analytics' | 'achievements' | 'settings' | 'chat';
  setUser: (user: User) => void;
  addMoodEntry: (entry: Omit<MoodEntry, 'id' | 'timestamp' | 'isVerified'>) => void;
  updateMoodEntry: (id: string, updates: Partial<MoodEntry>) => void;
  deleteMoodEntry: (id: string) => void;
  setCurrentEntry: (entry: MoodEntry | null) => void;
  setAIAnalysis: (analysis: AISentimentResult) => void;
  addInsight: (insight: MoodInsight) => void;
  markInsightAsRead: (id: string) => void;
  updateGamification: (updates: Partial<GamificationState>) => void;
  addPoints: (points: number) => void;
  unlockAchievement: (achievement: Achievement) => void;
  completeChallenge: (challengeId: string) => void;
  setLoading: (loading: boolean) => void;
  setCurrentView: (view: MoodState['currentView']) => void;
  setConversationMode: (mode: 'neutral' | 'supportive') => void;
  recordMismatch: (data: { selectedMood: MoodType; aiSentiment: 'positive'|'negative'|'neutral'; confidence: number; adjusted: boolean; }) => void;
  rewardAuthenticity: (confidence: number) => void;
  setSupportiveReply: (msg: string | null) => void;
  getMoodTrends: (period: 'week' | 'month') => MoodTrend;
  getCurrentStreak: () => number;
  getAverageMood: () => number;
  getMostFrequentMood: () => MoodType;
}

const initialGamification: GamificationState = {
  points: 0,
  level: 1,
  experience: 0,
  experienceToNext: 100,
  badges: [],
  streaks: { daily: 0, weekly: 0, monthly: 0 },
  challenges: [],
  achievements: [],
};

const initialUser: User = {
  id: 'demo-user',
  name: 'Demo User',
  email: 'demo@example.com',
  preferences: {
    theme: 'light',
    notifications: { dailyReminder: true, weeklyInsights: true, achievementAlerts: true, moodCheckIn: true },
    privacy: { shareData: false, anonymousMode: false, storeJournal: false },
    accessibility: { highContrast: false, largeText: false, reducedMotion: false },
    gamification: { difficulty: 'medium', rewards: ['badge', 'theme', 'insight'] },
  },
  stats: { totalEntries: 0, currentStreak: 0, longestStreak: 0, averageMood: 5, mostFrequentMood: 'calm', totalPoints: 0, level: 1, experience: 0, entriesThisWeek: 0, entriesThisMonth: 0 },
  achievements: [],
  streaks: { current: 0, longest: 0, milestones: [7, 30, 100, 365] },
  createdAt: new Date(),
  lastActive: new Date(),
};

export const useMoodStore = create<MoodState>()(
  persist(
    (set, get) => ({
      user: initialUser,
      isAuthenticated: true,
      moodEntries: [],
      currentEntry: null,
      aiAnalysis: null,
      insights: [],
      gamification: initialGamification,
      conversationMode: 'supportive',
      authenticityScore: 80,
      mismatchHistory: [],
      supportiveReply: null,
      isLoading: false,
      currentView: 'dashboard',

      setUser: (user) => set({ user, isAuthenticated: true }),
      
      addMoodEntry: (entryData) => {
        const state = get();
        const shouldStore = state.user?.preferences.privacy.storeJournal ?? false;
        const newEntry: MoodEntry = {
          ...entryData,
          description: shouldStore ? entryData.description : undefined,
          id: crypto.randomUUID(),
          timestamp: new Date(),
          isVerified: false,
        } as MoodEntry;
        
        set((prev) => {
          const newEntries = [newEntry, ...prev.moodEntries];
          const points = calculatePoints(newEntry);
          const newGamification = updateGamificationState(prev.gamification, newEntry, points);
          return { moodEntries: newEntries, gamification: newGamification, currentEntry: newEntry };
        });
      },
      
      updateMoodEntry: (id, updates) => {
        set((state) => ({
          moodEntries: state.moodEntries.map(entry => entry.id === id ? { ...entry, ...updates } : entry),
          currentEntry: state.currentEntry && state.currentEntry.id === id ? { ...state.currentEntry, ...updates } : state.currentEntry,
        }));
      },
      
      deleteMoodEntry: (id) => set((state) => ({ moodEntries: state.moodEntries.filter(entry => entry.id !== id) })),
      setCurrentEntry: (entry) => set({ currentEntry: entry }),
      setAIAnalysis: (analysis) => set({ aiAnalysis: analysis }),
      addInsight: (insight) => set((state) => ({ insights: [insight, ...state.insights] })),
      markInsightAsRead: (id) => set((state) => ({ insights: state.insights.map(i => i.id === id ? { ...i, read: true } : i) })),
      updateGamification: (updates) => set((state) => ({ gamification: { ...state.gamification, ...updates } })),
      addPoints: (points) => set((state) => {
        const newPoints = state.gamification.points + points;
        const newExperience = state.gamification.experience + points;
        const newLevel = Math.floor(newExperience / 100) + 1;
        const experienceToNext = 100 - (newExperience % 100);
        return { gamification: { ...state.gamification, points: newPoints, experience: newExperience, level: newLevel, experienceToNext } };
      }),
      unlockAchievement: (achievement) => set((state) => ({
        gamification: {
          ...state.gamification,
          achievements: [...state.gamification.achievements, achievement],
          badges: [...state.gamification.badges, { id: achievement.id, name: achievement.name, description: achievement.description, icon: achievement.icon, unlockedAt: new Date(), rarity: achievement.rarity, category: achievement.category }],
        },
      })),
      completeChallenge: (challengeId) => set((state) => ({
        gamification: {
          ...state.gamification,
          challenges: state.gamification.challenges.map(ch => ch.id === challengeId ? { ...ch, completed: true, progress: ch.requirements.reduce((s, r) => s + r.target, 0) } : ch),
        },
      })),
      setLoading: (loading) => set({ isLoading: loading }),
      setCurrentView: (view) => set({ currentView: view }),
      setConversationMode: (mode) => set({ conversationMode: mode }),
      rewardAuthenticity: (confidence) => {
        const bonus = confidence < 0.6 ? 20 : 10;
        set((state) => ({ authenticityScore: Math.min(100, state.authenticityScore + 5) }));
        get().addPoints(bonus);
        get().addInsight({ id: crypto.randomUUID(), type: 'suggestion', title: 'Thanks for your honesty', description: 'Adjusting your mood helps keep your reflections accurate. Great job practicing self-awareness.', timestamp: new Date(), read: false });
      },
      recordMismatch: ({ selectedMood, aiSentiment, confidence, adjusted }) => {
        const record: MismatchRecord = { id: crypto.randomUUID(), timestamp: new Date(), selectedMood, aiSentiment, confidence, adjusted };
        set((state) => ({ mismatchHistory: [record, ...state.mismatchHistory].slice(0, 100) }));
      },
      setSupportiveReply: (msg) => set({ supportiveReply: msg }),

      getMoodTrends: (period) => {
        const state = get();
        const now = new Date();
        const days = period === 'week' ? 7 : 30;
        const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        const recentEntries = state.moodEntries.filter(entry => entry.timestamp > cutoff);
        if (recentEntries.length === 0) {
          return { period, averageMood: 5, moodDistribution: {}, topActivities: [], topTriggers: [], improvement: 0 };
        }
        const averageMood = recentEntries.reduce((sum, entry) => sum + entry.intensity, 0) / recentEntries.length;
        const moodDistribution = recentEntries.reduce((acc, entry) => { acc[entry.mood] = (acc[entry.mood] || 0) + 1; return acc; }, {} as Record<MoodType, number>);
        const allActivities = recentEntries.flatMap(entry => entry.activities);
        const activityCounts = allActivities.reduce((acc, a) => { acc[a] = (acc[a] || 0) + 1; return acc; }, {} as Record<string, number>);
        const topActivities = Object.entries(activityCounts).sort(([,a],[,b]) => b - a).slice(0,5).map(([a]) => a);
        return { period, averageMood, moodDistribution, topActivities, topTriggers: [], improvement: 0 };
      },
      getCurrentStreak: () => get().gamification.streaks.daily,
      getAverageMood: () => { const s = get(); return s.moodEntries.length === 0 ? 5 : s.moodEntries.reduce((sum, e) => sum + e.intensity, 0) / s.moodEntries.length; },
      getMostFrequentMood: () => { const s = get(); if (s.moodEntries.length === 0) return 'calm'; const counts = s.moodEntries.reduce((acc, e) => { acc[e.mood] = (acc[e.mood] || 0) + 1; return acc; }, {} as Record<MoodType, number>); return Object.entries(counts).reduce((a,b)=>counts[a[0]]>counts[b[0]]?a:b)[0] as MoodType; },
    }),
    {
      name: 'mood-companion-storage',
      partialize: (state) => ({
        user: state.user,
        moodEntries: state.moodEntries,
        gamification: state.gamification,
        insights: state.insights,
        conversationMode: state.conversationMode,
        authenticityScore: state.authenticityScore,
        mismatchHistory: state.mismatchHistory,
        supportiveReply: state.supportiveReply,
      }),
    }
  )
);

function calculatePoints(entry: MoodEntry): number {
  let points = 10;
  if (entry.description && entry.description.length > 20) points += 5;
  if (entry.activities.length > 0) points += 3;
  if (entry.tags.length > 0) points += 2;
  if (['happy', 'excited', 'grateful', 'calm', 'content', 'peaceful'].includes(entry.mood)) points += 2;
  return points;
}

function updateGamificationState(current: GamificationState, entry: MoodEntry, points: number): GamificationState {
  const newPoints = current.points + points;
  const newExperience = current.experience + points;
  const newLevel = Math.floor(newExperience / 100) + 1;
  const experienceToNext = 100 - (newExperience % 100);
  const today = new Date().toDateString();
  const lastEntryDate = current.streaks.daily > 0 ? new Date().toDateString() : null;
  let newDailyStreak = current.streaks.daily;
  if (lastEntryDate !== today) newDailyStreak = 1; else newDailyStreak += 1;
  return { ...current, points: newPoints, experience: newExperience, level: newLevel, experienceToNext, streaks: { ...current.streaks, daily: newDailyStreak } };
}
