'use client';

import Link from 'next/link';
import { 
  BookOpen, 
  Trophy,
  TrendingUp,
  Award,
  Medal,
  Crown
} from 'lucide-react';

const leaderboardData = [
  { rank: 1, name: 'Alex Kumar', score: 2340, quizzesCompleted: 45, avgScore: 92, streak: 21, avatar: 'A' },
  { rank: 2, name: 'Sarah Chen', score: 2180, quizzesCompleted: 52, avgScore: 88, streak: 15, avatar: 'S' },
  { rank: 3, name: 'Priya Shah', score: 2050, quizzesCompleted: 38, avgScore: 90, streak: 30, avatar: 'P' },
  { rank: 4, name: 'John Doe', score: 1920, quizzesCompleted: 42, avgScore: 87, streak: 12, avatar: 'J' },
  { rank: 5, name: 'Ravi Patel', score: 1850, quizzesCompleted: 35, avgScore: 89, streak: 18, avatar: 'R' },
  { rank: 6, name: 'Meera Singh', score: 1750, quizzesCompleted: 40, avgScore: 85, streak: 10, avatar: 'M' },
  { rank: 7, name: 'Aditya Joshi', score: 1680, quizzesCompleted: 33, avgScore: 86, streak: 14, avatar: 'A' },
  { rank: 8, name: 'Neha Gupta', score: 1620, quizzesCompleted: 31, avgScore: 84, streak: 9, avatar: 'N' },
  { rank: 9, name: 'Vikram Sharma', score: 1580, quizzesCompleted: 29, avgScore: 88, streak: 22, avatar: 'V' },
  { rank: 10, name: 'Ananya Rao', score: 1520, quizzesCompleted: 28, avgScore: 83, streak: 11, avatar: 'A' },
];

export default function LeaderboardPage() {
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
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-4">
            <Trophy className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Leaderboard</h1>
          </div>
          <p className="text-xl opacity-90">
            Top performers this week across all study groups
          </p>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-8">
        <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto mb-12">
          {/* 2nd Place */}
          <div className="pt-12">
            <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl p-6 shadow-lg relative">
              <Medal className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                {leaderboardData[1].avatar}
              </div>
              <h3 className="text-center font-bold text-gray-900 mb-1">{leaderboardData[1].name}</h3>
              <p className="text-center text-3xl font-bold text-gray-700 mb-2">{leaderboardData[1].score}</p>
              <div className="flex items-center justify-center space-x-1 text-gray-600">
                <Trophy className="w-4 h-4" />
                <span className="text-sm font-semibold">2nd</span>
              </div>
            </div>
          </div>

          {/* 1st Place */}
          <div>
            <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-2xl p-6 shadow-xl relative transform scale-110">
              <Crown className="w-16 h-16 text-yellow-800 mx-auto mb-4" />
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-3 border-4 border-white">
                {leaderboardData[0].avatar}
              </div>
              <h3 className="text-center font-bold text-gray-900 mb-1">{leaderboardData[0].name}</h3>
              <p className="text-center text-4xl font-bold text-gray-700 mb-2">{leaderboardData[0].score}</p>
              <div className="flex items-center justify-center space-x-1 text-yellow-800">
                <Trophy className="w-5 h-5" />
                <span className="text-lg font-bold">1st</span>
              </div>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="pt-12">
            <div className="bg-gradient-to-br from-orange-200 to-orange-300 rounded-2xl p-6 shadow-lg relative">
              <Medal className="w-12 h-12 text-orange-700 mx-auto mb-4" />
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                {leaderboardData[2].avatar}
              </div>
              <h3 className="text-center font-bold text-gray-900 mb-1">{leaderboardData[2].name}</h3>
              <p className="text-center text-3xl font-bold text-gray-700 mb-2">{leaderboardData[2].score}</p>
              <div className="flex items-center justify-center space-x-1 text-orange-700">
                <Trophy className="w-4 h-4" />
                <span className="text-sm font-semibold">3rd</span>
              </div>
            </div>
          </div>
        </div>

        {/* Full Leaderboard */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <h2 className="text-2xl font-bold">Weekly Rankings</h2>
            <p className="opacity-90">Complete leaderboard for the current week</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Score</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quizzes</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Avg Score</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Streak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaderboardData.slice(3).map((entry, index) => (
                  <tr key={entry.rank} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-bold text-gray-700">#{entry.rank}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {entry.avatar}
                        </div>
                        <span className="font-medium text-gray-900">{entry.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="font-bold text-gray-900">{entry.score.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {entry.quizzesCompleted}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="font-medium text-gray-900">{entry.avgScore}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <Award className="w-4 h-4 text-orange-500" />
                        <span className="font-medium text-gray-900">{entry.streak} days</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Your Stats */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6">Your Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm opacity-90 mb-1">Your Rank</p>
              <p className="text-3xl font-bold">#12</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm opacity-90 mb-1">Total Score</p>
              <p className="text-3xl font-bold">1,420</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm opacity-90 mb-1">Quizzes Done</p>
              <p className="text-3xl font-bold">24</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm opacity-90 mb-1">Current Streak</p>
              <p className="text-3xl font-bold">7 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
