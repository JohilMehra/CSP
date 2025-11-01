'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Users, 
  Trophy, 
  TrendingUp, 
  BookOpen, 
  MessageSquare,
  Target,
  Plus,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { getUserDashboardData } from '@/lib/firestore';

interface DashboardStats {
  upcomingSessions: number;
  activeGroups: number;
  quizzesCompleted: number;
  weeklyStreak: number;
  recentActivity: Activity[];
}

interface Activity {
  id: string;
  type: 'session' | 'quiz' | 'discussion' | 'achievement';
  title: string;
  time: string;
  group?: string;
}

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    upcomingSessions: 0,
    activeGroups: 0,
    quizzesCompleted: 0,
    weeklyStreak: 5,
    recentActivity: []
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      
      try {
        const data = await getUserDashboardData(user.id);
        if (data.stats) {
          setStats({
            upcomingSessions: data.sessions.length,
            activeGroups: data.sessions.filter((s: any) => new Date(s.endTime?.seconds * 1000 || 0) > new Date()).length,
            quizzesCompleted: data.stats.quizzesCompleted || 0,
            weeklyStreak: data.stats.streak || 0,
            recentActivity: []
          });
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadDashboardData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">StudySync</span>
              </Link>
              <div className="hidden md:flex space-x-4">
                <Link href="/dashboard" className="text-blue-600 border-b-2 border-blue-600 px-3 py-4 font-medium">
                  Dashboard
                </Link>
                <Link href="/sessions" className="text-gray-600 hover:text-gray-900 px-3 py-4 font-medium">
                  Sessions
                </Link>
                <Link href="/rooms" className="text-gray-600 hover:text-gray-900 px-3 py-4 font-medium">
                  Exam Rooms
                </Link>
                <Link href="/quizzes" className="text-gray-600 hover:text-gray-900 px-3 py-4 font-medium">
                  Quizzes
                </Link>
                <Link href="/discussions" className="text-gray-600 hover:text-gray-900 px-3 py-4 font-medium">
                  Discussions
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/sessions/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Session</span>
              </Link>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your study groups</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Calendar className="w-6 h-6" />}
            title="Upcoming Sessions"
            value={stats.upcomingSessions}
            color="blue"
          />
          <StatCard
            icon={<Users className="w-6 h-6" />}
            title="Active Groups"
            value={stats.activeGroups}
            color="green"
          />
          <StatCard
            icon={<Trophy className="w-6 h-6" />}
            title="Quizzes Completed"
            value={stats.quizzesCompleted}
            color="purple"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Week Streak"
            value={stats.weeklyStreak}
            unit="days"
            color="orange"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Sessions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Sessions</h2>
                <Link href="/sessions" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                <SessionCard
                  title="Operating Systems Threads"
                  group="CS Advanced Study Group"
                  date="Today, 3:00 PM"
                  duration="2 hours"
                />
                <SessionCard
                  title="JEE Mathematics Practice"
                  group="JEE Main 2025"
                  date="Tomorrow, 10:00 AM"
                  duration="3 hours"
                />
                <SessionCard
                  title="SSC Reasoning Mock Test Review"
                  group="SSC CGL Prep"
                  date="Dec 15, 2:00 PM"
                  duration="1.5 hours"
                />
              </div>
            </div>
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link 
                  href="/sessions/new"
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    <Calendar className="w-5 h-5 text-blue-600 group-hover:text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Schedule Session</p>
                    <p className="text-sm text-gray-500">Plan your next study meet</p>
                  </div>
                </Link>
                <Link 
                  href="/quizzes/create"
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                    <Target className="w-5 h-5 text-purple-600 group-hover:text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Create Quiz</p>
                    <p className="text-sm text-gray-500">Generate AI-powered quiz</p>
                  </div>
                </Link>
                <Link 
                  href="/rooms"
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors">
                    <BookOpen className="w-5 h-5 text-green-600 group-hover:text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Join Exam Room</p>
                    <p className="text-sm text-gray-500">Start structured learning</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <ActivityItem
                  type="quiz"
                  title="Completed Operating Systems Quiz"
                  time="2 hours ago"
                  group="CS Advanced"
                />
                <ActivityItem
                  type="discussion"
                  title="Replied to Thread: Thread Safety"
                  time="5 hours ago"
                  group="CS Advanced"
                />
                <ActivityItem
                  type="achievement"
                  title="7 Day Streak Achieved!"
                  time="1 day ago"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Preview */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Top Performers This Week</h2>
            <Link href="/leaderboard" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View Full Leaderboard
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <LeaderboardEntry rank={2} name="Sarah Chen" score={245} />
            <LeaderboardEntry rank={1} name={user.name} score={320} isCurrentUser />
            <LeaderboardEntry rank={3} name="Alex Kumar" score={198} />
            <LeaderboardEntry rank={4} name="Priya Shah" score={175} />
            <LeaderboardEntry rank={5} name="Ravi Patel" score={162} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, unit = '', color }: { 
  icon: React.ReactNode; 
  title: string; 
  value: number; 
  unit?: string;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color as keyof typeof colorClasses]}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">
        {value} {unit}
      </h3>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );
}

function SessionCard({ title, group, date, duration }: { 
  title: string; 
  group: string; 
  date: string; 
  duration: string;
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600 mb-2">{group}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{date}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{duration}</span>
            </span>
          </div>
        </div>
        <Link 
          href="/sessions/preview"
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Join
        </Link>
      </div>
    </div>
  );
}

function ActivityItem({ type, title, time, group }: { 
  type: string; 
  title: string; 
  time: string; 
  group?: string;
}) {
  const iconMap = {
    quiz: Target,
    discussion: MessageSquare,
    session: Calendar,
    achievement: Trophy,
  };

  const Icon = iconMap[type as keyof typeof iconMap] || Clock;

  return (
    <div className="flex items-start space-x-3">
      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        {group && <p className="text-xs text-gray-500">{group}</p>}
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
}

function LeaderboardEntry({ rank, name, score, isCurrentUser }: { 
  rank: number; 
  name: string; 
  score: number; 
  isCurrentUser?: boolean;
}) {
  return (
    <div className={`text-center p-4 rounded-lg ${isCurrentUser ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'}`}>
      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">
        {rank}
      </div>
      <p className={`font-semibold ${isCurrentUser ? 'text-blue-600' : 'text-gray-900'}`}>{name}</p>
      <p className="text-2xl font-bold text-gray-700 mt-1">{score}</p>
      <p className="text-xs text-gray-500">points</p>
    </div>
  );
}
