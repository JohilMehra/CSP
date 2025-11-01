export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'student' | 'teacher' | 'admin';
  createdAt: Date;
  lastActive: Date;
  groups: string[];
}

export interface Group {
  id: string;
  name: string;
  description: string;
  adminId: string;
  members: string[];
  createdAt: Date;
  examType?: 'JEE' | 'SSC' | 'UPSC' | 'NEET' | 'GATE' | 'Other';
  roadmap?: Roadmap;
}

export interface Roadmap {
  id: string;
  groupId: string;
  title: string;
  description: string;
  duration: number; // in weeks
  milestones: Milestone[];
  createdAt: Date;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  week: number;
  topics: string[];
  resources: Resource[];
  completed: boolean;
}

export interface Resource {
  id: string;
  type: 'video' | 'document' | 'quiz' | 'mock-test';
  title: string;
  url: string;
  description?: string;
}

export interface Session {
  id: string;
  groupId: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  hostId: string;
  participants: string[];
  isActive: boolean;
  roomId: string;
  recordings?: string[];
}

export interface Quiz {
  id: string;
  groupId?: string;
  roomId?: string;
  title: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: Question[];
  timeLimit?: number; // in minutes
  createdAt: Date;
  attempts: QuizAttempt[];
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  points: number;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  userName: string;
  answers: number[];
  score: number;
  maxScore: number;
  timeSpent: number;
  submittedAt: Date;
}

export interface DiscussionThread {
  id: string;
  groupId: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  topic: string;
  createdAt: Date;
  replies: Reply[];
  upvotes: string[];
  pinned: boolean;
}

export interface Reply {
  id: string;
  threadId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  upvotes: string[];
}

export interface Progress {
  userId: string;
  groupId?: string;
  weeklyProgress: WeeklyProgress[];
  totalQuizScore: number;
  totalQuizzes: number;
  streak: number;
  lastActive: Date;
}

export interface WeeklyProgress {
  week: number;
  startDate: Date;
  endDate: Date;
  sessionsAttended: number;
  quizzesCompleted: number;
  discussionsParticipated: number;
  hoursStudied: number;
}

export interface Feedback {
  id: string;
  fromUserId: string;
  toUserId: string;
  groupId: string;
  type: 'positive' | 'constructive';
  content: string;
  createdAt: Date;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  score: number;
  rank: number;
  avatar?: string;
  quizzesCompleted: number;
  averageScore: number;
}
