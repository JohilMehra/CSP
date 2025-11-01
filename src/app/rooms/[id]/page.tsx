'use client';

import { useState } from 'react';
import Link from 'next/link';
import { use } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Users, 
  CheckCircle, 
  Circle,
  Play,
  Award,
  Target,
  BarChart3,
  MessageSquare,
  Video,
  FileText,
  HelpCircle
} from 'lucide-react';

// Mock data - in production, fetch from database
const roomDetails = {
  'jee-main-2025': {
    name: 'JEE Main 2025',
    description: 'Complete JEE Main preparation with structured roadmap, mock tests, and peer collaboration',
    examType: 'JEE',
    members: 1248,
    activeSessions: 3,
    roadmap: {
      duration: 16,
      totalMilestones: 12,
      completedMilestones: 8,
      milestones: [
        {
          id: 1,
          week: 1,
          title: 'Mathematics Fundamentals',
          description: 'Build strong foundation in Algebra, Trigonometry, and Calculus basics',
          topics: ['Algebra', 'Trigonometry', 'Calculus Basics', 'Coordinate Geometry'],
          resources: [
            { type: 'video', title: 'Algebra Complete Course', url: '#' },
            { type: 'document', title: 'Trigonometry Formula Sheet', url: '#' },
            { type: 'quiz', title: 'Week 1 Assessment Quiz', url: '#' }
          ],
          completed: true
        },
        {
          id: 2,
          week: 2,
          title: 'Physics Mechanics',
          description: 'Master kinematics, dynamics, and work-energy concepts',
          topics: ['Kinematics', 'Dynamics', 'Work & Energy', 'Rotational Motion'],
          resources: [
            { type: 'video', title: 'Mechanics Crash Course', url: '#' },
            { type: 'document', title: 'Formula Sheet: Mechanics', url: '#' },
            { type: 'mock-test', title: 'Mechanics Mock Test', url: '#' }
          ],
          completed: true
        },
        {
          id: 3,
          week: 3,
          title: 'Chemistry Inorganic',
          description: 'Complete Periodic Table, Chemical Bonding, and p-block elements',
          topics: ['Periodic Table', 'Chemical Bonding', 'p-block Elements', 's-block'],
          resources: [
            { type: 'video', title: 'Inorganic Chemistry Masterclass', url: '#' },
            { type: 'document', title: 'Quick Revision Notes', url: '#' },
            { type: 'quiz', title: 'Inorganic Chemistry Quiz', url: '#' }
          ],
          completed: true
        },
        {
          id: 4,
          week: 4,
          title: 'Advanced Calculus',
          description: 'Differential equations, integrals, and application of derivatives',
          topics: ['Differential Equations', 'Definite Integrals', 'Application of Derivatives', 'Limits'],
          resources: [
            { type: 'video', title: 'Calculus Advanced Concepts', url: '#' },
            { type: 'document', title: 'Practice Problems Set 1', url: '#' },
            { type: 'quiz', title: 'Calculus Mastery Test', url: '#' }
          ],
          completed: false
        },
        {
          id: 5,
          week: 5,
          title: 'Electrostatics & Current Electricity',
          description: 'Electric fields, potential, capacitance, and Ohm\'s law applications',
          topics: ['Electrostatics', 'Electric Potential', 'Capacitance', 'Current Electricity'],
          resources: [
            { type: 'video', title: 'Electricity Complete Course', url: '#' },
            { type: 'document', title: 'Important Formulae', url: '#' },
            { type: 'mock-test', title: 'Electricity Mock Test', url: '#' }
          ],
          completed: false
        },
        {
          id: 6,
          week: 6,
          title: 'Organic Chemistry Basics',
          description: 'Hydrocarbons, functional groups, and basic reactions',
          topics: ['Alkanes', 'Alkenes', 'Alkynes', 'Aromatic Compounds'],
          resources: [
            { type: 'video', title: 'Organic Chemistry Fundamentals', url: '#' },
            { type: 'document', title: 'Reaction Mechanism Guide', url: '#' },
            { type: 'quiz', title: 'Organic Chemistry Quiz', url: '#' }
          ],
          completed: false
        },
      ]
    }
  }
};

