# AI Mood Companion

A next-generation AI-powered emotional support companion that helps users reflect, track, and improve their mental wellness through gamification and intelligent insights.

## 🌟 Features

### 🤖 AI-Powered Sentiment Analysis
- **Intelligent Mood Detection**: Analyzes user text to verify mood entries and gently address mismatches
- **Emotion Recognition**: Identifies multiple emotions and provides personalized suggestions
- **Confidence Scoring**: Provides confidence levels for AI analysis with transparency
- **Mood Mismatch Detection**: Gently alerts users when there's a discrepancy between selected mood and text sentiment

### 🎮 Gamification & Engagement
- **Experience Points System**: Earn points for mood entries, detailed descriptions, and consistent logging
- **Achievement System**: Unlock badges and achievements for milestones and positive habits
- **Streak Tracking**: Maintain daily, weekly, and monthly streaks with milestone celebrations
- **Level Progression**: Level up through consistent engagement and detailed reflections
- **Customizable Rewards**: Choose from badges, themes, insights, and challenges

### 🎨 Creative Mood Entry Methods
- **Emoji Wheel**: Interactive emoji-based mood selection with visual feedback
- **Drawing Canvas**: Express emotions through art with color and brush tools
- **Text Analysis**: Write about feelings with AI-powered sentiment analysis
- **Color Picker**: Choose mood colors with visual spectrum representation
- **Activity Tracking**: Log activities that influence your mood

### 📊 Analytics & Insights
- **Mood Trends**: Visualize patterns over time with interactive charts
- **Activity Correlation**: See how activities affect your emotional well-being
- **AI-Generated Insights**: Personalized recommendations based on your patterns
- **Progress Tracking**: Monitor improvement and celebrate achievements

### 🔒 Privacy & Accessibility
- **Data Privacy**: Full control over data sharing and anonymous mode options
- **Accessibility Features**: High contrast, large text, reduced motion, and keyboard navigation
- **Export & Delete**: Complete control over your data with export and deletion options
- **Local Storage**: Data stored locally with optional cloud sync

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-mood-companion
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **State Management**: Zustand with persistence
- **Animations**: Framer Motion
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React

### Project Structure
```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── Dashboard.tsx      # Main dashboard
│   ├── MoodEntry.tsx      # Mood entry interface
│   ├── Analytics.tsx      # Analytics and charts
│   ├── Achievements.tsx   # Gamification system
│   ├── Settings.tsx       # User settings
│   └── ...               # Other components
├── store/                 # State management
│   └── moodStore.ts       # Zustand store
├── services/              # Business logic
│   └── aiService.ts       # AI sentiment analysis
├── types/                 # TypeScript definitions
│   └── index.ts           # Type definitions
└── public/                # Static assets
```

## 🎯 Key Features Explained

### AI Sentiment Analysis
The application uses a sophisticated sentiment analysis system that:
- Analyzes text for emotional content
- Detects mood mismatches between selected mood and text sentiment
- Provides confidence scores for transparency
- Offers personalized suggestions based on detected emotions

### Gamification System
The gamification system encourages consistent engagement through:
- **Points System**: Earn points for detailed entries, activities, and positive moods
- **Achievements**: Unlock badges for milestones like streaks, levels, and reflection habits
- **Progress Tracking**: Visual progress bars and level indicators
- **Rewards**: Customizable reward system with multiple categories

### Creative Entry Methods
Multiple ways to express emotions:
- **Emoji Wheel**: Visual, intuitive mood selection
- **Drawing**: Artistic expression for complex emotions
- **Text Analysis**: Detailed written reflection with AI insights
- **Color Selection**: Abstract emotional expression through colors

### Privacy & Security
- **Local Storage**: Data stored locally by default
- **Anonymous Mode**: Option to use the app without personal data
- **Data Control**: Export and delete data at any time
- **Transparent AI**: Clear confidence scores and reasoning

## 🎨 Customization

### Themes
The application supports multiple themes:
- Light mode (default)
- Dark mode
- Auto (system preference)

### Accessibility
Comprehensive accessibility features:
- High contrast mode
- Large text options
- Reduced motion for users with vestibular disorders
- Keyboard navigation support
- Screen reader compatibility

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Touch devices

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for custom configuration:

```env
NEXT_PUBLIC_APP_NAME=AI Mood Companion
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Customization Options
- Modify color schemes in `tailwind.config.js`
- Adjust animations in component files
- Customize AI analysis parameters in `services/aiService.ts`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with Next.js and React
- Styled with Tailwind CSS
- Animated with Framer Motion
- Icons from Lucide React
- Charts from Recharts

## 📞 Support

For support, email support@aimoodcompanion.com or create an issue in the repository.

---

**AI Mood Companion** - Your intelligent emotional support companion for better mental wellness through technology and gamification.
