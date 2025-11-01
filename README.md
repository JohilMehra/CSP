# StudySync - Advanced Study Collaboration Portal

A comprehensive study collaboration platform built with Next.js, Firebase, and AI-powered features for students, research teams, and competitive exam preparation.

## 🚀 Features

### Core Functionality
- **Real-time Session Scheduling**: Schedule study sessions with automatic reminders
- **Competitive Exam Rooms**: Dedicated spaces for JEE, SSC, UPSC, NEET, GATE
- **AI-Powered Quizzes**: Generate intelligent quizzes using Google's Gemini AI
- **Discussion Forums**: Async discussion threads with topic-based organization
- **Progress Dashboards**: Track individual and group performance
- **Live Leaderboards**: Real-time rankings and achievements

### Advanced Features
- **Structured Roadmaps**: Step-by-step learning paths for competitive exams
- **Micro-Quizzes**: Quick assessments with instant feedback
- **Peer Feedback System**: Accountability through structured peer reviews
- **Data-Driven Analytics**: Insights on group effectiveness
- **Socket.io Integration**: Real-time collaboration and updates

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons

### Backend & Services
- **Firebase** - Authentication, Firestore database, Storage
- **Gemini AI** - AI-powered quiz generation and solutions
- **PostgreSQL** - Relational database (future)
- **Socket.io** - Real-time communication

### State Management
- **Zustand** - Lightweight state management

### UI Components
- **Chart.js** - Data visualization
- **Date-fns** - Date manipulation

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd csp-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your Firebase and Gemini API keys in `.env.local`

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Firebase Setup
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Copy your configuration to `.env.local`

### Gemini AI Setup
1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to `.env.local` as `NEXT_PUBLIC_GEMINI_API_KEY`

## 📁 Project Structure

```
csp-portal/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/               # Authentication pages
│   │   ├── dashboard/          # Main dashboard
│   │   ├── rooms/              # Exam room pages
│   │   ├── quizzes/            # Quiz pages
│   │   └── discussions/        # Discussion forums
│   ├── components/             # Reusable components
│   ├── lib/                    # Library configurations
│   │   ├── firebase.ts         # Firebase setup
│   │   └── gemini.ts           # Gemini AI integration
│   ├── store/                  # Zustand stores
│   ├── types/                  # TypeScript types
│   └── utils/                  # Utility functions
├── public/                     # Static assets
└── .env.local                  # Environment variables
```

## 🎯 Use Cases

### PhD Comprehensive Exam Prep
- Research teams review tagged summaries
- Build custom quizzes on distributed systems
- Use feedback loops to identify weakest topics

### Multi-School Hackathon Teams
- Live voice/video sessions with shared code pads
- Track goal completion rates
- Collaborative problem-solving

### Competitive Exam Preparation
- JEE, SSC, UPSC, NEET, GATE dedicated rooms
- Structured roadmaps and milestones
- Topic-specific mock tests

## 🚧 Roadmap

- [ ] Implement Socket.io for real-time updates
- [ ] Add PostgreSQL backend
- [ ] Video conferencing integration
- [ ] Advanced analytics dashboard
- [ ] Mobile app support
- [ ] Peer review system
- [ ] Integration with learning management systems

## 📄 License

MIT License

## 👥 Contributors

Built with ❤️ by the StudySync team

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, email support@studysync.dev or open an issue in the repository.