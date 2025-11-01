/**
 * Unified Backend Service
 * 
 * This file provides a unified interface to all backend operations,
 * ensuring all components are properly connected.
 */

import { 
  createSession, 
  getSessionById, 
  getSessionByJoinCode,
  addParticipantToSession,
  getSessionParticipants,
  getAllSessions,
  subscribeToSession,
  subscribeToAllSessions,
  SessionData
} from './firebaseSessions';

import {
  addPresence,
  updatePresence,
  removePresence,
  subscribeToParticipants,
  getParticipants
} from './presence';

import { 
  saveQuiz, 
  getQuizzes, 
  getQuizById,
  saveQuizAttempt,
  getUserDashboardData
} from './firestore';

import { useAuthStore } from '@/store/authStore';

/**
 * Complete session flow: Create → Share → Join → Enter Room
 */
export class SessionService {
  /**
   * Create a session and return the join link
   */
  static async createSessionWithLink(data: {
    title: string;
    description: string;
    hostId: string;
    hostName: string;
    startTime: Date;
    duration: number;
    maxParticipants: number;
  }): Promise<{ sessionId: string; joinCode: string; joinURL: string }> {
    const sessionId = await createSession(data);
    const session = await getSessionById(sessionId);
    
    if (!session) {
      throw new Error('Failed to create session');
    }

    return {
      sessionId,
      joinCode: session.joinCode,
      joinURL: session.joinURL || `/join/${session.joinCode}`
    };
  }

  /**
   * Join a session by code and prepare for room entry
   */
  static async joinSessionByCode(
    joinCode: string, 
    userId: string, 
    userName: string, 
    userAvatar?: string
  ): Promise<{ sessionId: string; roomId: string }> {
    // Lookup session
    const session = await getSessionByJoinCode(joinCode);
    
    if (!session) {
      throw new Error('Session not found');
    }

    // Add to participants
    await addParticipantToSession(
      session.id!,
      userId,
      userName,
      userAvatar
    );

    return {
      sessionId: session.id!,
      roomId: session.roomId || session.id!
    };
  }

  /**
   * Enter video room and set up presence
   */
  static async enterRoom(
    roomId: string,
    userId: string,
    userName: string,
    userAvatar?: string,
    agoraUid?: string | number
  ): Promise<void> {
    // Add presence to room
    await addPresence(
      roomId,
      userId,
      userName,
      userAvatar,
      agoraUid || userId
    );
  }

  /**
   * Leave room and clean up
   */
  static async leaveRoom(roomId: string, userId: string): Promise<void> {
    // Remove presence
    await removePresence(roomId, userId);
  }

  /**
   * Complete flow: Join session and enter room
   */
  static async joinAndEnterRoom(
    joinCode: string,
    userId: string,
    userName: string,
    userAvatar?: string
  ): Promise<{ sessionId: string; roomId: string }> {
    // Step 1: Join session
    const { sessionId, roomId } = await this.joinSessionByCode(
      joinCode,
      userId,
      userName,
      userAvatar
    );

    // Step 2: Enter room (presence)
    await this.enterRoom(roomId, userId, userName, userAvatar);

    return { sessionId, roomId };
  }
}

/**
 * Unified data fetcher for dashboard
 */
export class DashboardService {
  /**
   * Get all dashboard data for a user
   */
  static async getUserDashboard(userId: string) {
    const dashboardData = await getUserDashboardData(userId);
    
    // Also get recent sessions
    const allSessions = await getAllSessions();
    const userSessions = allSessions.filter(
      s => s.participants?.includes(userId) || s.hostId === userId
    );

    return {
      ...dashboardData,
      recentSessions: userSessions.slice(0, 5)
    };
  }
}

/**
 * Real-time subscription manager
 */
export class SubscriptionService {
  /**
   * Subscribe to a session with all its updates
   */
  static subscribeToSessionComplete(
    sessionId: string,
    callbacks: {
      onSessionUpdate?: (session: SessionData) => void;
      onParticipantsUpdate?: (participants: any[]) => void;
      onRoomPresenceUpdate?: (presence: any[]) => void;
    }
  ): () => void {
    const unsubscribers: (() => void)[] = [];

    // Subscribe to session
    if (callbacks.onSessionUpdate) {
      const unsub = subscribeToSession(sessionId, callbacks.onSessionUpdate);
      unsubscribers.push(unsub);
    }

    // Subscribe to session participants
    // (Note: This would need a new subscription function for session participants)

    // Subscribe to room presence
    const roomId = sessionId; // roomId === sessionId
    if (callbacks.onRoomPresenceUpdate) {
      const unsub = subscribeToParticipants(roomId, callbacks.onRoomPresenceUpdate);
      unsubscribers.push(unsub);
    }

    // Return cleanup function
    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }
}

/**
 * Export all services
 */
export default {
  SessionService,
  DashboardService,
  SubscriptionService
};

