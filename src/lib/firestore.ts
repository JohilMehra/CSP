// created new file
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
  onSnapshot,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { Quiz, QuizAttempt, Session, DiscussionThread } from '@/types';

// Quiz operations
export async function saveQuiz(quizData: any, userId: string) {
  try {
    const quizRef = doc(collection(db, 'quizzes'));
    await setDoc(quizRef, {
      ...quizData,
      userId,
      createdAt: Timestamp.now(),
      attempts: []
    });
    return quizRef.id;
  } catch (error) {
    console.error('Error saving quiz:', error);
    throw error;
  }
}

export async function getQuizzes() {
  try {
    const q = query(collection(db, 'quizzes'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting quizzes:', error);
    return [];
  }
}

export async function getQuizById(quizId: string) {
  try {
    const docRef = doc(db, 'quizzes', quizId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting quiz:', error);
    return null;
  }
}

export async function saveQuizAttempt(quizId: string, attempt: QuizAttempt) {
  try {
    const quizRef = doc(db, 'quizzes', quizId);
    const quizSnap = await getDoc(quizRef);
    
    if (!quizSnap.exists()) {
      throw new Error('Quiz not found');
    }

    const currentAttempts = quizSnap.data().attempts || [];
    await updateDoc(quizRef, {
      attempts: [...currentAttempts, {
        ...attempt,
        submittedAt: Timestamp.now()
      }]
    });

    // Update user's leaderboard score
    await updateUserScore(attempt.userId, attempt.score, attempt.maxScore);
    
    return true;
  } catch (error) {
    console.error('Error saving quiz attempt:', error);
    throw error;
  }
}

// Session operations
export async function saveSession(sessionData: Partial<Session>, userId: string) {
  try {
    const sessionRef = doc(collection(db, 'sessions'));
    await setDoc(sessionRef, {
      ...sessionData,
      hostId: userId,
      participants: [],
      isActive: false,
      createdAt: Timestamp.now()
    });
    return sessionRef.id;
  } catch (error) {
    console.error('Error saving session:', error);
    throw error;
  }
}

export async function getSessions() {
  try {
    const q = query(collection(db, 'sessions'), orderBy('startTime', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting sessions:', error);
    return [];
  }
}

// User score operations
async function updateUserScore(userId: string, score: number, maxScore: number) {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const currentScore = userSnap.data().totalScore || 0;
      const currentQuizzes = userSnap.data().quizzesCompleted || 0;
      const currentAverage = userSnap.data().averageScore || 0;
      
      const newTotal = currentScore + score;
      const newCompleted = currentQuizzes + 1;
      const newAverage = (currentAverage * currentQuizzes + (score / maxScore * 100)) / newCompleted;
      
      await updateDoc(userRef, {
        totalScore: newTotal,
        quizzesCompleted: newCompleted,
        averageScore: Math.round(newAverage * 100) / 100,
        lastActive: Timestamp.now()
      });
    } else {
      // Create user document if doesn't exist
      await setDoc(userRef, {
        totalScore: score,
        quizzesCompleted: 1,
        averageScore: (score / maxScore * 100),
        lastActive: Timestamp.now(),
        streak: 1
      });
    }
  } catch (error) {
    console.error('Error updating user score:', error);
  }
}

// Get user dashboard data
export async function getUserDashboardData(userId: string) {
  try {
    const [sessions, quizzes, userDoc] = await Promise.all([
      getSessions(),
      getQuizzes(),
      getDoc(doc(db, 'users', userId))
    ]);

    const userData = userDoc.exists() ? userDoc.data() : null;

    return {
      sessions: sessions.filter((s: any) => s.participants?.includes(userId) || s.hostId === userId),
      quizzes: quizzes.filter((q: any) => q.userId === userId),
      stats: {
        totalScore: userData?.totalScore || 0,
        quizzesCompleted: userData?.quizzesCompleted || 0,
        averageScore: userData?.averageScore || 0,
        streak: userData?.streak || 0
      }
    };
  } catch (error) {
    console.error('Error getting dashboard data:', error);
    return { sessions: [], quizzes: [], stats: null };
  }
}

// Real-time listeners
export function subscribeToQuizzes(callback: (quizzes: any[]) => void) {
  const q = query(collection(db, 'quizzes'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const quizzes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(quizzes);
  });
}

export function subscribeToSessions(callback: (sessions: any[]) => void) {
  const q = query(collection(db, 'sessions'), orderBy('startTime', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const sessions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(sessions);
  });
}

