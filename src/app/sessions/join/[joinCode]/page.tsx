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
  Loader2
} from 'lucide-react';

export default function JoinSessionPage({ params }: { params: Promise<{ joinCode: string }> }) {
  const { joinCode } = use(params);
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useAuthStore();
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !isAuthenticated) {
      toast.error('Please log in to join a session');
      router.push(`/auth/login?redirect=/sessions/join/${joinCode}`);
      return;
    }

    // Auto-join when authenticated
    if (!authLoading && isAuthenticated && user) {
      handleJoinSession();
    }
  }, [authLoading, isAuthenticated, user]);

  const handleJoinSession = async () => {
    if (!user || isJoining) return;

    setIsJoining(true);

    try {
      // Lookup session by join code
      const session = await getSessionByJoinCode(joinCode);

      if (!session) {
        toast.error('Invalid join code. Session not found.');
        router.push('/sessions');
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
        
        // Redirect to session detail page
        router.push(`/sessions/${session.id}`);
      } catch (error: any) {
        if (error.message.includes('already')) {
          // Already a participant, just redirect
          toast.success('You are already in this session');
          router.push(`/sessions/${session.id}`);
        } else if (error.message.includes('full')) {
          toast.error('Session is full');
          router.push('/sessions');
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      console.error('Error joining session:', error);
      toast.error(error.message || 'Failed to join session. Please try again.');
      router.push('/sessions');
    } finally {
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

