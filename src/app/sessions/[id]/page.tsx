'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import {
  getSessionById,
  getSessionParticipants,
  subscribeToSession,
  subscribeToSessionParticipants,
  SessionData,
  SessionParticipant
} from '@/lib/firebaseSessions';
import {
  BookOpen,
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Copy,
  Video,
  Share2,
  Check
} from 'lucide-react';
import { formatRelativeTime } from '@/utils/dateUtils';
import toast from '@/lib/toast';

export default function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuthStore();
  const [session, setSession] = useState<SessionData | null>(null);
  const [participants, setParticipants] = useState<SessionParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    // Load initial session data
    const loadSession = async () => {
      try {
        const sessionData = await getSessionById(id);
        if (!sessionData) {
          toast.error('Session not found');
          router.push('/sessions');
          return;
        }
        setSession(sessionData);

        // Load participants
        const participantsData = await getSessionParticipants(id);
        setParticipants(participantsData);
      } catch (error) {
        console.error('Error loading session:', error);
        toast.error('Failed to load session');
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();

    // Subscribe to real-time session updates
    const unsubscribeSession = subscribeToSession(id, (updatedSession) => {
      if (updatedSession) {
        setSession(updatedSession);
      }
    });

    // Subscribe to real-time participant updates
    const unsubscribeParticipants = subscribeToSessionParticipants(id, (updatedParticipants) => {
      setParticipants(updatedParticipants);
    });

    return () => {
      unsubscribeSession();
      unsubscribeParticipants();
    };
  }, [id, router]);

  const handleCopyLink = async () => {
    if (!session) return;

    // Use the joinURL format: /join/{joinCode}
    const joinUrl = `${window.location.origin}/join/${session.joinCode}`;
    
    try {
      await navigator.clipboard.writeText(joinUrl);
      setLinkCopied(true);
      toast.success('Link copied!');
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleJoinRoom = () => {
    if (!session) return;
    router.push(`/rooms/${session.roomId || session.id}/live`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Session not found</h2>
          <Link href="/sessions" className="text-blue-600 hover:text-blue-700">
            Go back to sessions
          </Link>
        </div>
      </div>
    );
  }

  const isHost = user?.id === session.hostId;
  const isParticipant = session.participants?.includes(user?.id || '') || false;
  const isUpcoming = session.startTime > new Date();
  const participationPercent = (participants.length / session.maxParticipants) * 100;

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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link 
          href="/sessions"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Sessions</span>
        </Link>

        {/* Session Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{session.title}</h1>
              {isUpcoming && (
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  Upcoming
                </span>
              )}
              {isHost && (
                <span className="inline-block ml-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  Host
                </span>
              )}
            </div>
          </div>

          {session.description && (
            <p className="text-gray-600 mb-6">{session.description}</p>
          )}

          {/* Session Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Start Time</p>
                <p className="font-medium text-gray-900">
                  {formatRelativeTime(session.startTime)}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(session.startTime).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium text-gray-900">{session.duration} minutes</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Participants</p>
                <p className="font-medium text-gray-900">
                  {participants.length}/{session.maxParticipants}
                </p>
              </div>
            </div>
          </div>

          {/* Participation Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Seats filled</span>
              <span className="text-sm text-gray-600">{Math.round(participationPercent)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${participationPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Host Info */}
          <div className="flex items-center space-x-3 pb-4 border-b border-gray-200 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {session.hostName?.charAt(0).toUpperCase() || 'H'}
            </div>
            <div>
              <p className="text-sm text-gray-500">Hosted by</p>
              <p className="font-medium text-gray-900">{session.hostName || 'Unknown'}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleJoinRoom}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Video className="w-5 h-5" />
              <span>Join Room</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {linkCopied ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-5 h-5" />
                  <span>Share Link</span>
                </>
              )}
            </button>
            {linkCopied && (
              <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm">
                <span>Join Code: <strong>{session.joinCode}</strong></span>
                <Copy className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>

        {/* Participants List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Participants ({participants.length})
          </h2>
          
          {participants.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No participants yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {participants.map((participant) => (
                <div
                  key={participant.userId}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {participant.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {participant.userName}
                      {participant.userId === session.hostId && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          Host
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      Joined {formatRelativeTime(participant.joinedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

