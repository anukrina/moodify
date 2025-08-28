'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMoodStore } from '../store/moodStore';
import { MoodType } from '../types';
import { AISentimentService } from '../services/aiService';
import { 
  ArrowLeft, 
  Check, 
  Type,
  Activity,
  MapPin,
  Cloud
} from 'lucide-react';
import toast from 'react-hot-toast';
import EmojiWheel from './EmojiWheel';
import DrawingCanvas from './DrawingCanvas';
import TextEntry from './TextEntry';
import ColorPicker from './ColorPicker';
import ActivitySelector from './ActivitySelector';
import SentimentAnalysis from './SentimentAnalysis';

type EntryMethod = 'emoji' | 'drawing' | 'text' | 'color' | 'game';

interface EntryData {
  mood: MoodType;
  intensity: number;
  description?: string;
  activities: string[];
  location?: string;
  weather?: string;
  tags: string[];
}

export default function MoodEntry() {
  const { setCurrentView, addMoodEntry, setAIAnalysis, addPoints, isLoading, setLoading, setCurrentEntry, setSupportiveReply, conversationMode } = useMoodStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [entryMethod, setEntryMethod] = useState<EntryMethod>('emoji');
  const [entryData, setEntryData] = useState<EntryData>({
    mood: 'calm',
    intensity: 5,
    activities: [],
    tags: [],
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSentiment, setShowSentiment] = useState(false);

  const totalSteps = 3;

  const handleMoodSelect = (mood: MoodType) => {
    setEntryData(prev => ({ ...prev, mood }));
    setCurrentStep(2);
  };

  const handleIntensityChange = (intensity: number) => {
    setEntryData(prev => ({ ...prev, intensity }));
  };

  const handleDescriptionChange = (description: string) => {
    setEntryData(prev => ({ ...prev, description }));
  };

  const handleActivitiesChange = (activities: string[]) => {
    setEntryData(prev => ({ ...prev, activities }));
  };

  const handleLocationChange = (location: string) => {
    setEntryData(prev => ({ ...prev, location }));
  };

  const handleWeatherChange = (weather: string) => {
    setEntryData(prev => ({ ...prev, weather }));
  };

  const handleSubmit = async () => {
    if (!entryData.description || entryData.description.trim().length < 5) {
      toast.error('Please add a description (at least 5 characters)');
      return;
    }

    setLoading(true);
    setIsAnalyzing(true);

    try {
      // Add the entry first to create currentEntry to be updated later by modal
      addMoodEntry(entryData);

      // Analyze sentiment
      const aiService = AISentimentService.getInstance();
      const analysis = await aiService.analyzeSentiment(entryData.description, entryData.mood);
      setAIAnalysis(analysis);

      // Supportive reply (preliminary; final mode may be set after modal actions)
      const { message, suggestions } = aiService.generateSupportiveReply(entryData.mood, analysis.sentiment);
      const reply = `${message} ${suggestions.length ? '• ' + suggestions.join(' • ') : ''}`;
      setSupportiveReply(reply);

      // Update currentEntry reference for modal controls
      setCurrentEntry({
        id: crypto.randomUUID(), // placeholder; will be replaced by persisted currentEntry after addMoodEntry
        timestamp: new Date(),
        mood: entryData.mood,
        intensity: entryData.intensity,
        description: entryData.description,
        activities: entryData.activities,
        location: entryData.location,
        weather: entryData.weather,
        aiSentimentScore: analysis.score,
        aiConfidence: analysis.confidence,
        aiSuggestions: analysis.suggestions,
        isVerified: false,
        tags: entryData.tags,
      } as any);

      // Points for effort regardless of verify outcome (additional rewards on honesty handled in modal)
      const points = calculatePoints(entryData);
      addPoints(points);
      toast.success(`Mood submitted! +${points} points for reflection`);

      // Show modal if mismatch or low confidence (<60%)
      if (analysis.mismatch?.detected || analysis.confidence < 0.6) {
        setShowSentiment(true);
      } else {
        // auto-verify on good confidence/no mismatch
        setCurrentView('dashboard');
      }
    } catch (error) {
      toast.error('Failed to save mood entry');
    } finally {
      setLoading(false);
      setIsAnalyzing(false);
    }
  };

  const calculatePoints = (data: EntryData): number => {
    let points = 10; // Base points
    if (data.description && data.description.length > 20) points += 5;
    if (data.description && data.description.length > 50) points += 3;
    if (data.activities.length > 0) points += 3;
    if (data.activities.length > 2) points += 2;
    if (data.location) points += 1;
    if (data.weather) points += 1;
    if (data.tags.length > 0) points += 2;
    if (['happy', 'excited', 'grateful', 'calm', 'content', 'peaceful'].includes(data.mood)) {
      points += 2;
    }
    return points;
  };

  const renderEntryMethod = () => {
    switch (entryMethod) {
      case 'emoji':
        return <EmojiWheel onMoodSelect={handleMoodSelect} />;
      case 'drawing':
        return <DrawingCanvas onMoodSelect={handleMoodSelect} />;
      case 'text':
        return <TextEntry onMoodSelect={handleMoodSelect} />;
      case 'color':
        return <ColorPicker onMoodSelect={handleMoodSelect} />;
      default:
        return <EmojiWheel onMoodSelect={handleMoodSelect} />;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">How are you feeling?</h2>
              <p className="text-gray-600">Choose your preferred way to express your mood</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { method: 'emoji', icon: '😊', label: 'Emoji Wheel', desc: 'Pick from emoji options' },
                { method: 'drawing', icon: '🎨', label: 'Draw', desc: 'Express through art' },
                { method: 'text', icon: '✍️', label: 'Write', desc: 'Describe your feelings' },
                { method: 'color', icon: '🌈', label: 'Color', desc: 'Choose your mood color' },
              ].map(({ method, icon, label, desc }) => (
                <motion.button
                  key={method}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEntryMethod(method as EntryMethod)}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    entryMethod === method
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 bg-white hover:border-primary-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{icon}</div>
                  <div className="font-semibold text-gray-800">{label}</div>
                  <div className="text-sm text-gray-600">{desc}</div>
                </motion.button>
              ))}
            </div>

            {renderEntryMethod()}
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Tell us more</h2>
              <p className="text-gray-600">Help us understand your mood better</p>
            </div>

            <div className="mood-card">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-500" />
                How intense is this feeling?
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Very Mild</span>
                  <span>Very Intense</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={entryData.intensity}
                  onChange={(e) => handleIntensityChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="text-center">
                  <span className="text-2xl font-bold text-primary-600">{entryData.intensity}/10</span>
                </div>
              </div>
            </div>

            <div className="mood-card">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Type className="w-5 h-5 mr-2 text-green-500" />
                What's on your mind?
              </h3>
              <textarea
                value={entryData.description || ''}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                placeholder="Describe what's affecting your mood today..."
                className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={4}
              />
              <p className="text-sm text-gray-500 mt-2">
                {entryData.description?.length || 0}/500 characters
              </p>
            </div>

            <ActivitySelector
              selectedActivities={entryData.activities}
              onChange={handleActivitiesChange}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mood-card">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-purple-500" />
                  Location
                </h3>
                <input
                  type="text"
                  value={entryData.location || ''}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  placeholder="Where are you?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="mood-card">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Cloud className="w-5 h-5 mr-2 text-gray-500" />
                  Weather
                </h3>
                <select
                  value={entryData.weather || ''}
                  onChange={(e) => handleWeatherChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select weather</option>
                  <option value="sunny">☀️ Sunny</option>
                  <option value="cloudy">☁️ Cloudy</option>
                  <option value="rainy">🌧️ Rainy</option>
                  <option value="snowy">❄️ Snowy</option>
                  <option value="windy">💨 Windy</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="mood-button bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading || !entryData.description || entryData.description.length < 5}
                className="mood-button bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Save Entry
                  </>
                )}
              </button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => setCurrentView('dashboard')}
          className="mood-button bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold gradient-text">Mood Check-in</h1>
          <div className="flex items-center justify-center mt-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    i + 1 <= currentStep
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div
                    className={`w-12 h-1 mx-2 ${
                      i + 1 < currentStep ? 'bg-primary-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>

      {showSentiment && (
        <SentimentAnalysis
          onClose={() => {
            setShowSentiment(false);
            setCurrentView('dashboard');
          }}
        />
      )}
    </div>
  );
}
