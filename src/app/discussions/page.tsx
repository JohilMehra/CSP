'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  MessageSquare,
  Plus,
  Search,
  ThumbsUp,
  TrendingUp,
  Clock,
  Pin
} from 'lucide-react';
import { formatRelativeTime } from '@/utils/dateUtils';

export default function DiscussionsPage() {
  const [threads, setThreads] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('trending');
  const [loading, setLoading] = useState(true);

  // ✅ Fetch threads dynamically from API
  useEffect(() => {
    async function fetchThreads() {
      try {
        const res = await fetch('/api/discussions', { cache: 'no-store' });
        const data = await res.json();
        setThreads(data);
      } catch (error) {
        console.error('Error fetching threads:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchThreads();
  }, []);

  const sortedThreads = [...threads].sort((a, b) => {
    if (sortBy === 'trending') return b.upvotes - a.upvotes;
    if (sortBy === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'replies') return b.replies - a.replies;
    return 0;
  });

  const filteredThreads = sortedThreads.filter((thread) => {
    const q = searchQuery.toLowerCase();
    return (
      thread.title.toLowerCase().includes(q) ||
      thread.content.toLowerCase().includes(q) ||
      thread.topic.toLowerCase().includes(q)
    );
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
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-4 font-medium">Dashboard</Link>
                <Link href="/sessions" className="text-gray-600 hover:text-gray-900 px-3 py-4 font-medium">Sessions</Link>
                <Link href="/rooms" className="text-gray-600 hover:text-gray-900 px-3 py-4 font-medium">Exam Rooms</Link>
                <Link href="/quizzes" className="text-gray-600 hover:text-gray-900 px-3 py-4 font-medium">Quizzes</Link>
                <Link href="/discussions" className="text-blue-600 border-b-2 border-blue-600 px-3 py-4 font-medium">Discussions</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/discussions/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Thread</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-4">
            <MessageSquare className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Discussion Forum</h1>
          </div>
          <p className="text-xl opacity-90">
            Ask questions, share knowledge, and learn together
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
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="trending">Trending</option>
            <option value="recent">Most Recent</option>
            <option value="replies">Most Replies</option>
          </select>
        </div>

        {/* Threads List */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading discussions...</div>
        ) : filteredThreads.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No discussions found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredThreads.map((thread) => (
              <ThreadCard key={thread.id} thread={thread} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ThreadCard({ thread }: { thread: any }) {
  return (
    <Link href={`/discussions/${thread.id}`} className="block group">
      <div
        className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-200 ${
          thread.pinned ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
        }`}
      >
        <div className="p-6">
          <div className="flex items-start space-x-4">
            {/* Upvotes */}
            <div className="flex-shrink-0">
              <div className="flex flex-col items-center space-y-1">
                <ThumbsUp className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
                <span className="text-sm font-semibold text-gray-700">{thread.upvotes}</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                {thread.pinned && <Pin className="w-4 h-4 text-yellow-600" />}
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                  {thread.topic}
                </span>
                {thread.upvotes > 100 && <TrendingUp className="w-4 h-4 text-orange-500" />}
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {thread.title}
              </h3>

              <p className="text-gray-600 mb-4 line-clamp-2">{thread.content}</p>

              {/* Meta */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                    <span>{thread.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatRelativeTime(new Date(thread.createdAt))}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{thread.replies} replies</span>
                  <span>{thread.views} views</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