export default function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'sessions' | 'discussions' | 'leaderboard'>('roadmap');
  
  const room = roomDetails[id as keyof typeof roomDetails];

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Room not found</h2>
          <Link href="/rooms" className="text-blue-600 hover:text-blue-700">
            Go back to all rooms
          </Link>
        </div>
      </div>
    );
  }

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
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/rooms" className="text-white opacity-80 hover:opacity-100">
              ← Back to Rooms
            </Link>
          </div>
          <h1 className="text-4xl font-bold mb-4">{room.name}</h1>
          <p className="text-xl opacity-90 mb-6">{room.description}</p>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>{room.members.toLocaleString()} Members</span>
            </div>
            <div className="flex items-center space-x-2">
              <Play className="w-5 h-5" />
              <span>{room.activeSessions} Active Sessions</span>
            </div>
            <div className="ml-auto">
              <Link 
                href={`/rooms/${id}/live`}
                className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
              >
                <Video className="w-5 h-5" />
                <span>Join Live Study Room</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <TabButton 
              label="Roadmap" 
              active={activeTab === 'roadmap'} 
              onClick={() => setActiveTab('roadmap')} 
            />
            <TabButton 
              label="Sessions" 
              active={activeTab === 'sessions'} 
              onClick={() => setActiveTab('sessions')} 
            />
            <TabButton 
              label="Discussions" 
              active={activeTab === 'discussions'} 
              onClick={() => setActiveTab('discussions')} 
            />
            <TabButton 
              label="Leaderboard" 
              active={activeTab === 'leaderboard'} 
              onClick={() => setActiveTab('leaderboard')} 
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'roadmap' && <RoadmapView roadmap={room.roadmap} />}
        {activeTab === 'sessions' && <SessionsView />}
        {activeTab === 'discussions' && <DiscussionsView />}
        {activeTab === 'leaderboard' && <LeaderboardView />}
      </div>
    </div>
  );
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-4 font-medium border-b-2 transition-colors ${
        active 
          ? 'border-blue-600 text-blue-600' 
          : 'border-transparent text-gray-600 hover:text-gray-900'
      }`}
    >
      {label}
    </button>
  );
}

function RoadmapView({ roadmap }: { roadmap: any }) {
  return (
    <div>
      {/* Progress Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Learning Roadmap</h2>
          <div className="text-right">
            <p className="text-3xl font-bold text-blue-600">{roadmap.completedMilestones}/{roadmap.totalMilestones}</p>
            <p className="text-sm text-gray-600">Milestones Completed</p>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${(roadmap.completedMilestones / roadmap.totalMilestones) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Milestones */}
      <div className="space-y-4">
        {roadmap.milestones.map((milestone: any, index: number) => (
          <MilestoneCard key={milestone.id} milestone={milestone} index={index} />
        ))}
      </div>
    </div>
  );
}

function MilestoneCard({ milestone, index }: { milestone: any; index: number }) {
  const Icon = milestone.completed ? CheckCircle : Circle;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex">
        {/* Timeline */}
        <div className="flex flex-col items-center px-6 py-6">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            milestone.completed ? 'bg-green-100' : 'bg-blue-100'
          }`}>
            <Icon className={`w-6 h-6 ${milestone.completed ? 'text-green-600' : 'text-blue-600'}`} />
          </div>
          {index < 5 && (
            <div className={`w-0.5 h-full ${milestone.completed ? 'bg-green-200' : 'bg-gray-200'}`}></div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-semibold text-blue-600">Week {milestone.week}</span>
                {milestone.completed && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Completed</span>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
              <p className="text-gray-600 mb-4">{milestone.description}</p>
            </div>
          </div>

          {/* Topics */}
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Topics Covered:</p>
            <div className="flex flex-wrap gap-2">
              {milestone.topics.map((topic: string) => (
                <span key={topic} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Resources:</p>
            <div className="grid md:grid-cols-3 gap-2">
              {milestone.resources.map((resource: any, idx: number) => (
                <a
                  key={idx}
                  href={resource.url}
                  className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {resource.type === 'video' && <Video className="w-4 h-4 text-red-600" />}
                  {resource.type === 'document' && <FileText className="w-4 h-4 text-blue-600" />}
                  {resource.type === 'quiz' && <Target className="w-4 h-4 text-purple-600" />}
                  {resource.type === 'mock-test' && <Award className="w-4 h-4 text-green-600" />}
                  <span className="text-sm text-gray-700">{resource.title}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Actions */}
          {!milestone.completed && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Start Week {milestone.week}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SessionsView() {
  return (
    <div className="text-center py-12">
      <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Upcoming Sessions</h3>
      <p className="text-gray-600">No scheduled sessions yet</p>
    </div>
  );
}

function DiscussionsView() {
  return (
    <div className="text-center py-12">
      <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Discussion Threads</h3>
      <p className="text-gray-600">No discussions yet</p>
    </div>
  );
}

function LeaderboardView() {
  return (
    <div className="text-center py-12">
      <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Leaderboard</h3>
      <p className="text-gray-600">No data yet</p>
    </div>
  );
}
