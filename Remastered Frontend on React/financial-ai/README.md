# FinWise AI - Smart Financial Management Tool

A modern, AI-powered financial management application with beautiful animations, interactive dashboards, and intelligent insights.

## Features

### 1. Landing / Onboarding
- Student-friendly, playful, and minimalistic theme
- Theme switching (dark, minimal, vibrant, neon)
- Animated intro splash screen with coin animations
- Quick onboarding tutorial with scroll-trigger animations
- Functional buttons: "Sign in," "Sign up," "Continue as guest"
- Optional profile avatar upload with animated effects

### 2. Expense Input / Bank Integration
- Upload CSV / connect bank account / manual entry
- Animated data flow: expenses visually "fly" into categories
- Random sample data for demo so dashboard never looks empty
- Auto-categorization with AI predictions
- Scroll-trigger animations as transactions populate the table
- Graphs & mini-charts next to each category as data loads

### 3. Dashboard
- Dynamic heatmaps: visualize spending by day, week, month
- Category flow charts / Sankey diagrams
- Pie charts / bar graphs / line graphs for historical trends
- Scroll-trigger animations: charts animate when they enter viewport
- Hover / click effects: category highlights, expansion of details
- Sticky filters: timeframe selector (weekly, monthly), category toggles
- Responsive design: adapts for mobile + desktop smoothly

### 4. Conversational AI Assistant
- Chat-bubble style (WhatsApp / Messenger-inspired)
- User asks questions: "How much did I spend on food this week?"
- AI responds with text + inline chart / pie chart / image
- Voice-to-text input optional for hands-free interaction
- Animated typing indicator for realism
- Scroll-trigger messages: older messages animate in as you scroll

### 5. Goal Tracker
- Interactive progress bar: coins/rupees fill dynamically
- Milestones with confetti bursts when goals are met
- Failure animation: money leaks out with playful sound effects
- Hover tooltip shows exact % progress and last contribution
- Gamification: visual streaks for saving habits (7-day streaks, monthly goals)

### 6. Gamification & Achievements
- Savings avatar: grows/levels up as user saves more
- Badges / achievements: animated pop-ups, particle effects
- Leaderboards (optional): compare savings anonymously among peers
- Sound and visual effects for all milestone unlocks

### 7. Smart Alerts & Notifications
- Witty alerts instead of boring messages
- Red flash, shake animation, emoji reactions for overspend
- Inline graphs / micro-charts showing problem category
- Optional desktop push notifications

### 8. Advanced Visual Design & Interactions
- Scroll-trigger animations: charts, cards, and avatars animate as user scrolls
- Hover effects: buttons, cards, and graphs react smoothly
- Micro-interactions: button clicks, toggles, card flips
- Background motion graphics: subtle particle animations or gradients
- Image placeholders / illustrations for empty states
- Minimalistic yet bold color palette; contrasts for accessibility
- Smooth transitions between screens (GSAP / Framer Motion)

### 9. Charts & Data Visualizations
- Heatmaps (spending by day/hour)
- Pie charts (category share)
- Sankey diagrams (money flow)
- Line & bar charts (trends over time)
- Mini inline charts in AI chat responses
- Animated chart transitions as data updates

### 10. Extra Features for "Apple-Level" Polish
- Theme engine: dynamic color shifts based on spending trends
- Responsive typography & spacing: looks clean on any screen
- Loading animations for data fetching / AI responses
- Dark & light mode toggle
- Keyboard navigation & accessibility: tab focus, ARIA labels
- Cinematic demo-ready flow

## Technical Implementation

### Frontend
- **React** with **Vite** for fast development
- **Framer Motion** for smooth animations
- **Recharts** for data visualization
- **React Router** for navigation
- **CSS Modules** for styling

### Key Libraries
- `framer-motion` - Animation library
- `recharts` - Charting library
- `react-router-dom` - Routing
- `canvas-confetti` - Confetti effects
- `lucide-react` - Icons

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Navigate to the project directory:
```bash
cd financial-ai
```

3. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5174`.

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/     # Reusable components
├── pages/          # Page components
├── contexts/       # React contexts
├── hooks/          # Custom hooks
├── styles/         # CSS styles
├── utils/          # Utility functions
├── App.jsx         # Main app component
└── main.jsx        # Entry point
```

## Features Implementation Status

- [x] Landing Page with animations
- [x] Theme switching
- [x] Dashboard with charts
- [x] Expense tracking
- [x] Goal tracking with confetti
- [x] AI Assistant with chat interface
- [x] Navigation
- [x] Responsive design
- [x] Gamification features (avatars, achievements)
- [x] Interactive tutorials
- [x] Export and share functionality
- [x] Smart alerts and notifications
- [ ] Bank integration (demo only)
- [ ] Real AI integration
- [ ] User authentication

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Vite](https://vitejs.dev/) for the amazing build tool
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Recharts](https://recharts.org/) for charting
- All the open-source libraries that made this project possible