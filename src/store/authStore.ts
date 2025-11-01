import { create } from 'zustand';
import { User } from '@/types';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    isLoading: false 
  }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  logout: async () => {
    try {
      await firebaseSignOut(auth);
      set({ 
        user: null, 
        isAuthenticated: false,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  },
  
  initializeAuth: () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user document from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            set({
              user: {
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: userData.name || firebaseUser.displayName || 'User',
                avatar: userData.avatar || firebaseUser.photoURL || undefined,
                role: userData.role || 'student',
                createdAt: userData.createdAt?.toDate() || new Date(),
                lastActive: new Date(),
                groups: userData.groups || []
              },
              isAuthenticated: true,
              isLoading: false
            });
          } else {
            // Create basic user if document doesn't exist
            set({
              user: {
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: firebaseUser.displayName || 'User',
                avatar: firebaseUser.photoURL || undefined,
                role: 'student',
                createdAt: new Date(),
                lastActive: new Date(),
                groups: []
              },
              isAuthenticated: true,
              isLoading: false
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          set({
            user: {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'User',
              avatar: firebaseUser.photoURL || undefined,
              role: 'student',
              createdAt: new Date(),
              lastActive: new Date(),
              groups: []
            },
            isAuthenticated: true,
            isLoading: false
          });
        }
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    });
  }
}));
