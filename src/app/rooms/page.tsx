'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Trophy, 
  Users, 
  Calendar, 
  Target, 
  ChevronRight,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { formatRelativeTime } from '@/utils/dateUtils';

const examRooms = [
  {
    id: 'jee-main-2025',
    name: 'JEE Main 2025',
    description: 'Complete JEE Main preparation with structured roadmap, mock tests, and peer collaboration',
    examType: 'JEE' as const,
    members: 1248,
    activeSessions: 3,
    progress: 65,
    color: 'blue',
    roadmap: {
      duration: 16,
      milestones: 12,
      completed: 8
    }
  },
  {
    id: 'ssc-cgl-2025',
    name: 'SSC CGL 2025',
    description: 'SSC CGL preparation room with sectional tests, reasoning tricks, and previous year papers',
    examType: 'SSC' as const,
    members: 892,
    activeSessions: 2,
    progress: 45,
    color: 'green',
    roadmap: {
      duration: 20,
      milestones: 15,
      completed: 7
    }
  },
  {
    id: 'upsc-prelims',
    name: 'UPSC Prelims 2025',
    description: 'Comprehensive UPSC preparation with current affairs, mock tests, and answer writing practice',
    examType: 'UPSC' as const,
    members: 756,
    activeSessions: 5,
    progress: 38,
    color: 'orange',
    roadmap: {
      duration: 24,
      milestones: 18,
      completed: 5
    }
  },
  {
    id: 'neet-2025',
    name: 'NEET 2025',
    description: 'NEET UG preparation with NCERT focus, previous year analysis, and expert doubt sessions',
    examType: 'NEET' as const,
    members: 1543,
    activeSessions: 4,
    progress: 72,
    color: 'purple',
    roadmap: {
      duration: 18,
      milestones: 14,
      completed: 10
    }
  },
  {
    id: 'gate-cs-2025',
    name: 'GATE Computer Science 2025',
    description: 'GATE CS preparation with subject-wise tests, programming practice, and aptitude quizzes',
    examType: 'GATE' as const,
    members: 634,
    activeSessions: 2,
    progress: 56,
    color: 'indigo',
    roadmap: {
      duration: 14,
      milestones: 10,
      completed: 6
    }
  },
];

export default function RoomsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredRooms = examRooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || room.examType === filterType;
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
                <Link href="/sessions" className="text-gray-600 hover:text-gray-900 px-3 py-4 font-medium">
                  Sessions
                </Link>
                <Link href="/rooms" className="text-blue-600 border-b-2 border-blue-600 px-3 py-4 font-medium">
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
                href="/rooms/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Room</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Competitive Exam Rooms</h1>
          <p className="text-xl opacity-90">
            Join dedicated study spaces for JEE, SSC, UPSC, NEET, GATE and more
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search exam rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Exams</option>
              <option value="JEE">JEE</option>
              <option value="SSC">SSC</option>
              <option value="UPSC">UPSC</option>
              <option value="NEET">NEET</option>
              <option value="GATE">GATE</option>
            </select>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <ExamRoomCard key={room.id} room={room} />
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No rooms found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ExamRoomCard({ room }: { room: typeof examRooms[0] }) {
  return (
    <Link href={`/rooms/${room.id}`} className="block">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-200 group">
        {/* Header */}
        <div className={`bg-gradient-to-r from-${room.color}-500 to-${room.color}-600 p-6 text-white`}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-xl font-bold mb-1">{room.name}</h3>
              <p className="text-sm opacity-90">{room.description}</p>
            </div>
            <Trophy className="w-6 h-6 opacity-80" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Members</p>
                <p className="font-semibold text-gray-900">{room.members.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Active Now</p>
                <p className="font-semibold text-gray-900">{room.activeSessions}</p>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Roadmap Progress</span>
              <span className="text-sm text-gray-600">{room.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`bg-${room.color}-600 h-2 rounded-full transition-all duration-300`}
                style={{ width: `${room.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Roadmap Info */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">Milestones: {room.roadmap.completed}/{room.roadmap.milestones}</span>
              </div>
              <span className="text-gray-600">Week {room.roadmap.duration}</span>
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Structured Roadmap</span>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Mock Tests</span>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">AI Quizzes</span>
          </div>

          {/* CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-900">Join Now</span>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
}
