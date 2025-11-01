import { 
  collection, 
  doc, 
  addDoc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  updateDoc,
  deleteDoc,
  onSnapshot,
  Timestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from './firebase';

export interface SessionData {
  id?: string;
  title: string;
  description: string;
  hostId: string;
  hostName?: string;
  startTime: Date | Timestamp;
  endTime?: Date | Timestamp;
  duration: number; // in minutes
  maxParticipants: number;
  createdAt: Date | Timestamp;
  joinCode: string;
  joinURL?: string; // Automatically generated join URL
  participants: string[];
  isActive: boolean;
  roomId?: string;
}

export interface SessionParticipant {
  userId: string;
  userName: string;
  userAvatar?: string;
  joinedAt: Date | Timestamp;
}

/**
 * Generate a random join code (8 characters, uppercase alphanumeric)
 */
function generateJoinCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

/**
 * Create a new session in Firestore
 */
export async function createSession(sessionData: {
  title: string;
  description: string;
  hostId: string;
  hostName: string;
  startTime: Date;
  duration: number;
  maxParticipants: number;
}): Promise<string> {
  try {
    // Generate unique join code
    let joinCode = generateJoinCode();
    
    // Ensure join code is unique (check if exists)
    let existingSession = await getSessionByJoinCode(joinCode);
    let attempts = 0;
    while (existingSession && attempts < 10) {
      // Regenerate if duplicate
      joinCode = generateJoinCode();
      existingSession = await getSessionByJoinCode(joinCode);
      attempts++;
    }

    // Calculate end time
    const endTime = new Date(sessionData.startTime);
    endTime.setMinutes(endTime.getMinutes() + sessionData.duration);

    const sessionRef = doc(collection(db, 'sessions'));
    // Generate join URL (relative path, will be combined with origin on client)
    const joinURL = `/join/${joinCode}`;
    
    const sessionDoc = {
      title: sessionData.title,
      description: sessionData.description,
      hostId: sessionData.hostId,
      hostName: sessionData.hostName,
      startTime: Timestamp.fromDate(sessionData.startTime),
      endTime: Timestamp.fromDate(endTime),
      duration: sessionData.duration,
      maxParticipants: sessionData.maxParticipants,
      createdAt: Timestamp.now(),
      joinCode,
      joinURL, // Store relative URL
      participants: [],
      isActive: false,
      roomId: sessionRef.id // Use session ID as room ID
    };

    await setDoc(sessionRef, sessionDoc);
    return sessionRef.id;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
}

/**
 * Get session by ID
 */
export async function getSessionById(sessionId: string): Promise<SessionData | null> {
  try {
    const sessionRef = doc(db, 'sessions', sessionId);
    const sessionSnap = await getDoc(sessionRef);
    
    if (sessionSnap.exists()) {
      const data = sessionSnap.data();
      return {
        id: sessionSnap.id,
        ...data,
        startTime: data.startTime?.toDate() || new Date(),
        endTime: data.endTime?.toDate(),
        createdAt: data.createdAt?.toDate() || new Date(),
      } as SessionData;
    }
    return null;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Get session by join code
 */
export async function getSessionByJoinCode(joinCode: string): Promise<SessionData | null> {
  try {
    const q = query(collection(db, 'sessions'), where('joinCode', '==', joinCode));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        startTime: data.startTime?.toDate() || new Date(),
        endTime: data.endTime?.toDate(),
        createdAt: data.createdAt?.toDate() || new Date(),
      } as SessionData;
    }
    return null;
  } catch (error) {
    console.error('Error getting session by join code:', error);
    return null;
  }
}

/**
 * Get all sessions (ordered by start time)
 */
export async function getAllSessions(): Promise<SessionData[]> {
  try {
    const q = query(collection(db, 'sessions'), orderBy('startTime', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        startTime: data.startTime?.toDate() || new Date(),
        endTime: data.endTime?.toDate(),
        createdAt: data.createdAt?.toDate() || new Date(),
      } as SessionData;
    });
  } catch (error) {
    console.error('Error getting sessions:', error);
    return [];
  }
}

/**
 * Add participant to session
 */
export async function addParticipantToSession(
  sessionId: string,
  userId: string,
  userName: string,
  userAvatar?: string
): Promise<boolean> {
  try {
    const sessionRef = doc(db, 'sessions', sessionId);
    const sessionSnap = await getDoc(sessionRef);
    
    if (!sessionSnap.exists()) {
      throw new Error('Session not found');
    }

    const sessionData = sessionSnap.data();
    const participants = sessionData.participants || [];

    // Check if already a participant
    if (participants.includes(userId)) {
      return true; // Already joined
    }

    // Check if session is full
    if (participants.length >= sessionData.maxParticipants) {
      throw new Error('Session is full');
    }

    // Add to participants array
    await updateDoc(sessionRef, {
      participants: arrayUnion(userId)
    });

    // Add participant document
    const participantRef = doc(db, 'sessions', sessionId, 'participants', userId);
    await setDoc(participantRef, {
      userId,
      userName,
      userAvatar,
      joinedAt: Timestamp.now()
    });

    return true;
  } catch (error) {
    console.error('Error adding participant:', error);
    throw error;
  }
}

/**
 * Remove participant from session
 */
export async function removeParticipantFromSession(
  sessionId: string,
  userId: string
): Promise<void> {
  try {
    const sessionRef = doc(db, 'sessions', sessionId);
    await updateDoc(sessionRef, {
      participants: arrayRemove(userId)
    });

    // Remove participant document
    const participantRef = doc(db, 'sessions', sessionId, 'participants', userId);
    await deleteDoc(participantRef);
  } catch (error) {
    console.error('Error removing participant:', error);
    throw error;
  }
}

/**
 * Get all participants for a session
 */
export async function getSessionParticipants(sessionId: string): Promise<SessionParticipant[]> {
  try {
    const participantsRef = collection(db, 'sessions', sessionId, 'participants');
    const querySnapshot = await getDocs(participantsRef);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        userId: data.userId,
        userName: data.userName,
        userAvatar: data.userAvatar,
        joinedAt: data.joinedAt?.toDate() || new Date(),
      } as SessionParticipant;
    });
  } catch (error) {
    console.error('Error getting participants:', error);
    return [];
  }
}

