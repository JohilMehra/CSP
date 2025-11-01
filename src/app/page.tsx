'use client';

import Link from 'next/link';
import { BookOpen, Users, Trophy, MessageSquare, Calendar, Target } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">StudySync</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-gray-700 hover:text-blue-600 font-medium">
                Login
              </Link>
              <Link 
                href="/auth/register" 
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Advanced Study Collaboration
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Portal for Smart Teams
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Real-time session scheduling, shared progress dashboards, collaborative micro-quizzes, 
            and data-driven analytics for your study group
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/register"
              className="bg-blue-600 text-white px-8 py-4 rounded-full hover:bg-blue-700 transition-all text-lg font-semibold shadow-lg hover:shadow-xl"
            >
              Start Your Journey
            </Link>
            <Link 
              href="/demo"
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full hover:bg-blue-50 transition-all text-lg font-semibold"
            >
              Watch Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
          Everything You Need to Excel Together
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Calendar className="w-8 h-8" />}
            title="Session Scheduler"
            description="Schedule study sessions with automatic reminders and time-zone support for your team"
          />
          <FeatureCard
            icon={<Users className="w-8 h-8" />}
            title="Competitive Exam Rooms"
            description="Dedicated spaces for JEE, SSC, UPSC, NEET, GATE with structured roadmaps and course materials"
          />
          <FeatureCard
            icon={<BookOpen className="w-8 h-8" />}
            title="AI-Powered Quizzes"
            description="Generate topic-specific quizzes with instant feedback using Gemini AI"
          />
          <FeatureCard
            icon={<MessageSquare className="w-8 h-8" />}
            title="Discussion Forums"
            description="Async discussion threads with upvoting, threading, and topic-based organization"
          />
          <FeatureCard
            icon={<Trophy className="w-8 h-8" />}
            title="Live Leaderboards"
            description="Track progress with real-time leaderboards and weekly achievements"
          />
          <FeatureCard
            icon={<Target className="w-8 h-8" />}
            title="Progress Analytics"
            description="Data-driven insights on group effectiveness and individual performance"
          />
        </div>
      </section>

      {/* Use Cases */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">Perfect For</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <UseCaseCard
              title="PhD Comprehensive Exam Prep"
              description="Research teams review tagged summaries, build custom quizzes on distributed systems, and use feedback loops to identify weakest topics"
            />
            <UseCaseCard
              title="Multi-School Hackathon Teams"
              description="Live voice/video sessions with shared code pads, tracked goal completion rates, and collaborative problem-solving"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Study Experience?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of students and researchers excelling together</p>
          <Link 
            href="/auth/register"
            className="bg-white text-blue-600 px-8 py-4 rounded-full hover:bg-gray-100 transition-all text-lg font-semibold inline-block"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">StudySync</span>
            </div>
            <p className="text-gray-600">© 2025 StudySync. Built with Next.js & Firebase.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
      <div className="text-blue-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function UseCaseCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
      <h3 className="text-2xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}