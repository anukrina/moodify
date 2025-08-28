import { AISentimentResult, MoodType, MoodEntry } from '../types';

// Mock AI sentiment analysis - in a real app, this would connect to OpenAI, Azure, or similar
export class AISentimentService {
  private static instance: AISentimentService;
  
  private constructor() {}
  
  static getInstance(): AISentimentService {
    if (!AISentimentService.instance) {
      AISentimentService.instance = new AISentimentService();
    }
    return AISentimentService.instance;
  }

  async analyzeSentiment(text: string, selectedMood: MoodType): Promise<AISentimentResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple sentiment analysis based on keywords
    const sentiment = this.analyzeTextSentiment(text);
    const confidence = this.calculateConfidence(text);
    const emotions = this.extractEmotions(text);
    const suggestions = this.generateSuggestions(sentiment, emotions);
    
    // Check for mood mismatch
    const mismatch = this.detectMoodMismatch(sentiment, selectedMood, confidence);
    
    return {
      sentiment,
      score: this.sentimentToScore(sentiment),
      confidence,
      emotions,
      suggestions,
      mismatch,
    };
  }

  generateSupportiveReply(mood: MoodType, sentiment?: 'positive'|'negative'|'neutral'): { message: string; suggestions: string[] } {
    const pos: MoodType[] = ['happy','excited','grateful','calm','content','peaceful'];
    const neg: MoodType[] = ['sad','angry','anxious','frustrated','overwhelmed','tired'];

    const effective = sentiment || (pos.includes(mood) ? 'positive' : neg.includes(mood) ? 'negative' : 'neutral');

    if (effective === 'negative') {
      return {
        message: "I'm sorry you're feeling low today 💙. You're not alone—small steps help.",
        suggestions: [
          'Try 4-7-8 breathing for a minute',
          'Write 2–3 sentences about what feels heavy',
          'Take a 5-minute walk or stretch',
        ],
      };
    }
    if (effective === 'positive') {
      return {
        message: "That’s wonderful 🎉! Savor this energy—let’s help it last.",
        suggestions: [
          'Note one thing that made today good',
          'Send a kind message to someone you appreciate',
          'Queue a favorite song and enjoy it fully',
        ],
      };
    }
    return {
      message: 'Feeling neutral is okay. Want to share what’s on your mind? 😊',
      suggestions: [
        'Name one thing that feels okay right now',
        'Consider a short body scan to check in',
        'Pick a small, doable task for momentum',
      ],
    };
  }

  private analyzeTextSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = [
      'happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'fantastic', 'good',
      'positive', 'grateful', 'blessed', 'lucky', 'content', 'peaceful', 'calm',
      'relaxed', 'satisfied', 'fulfilled', 'energized', 'motivated', 'inspired'
    ];
    
    const negativeWords = [
      'sad', 'angry', 'frustrated', 'anxious', 'worried', 'stressed', 'tired',
      'exhausted', 'depressed', 'lonely', 'scared', 'afraid', 'nervous', 'upset',
      'disappointed', 'hurt', 'pain', 'suffering', 'miserable', 'hopeless'
    ];
    
    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) positiveCount++;
      if (negativeWords.includes(word)) negativeCount++;
    });
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private calculateConfidence(text: string): number {
    const words = text.split(/\s+/).length;
    const hasEmotionalWords = /(happy|sad|angry|excited|worried|calm|tired|grateful)/i.test(text);
    let confidence = 0.5;
    if (words > 10) confidence += 0.2;
    if (words > 20) confidence += 0.1;
    if (hasEmotionalWords) confidence += 0.2;
    if (text.includes('!')) confidence += 0.1;
    if (text.includes('?')) confidence -= 0.1;
    return Math.min(Math.max(confidence, 0.1), 0.95);
  }

  private extractEmotions(text: string): string[] {
    const emotionMap: Record<string, string[]> = {
      joy: ['happy', 'joy', 'excited', 'thrilled', 'elated'],
      sadness: ['sad', 'depressed', 'melancholy', 'blue', 'down'],
      anger: ['angry', 'furious', 'irritated', 'annoyed', 'mad'],
      fear: ['scared', 'afraid', 'terrified', 'anxious', 'worried'],
      surprise: ['surprised', 'shocked', 'amazed', 'astonished'],
      disgust: ['disgusted', 'repulsed', 'revolted'],
      trust: ['trusting', 'confident', 'secure', 'safe'],
      anticipation: ['excited', 'eager', 'hopeful', 'optimistic'],
      love: ['loving', 'caring', 'affectionate', 'warm'],
      gratitude: ['grateful', 'thankful', 'blessed', 'appreciative'],
      calm: ['calm', 'peaceful', 'serene', 'tranquil', 'relaxed'],
      energy: ['energized', 'motivated', 'inspired', 'pumped'],
      tiredness: ['tired', 'exhausted', 'fatigued', 'drained'],
      contentment: ['content', 'satisfied', 'fulfilled', 'complete'],
      frustration: ['frustrated', 'annoyed', 'irritated', 'bothered'],
      overwhelm: ['overwhelmed', 'stressed', 'burdened', 'swamped'],
    };
    const emotions: string[] = [];
    const lowerText = text.toLowerCase();
    Object.entries(emotionMap).forEach(([emotion, keywords]) => {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        emotions.push(emotion);
      }
    });
    return emotions.slice(0, 3);
  }

  private generateSuggestions(sentiment: string, emotions: string[]): string[] {
    const suggestions: string[] = [];
    if (sentiment === 'negative') {
      suggestions.push('Consider taking a few deep breaths to help you feel more centered.');
      suggestions.push('Would you like to try a quick mindfulness exercise?');
      suggestions.push('Remember that difficult emotions are temporary and valid.');
    } else if (sentiment === 'positive') {
      suggestions.push('Great to see you feeling positive! Consider journaling about what made today special.');
      suggestions.push('This is a perfect time to practice gratitude and savor the moment.');
    } else {
      suggestions.push('Taking time to reflect on your feelings is a great self-care practice.');
      suggestions.push('Consider what activities might help you feel more balanced today.');
    }
    if (emotions.includes('anxiety')) suggestions.push('Try the 4-7-8 breathing technique.');
    if (emotions.includes('anger')) suggestions.push('Physical activity can help release tension.');
    if (emotions.includes('sadness')) suggestions.push('Consider reaching out to someone you trust.');
    return suggestions.slice(0, 3);
  }

  private detectMoodMismatch(
    sentiment: string, 
    selectedMood: MoodType, 
    confidence: number
  ): AISentimentResult['mismatch'] {
    const moodSentimentMap: Record<MoodType, string> = {
      happy: 'positive',
      excited: 'positive',
      grateful: 'positive',
      calm: 'positive',
      content: 'positive',
      peaceful: 'positive',
      sad: 'negative',
      angry: 'negative',
      anxious: 'negative',
      frustrated: 'negative',
      overwhelmed: 'negative',
      tired: 'neutral',
    };
    const expectedSentiment = moodSentimentMap[selectedMood] as 'positive'|'negative'|'neutral' | undefined;
    if (expectedSentiment && sentiment !== expectedSentiment && confidence > 0.7) {
      const reasons = {
        positive: 'Your text sounds quite positive, but you selected a mood that typically indicates negative feelings.',
        negative: 'Your text suggests you might be feeling down, but you selected a mood that typically indicates positive feelings.',
        neutral: 'Your text seems neutral, but you selected a mood that typically indicates stronger emotions.',
      } as const;
      const suggestions = {
        positive: 'Would you like to reconsider your mood selection, or add more context about what\'s affecting you?',
        negative: 'It\'s okay to have mixed feelings. Would you like to add more details about your current state?',
        neutral: 'Consider if there might be underlying emotions that aren\'t immediately apparent.',
      } as const;
      return {
        detected: true,
        reason: reasons[sentiment as 'positive'|'negative'|'neutral'],
        suggestion: suggestions[sentiment as 'positive'|'negative'|'neutral'],
      };
    }
    return { detected: false, reason: '', suggestion: '' };
  }

  private sentimentToScore(sentiment: string): number {
    switch (sentiment) {
      case 'positive': return 0.7;
      case 'negative': return -0.7;
      default: return 0;
    }
  }

  async generateInsights(entries: MoodEntry[]): Promise<string[]> {
    if (entries.length < 3) {
      return ['Keep logging your moods to unlock personalized insights!'];
    }
    const insights: string[] = [];
    const moodCounts = entries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<MoodType, number>);
    const mostFrequentMood = Object.entries(moodCounts).sort(([,a], [,b]) => b - a)[0][0] as MoodType;
    const averageIntensity = entries.reduce((sum, entry) => sum + entry.intensity, 0) / entries.length;
    if (mostFrequentMood === 'happy' || mostFrequentMood === 'excited') {
      insights.push('You\'ve been feeling quite positive lately! This is a great foundation for mental wellness.');
    }
    if (averageIntensity > 7) {
      insights.push('Your mood intensity has been quite high. Consider what\'s contributing to these strong emotions.');
    } else if (averageIntensity < 4) {
      insights.push('Your moods have been on the lower side. Remember that it\'s okay to seek support when needed.');
    }
    const recentEntries = entries.slice(0, 7);
    const olderEntries = entries.slice(7, 14);
    if (recentEntries.length > 0 && olderEntries.length > 0) {
      const recentAvg = recentEntries.reduce((sum, entry) => sum + entry.intensity, 0) / recentEntries.length;
      const olderAvg = olderEntries.reduce((sum, entry) => sum + entry.intensity, 0) / olderEntries.length;
      if (recentAvg > olderAvg + 1) {
        insights.push('Your mood has been improving recently! Keep up whatever positive habits you\'ve been practicing.');
      } else if (recentAvg < olderAvg - 1) {
        insights.push('Your mood has been trending downward. Consider reaching out to friends, family, or a professional for support.');
      }
    }
    return insights.slice(0, 3);
  }

  async suggestActivities(mood: MoodType, intensity: number): Promise<string[]> {
    const activitySuggestions: Record<MoodType, string[]> = {
      happy: [
        'Share your joy with someone you care about',
        'Try a new hobby or creative activity',
        'Go for a walk and enjoy nature',
        'Listen to uplifting music',
        'Practice gratitude by writing down 3 things you appreciate'
      ],
      sad: [
        'Reach out to a friend or family member',
        'Try gentle physical activity like yoga or walking',
        'Listen to calming music',
        'Write about your feelings in a journal',
        'Practice self-compassion and be kind to yourself'
      ],
      angry: [
        'Take deep breaths and count to 10',
        'Go for a run or do intense exercise',
        'Write down your feelings to process them',
        'Try progressive muscle relaxation',
        'Take a break from the situation if possible'
      ],
      anxious: [
        'Practice the 4-7-8 breathing technique',
        'Try grounding exercises (5-4-3-2-1 method)',
        'Take a warm bath or shower',
        'Listen to guided meditation',
        'Write down your worries and possible solutions'
      ],
      calm: [
        'Maintain this peaceful state with meditation',
        'Enjoy a quiet activity like reading or drawing',
        'Take a leisurely walk',
        'Practice mindfulness throughout your day',
        'Share this calm energy with others'
      ],
      excited: [
        'Channel this energy into a creative project',
        'Plan something fun to look forward to',
        'Share your enthusiasm with others',
        'Try a new activity or adventure',
        'Use this motivation to tackle important tasks'
      ],
      tired: [
        'Take a short nap if possible',
        'Do gentle stretching or yoga',
        'Stay hydrated and eat nutritious food',
        'Take breaks throughout your day',
        'Practice good sleep hygiene tonight'
      ],
      grateful: [
        'Write a thank you note to someone',
        'Share your gratitude with others',
        'Create a gratitude jar or journal',
        'Volunteer or help someone in need',
        'Reflect on the positive aspects of your life'
      ],
      frustrated: [
        'Take a step back and reassess the situation',
        'Break down problems into smaller steps',
        'Talk to someone about what\'s bothering you',
        'Try a different approach to the problem',
        'Practice patience and self-compassion'
      ],
      content: [
        'Savor this feeling of satisfaction',
        'Continue with activities that bring you peace',
        'Share this contentment with loved ones',
        'Reflect on what\'s working well in your life',
        'Use this stable state to plan for the future'
      ],
      overwhelmed: [
        'Prioritize your tasks and focus on one thing at a time',
        'Ask for help from friends, family, or colleagues',
        'Take breaks and practice self-care',
        'Simplify your schedule where possible',
        'Practice saying "no" to additional commitments'
      ],
      peaceful: [
        'Maintain this tranquility with meditation',
        'Spend time in nature or quiet spaces',
        'Practice mindfulness and presence',
        'Share this peace with others',
        'Use this calm state for reflection and planning'
      ]
    };
    
    return activitySuggestions[mood] || activitySuggestions.calm;
  }
}
