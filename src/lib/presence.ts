import { 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  serverTimestamp,
  collection,
  query,
  where
} from 'firebase/firestore';
import { db } from './firebase';

export interface PresenceData {
  userId: string;
  userName: string;
  userAvatar?: string;
  joinedAt: any;
  isVideoOn: boolean;
  isAudioOn: boolean;
  agoraUid: string | number;
}

/**
 * Add user presence to Firestore when joining a room
 */
export async function addPresence(
  roomId: string, 
  userId: string, 
  userName: string,
  userAvatar: string | undefined,
  agoraUid: string | number
): Promise<void> {
  try {
    const presenceRef = doc(db, 'rooms', roomId, 'participants', userId);
    await setDoc(presenceRef, {
      userId,
      userName,
      userAvatar,
      joinedAt: serverTimestamp(),
      isVideoOn: true,
      isAudioOn: true,
      agoraUid,
      lastSeen: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error adding presence:', error);
    throw error;
  }
}

/**
 * Update user presence status (video/audio state)
 */
export async function updatePresence(
  roomId: string,
  userId: string,
  updates: Partial<Pick<PresenceData, 'isVideoOn' | 'isAudioOn'>>
): Promise<void> {
  try {
    const presenceRef = doc(db, 'rooms', roomId, 'participants', userId);
    await setDoc(presenceRef, {
      ...updates,
      lastSeen: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error updating presence:', error);
  }
}

/**
 * Remove user presence when leaving room
 */
export async function removePresence(roomId: string, userId: string): Promise<void> {
  try {
    const presenceRef = doc(db, 'rooms', roomId, 'participants', userId);
    await deleteDoc(presenceRef);
  } catch (error) {
    console.error('Error removing presence:', error);
  }
}

/**
 * Subscribe to participants in a room (real-time updates)
 */
export function subscribeToParticipants(
  roomId: string,
  callback: (participants: PresenceData[]) => void
): () => void {
  const participantsRef = collection(db, 'rooms', roomId, 'participants');
  
  const unsubscribe = onSnapshot(participantsRef, (snapshot) => {
    const participants: PresenceData[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      participants.push({
        userId: data.userId,
        userName: data.userName,
        userAvatar: data.userAvatar,
        joinedAt: data.joinedAt,
        isVideoOn: data.isVideoOn ?? true,
        isAudioOn: data.isAudioOn ?? true,
        agoraUid: data.agoraUid
      });
    });
    
    callback(participants);
  }, (error) => {
    console.error('Error subscribing to participants:', error);
  });

  return unsubscribe;
}

/**
 * Get all participants in a room (one-time fetch)
 */
export async function getParticipants(roomId: string): Promise<PresenceData[]> {
  try {
    const participantsRef = collection(db, 'rooms', roomId, 'participants');
    const { getDocs } = await import('firebase/firestore');
    const snapshot = await getDocs(participantsRef);
    
    const participants: PresenceData[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      participants.push({
        userId: data.userId,
        userName: data.userName,
        userAvatar: data.userAvatar,
        joinedAt: data.joinedAt,
        isVideoOn: data.isVideoOn ?? true,
        isAudioOn: data.isAudioOn ?? true,
        agoraUid: data.agoraUid
      });
    });
    
    return participants;
  } catch (error) {
    console.error('Error getting participants:', error);
    return [];
  }
}

