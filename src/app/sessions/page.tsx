'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Plus,
  Calendar,
  Users,
  Clock,
  Video,
  Search,
  Filter,
  ChevronRight
} from 'lucide-react';
import { formatRelativeTime } from '@/utils/dateUtils';
import {
  getAllSessions,
  subscribeToAllSessions,
  SessionData
} from '@/lib/firebaseSessions';

export default function SessionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load initial sessions
    const loadSessions = async () => {
      try {
        const sessionsData = await getAllSessions();
        setSessions(sessionsData);
      } catch (error) {
        console.error('Error loading sessions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToAllSessions((updatedSessions) => {
      setSessions(updatedSessions);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (session.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    // For now, all sessions are "live" - can add type field later
    const matchesFilter = filterType === 'all' || true; // Always match for now
    return matchesSearch && matchesFilter;
  });

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
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-4 font-medium">
                  Dashboard
                </Link>
                <Link href="/sessions" className="text-blue-600 border-b-2 border-blue-600 px-3 py-4 font-medium">
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
                <span>Schedule</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-4">
            <Video className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Study Sessions</h1>
          </div>
          <p className="text-xl opacity-90">
            Join live sessions, collaborate with peers, and achieve your goals together
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">All Sessions</option>
            <option value="live">Live</option>
            <option value="review">Review</option>
            <option value="workshop">Workshop</option>
          </select>
        </div>

        {/* Sessions List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {filteredSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>

            {filteredSessions.length === 0 && (
              <div className="text-center py-12">
                <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  {searchQuery || filterType !== 'all' 
                    ? 'No sessions found matching your criteria' 
                    : 'No sessions scheduled yet'}
                </p>
                <Link
                  href="/sessions/new"
                  className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create First Session
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SessionCard({ session }: { session: SessionData }) {
  const isUpcoming = session.startTime > new Date();
  const participantsCount = session.participants?.length || 0;
  const participationPercent = (participantsCount / session.maxParticipants) * 100;

  return (
    <Link href={`/sessions/${session.id}`} className="block group">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-200">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {session.title}
                </h3>
                {isUpcoming && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    Upcoming
                  </span>
                )}
              </div>
              {session.description && (
                <p className="text-gray-600 mb-3">{session.description}</p>
              )}
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatRelativeTime(session.startTime)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{session.duration} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{participantsCount}/{session.maxParticipants}</span>
                </div>
              </div>
              
              {/* Participation Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600">Seats filled</span>
                  <span className="text-xs text-gray-600">{Math.round(participationPercent)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${participationPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Host */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                    {session.hostName?.charAt(0)?.toUpperCase() || 'H'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Hosted by</p>
                    <p className="text-sm text-gray-600">{session.hostName || 'Unknown'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-blue-600 font-medium">
                  <span>Join Now</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
