'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { useAuthStore } from '@/store/authStore';
import {
  getSessionByJoinCode,
  addParticipantToSession
} from '@/lib/firebaseSessions';
import toast from '@/lib/toast';
import {
  BookOpen,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function JoinPage({ params }: { params: Promise<{ joinCode: string }> }) {
  const { joinCode } = use(params);
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useAuthStore();
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !isAuthenticated) {
      toast.error('Please log in to join a session');
      router.push(`/auth/login?redirect=/join/${joinCode}`);
      return;
    }

    // Auto-join when authenticated
    if (!authLoading && isAuthenticated && user && !isJoining && !error) {
      handleJoinSession();
    }
  }, [authLoading, isAuthenticated, user]);

  const handleJoinSession = async () => {
    if (!user || isJoining) return;

    setIsJoining(true);
    setError(null);

    try {
      // Lookup session by join code
      const session = await getSessionByJoinCode(joinCode);

      if (!session) {
        setError('Session not found. Invalid join code.');
        setIsJoining(false);
        return;
      }

      // Add user to participants
      try {
        await addParticipantToSession(
          session.id!,
          user.id,
          user.name,
          user.avatar
        );

        toast.success('Joined session successfully!');
        
        // Wait for Firestore write to complete
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Redirect to room (using roomId or session id)
        const roomId = session.roomId || session.id;
        router.push(`/rooms/${roomId}/live`);
      } catch (error: any) {
        if (error.message.includes('already')) {
          // Already a participant, just redirect
          toast.success('You are already in this session');
          const roomId = session.roomId || session.id;
          router.push(`/rooms/${roomId}/live`);
        } else if (error.message.includes('full')) {
          setError('Session is full');
          setIsJoining(false);
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      console.error('Error joining session:', error);
      setError(error.message || 'Failed to join session. Please try again.');
      setIsJoining(false);
    }
  };

  if (authLoading || isJoining) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {authLoading ? 'Loading...' : 'Joining session...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500 mb-6">Join Code: <strong>{joinCode}</strong></p>
          </div>
          <button
            onClick={() => router.push('/sessions')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Sessions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Joining Session</h1>
          <p className="text-gray-600">Join Code: <strong>{joinCode}</strong></p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Please wait...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