/**
 * Subscribe to session participants (real-time)
 */
export function subscribeToSessionParticipants(
  sessionId: string,
  callback: (participants: SessionParticipant[]) => void
): () => void {
  const participantsRef = collection(db, 'sessions', sessionId, 'participants');
  
  const unsubscribe = onSnapshot(participantsRef, (snapshot) => {
    const participants: SessionParticipant[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      participants.push({
        userId: data.userId,
        userName: data.userName,
        userAvatar: data.userAvatar,
        joinedAt: data.joinedAt?.toDate() || new Date(),
      });
    });
    
    callback(participants);
  }, (error) => {
    console.error('Error subscribing to session participants:', error);
    callback([]);
  });

  return unsubscribe;
}

/**
 * Subscribe to session updates (real-time)
 */
export function subscribeToSession(
  sessionId: string,
  callback: (session: SessionData | null) => void
): () => void {
  const sessionRef = doc(db, 'sessions', sessionId);
  
  const unsubscribe = onSnapshot(sessionRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      callback({
        id: snapshot.id,
        ...data,
        startTime: data.startTime?.toDate() || new Date(),
        endTime: data.endTime?.toDate(),
        createdAt: data.createdAt?.toDate() || new Date(),
      } as SessionData);
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('Error subscribing to session:', error);
    callback(null);
  });

  return unsubscribe;
}

/**
 * Subscribe to all sessions (real-time)
 */
export function subscribeToAllSessions(
  callback: (sessions: SessionData[]) => void
): () => void {
  const q = query(collection(db, 'sessions'), orderBy('startTime', 'desc'));
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const sessions = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        startTime: data.startTime?.toDate() || new Date(),
        endTime: data.endTime?.toDate(),
        createdAt: data.createdAt?.toDate() || new Date(),
      } as SessionData;
    });
    callback(sessions);
  }, (error) => {
    console.error('Error subscribing to sessions:', error);
    callback([]);
  });

  return unsubscribe;
}

