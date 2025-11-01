# 🔗 Complete Backend Architecture & Connections

## 📊 **Overview**

This document explains how all backend components are connected and working together in StudySync.

---

## 🗄️ **Firestore Database Structure**

### **Collections & Subcollections**

```
firestore/
├── users/
│   └── {userId}/
│       ├── id: string
│       ├── email: string
│       ├── name: string
│       ├── avatar?: string
│       ├── role: 'student' | 'teacher' | 'admin'
│       ├── createdAt: Timestamp
│       ├── lastActive: Timestamp
│       ├── groups: string[]
│       ├── totalScore: number
│       ├── quizzesCompleted: number
│       ├── averageScore: number
│       └── streak: number
│
├── sessions/
│   └── {sessionId}/
│       ├── id: string
│       ├── title: string
│       ├── description: string
│       ├── hostId: string
│       ├── hostName: string
│       ├── startTime: Timestamp
│       ├── endTime: Timestamp
│       ├── duration: number (minutes)
│       ├── maxParticipants: number
│       ├── createdAt: Timestamp
│       ├── joinCode: string (8 chars, unique)
│       ├── joinURL: string (/join/{joinCode})
│       ├── participants: string[] (user IDs)
│       ├── isActive: boolean
│       └── roomId: string (same as sessionId)
│       │
│       └── participants/ (subcollection)
│           └── {userId}/
│               ├── userId: string
│               ├── userName: string
│               ├── userAvatar?: string
│               └── joinedAt: Timestamp
│
├── rooms/
│   └── {roomId}/
│       └── participants/ (subcollection for video presence)
│           └── {userId}/
│               ├── userId: string
│               ├── userName: string
│               ├── userAvatar?: string
│               ├── joinedAt: Timestamp
│               ├── isVideoOn: boolean
│               ├── isAudioOn: boolean
│               ├── agoraUid: string | number
│               └── lastSeen: Timestamp
│
├── quizzes/
│   └── {quizId}/
│       ├── id: string
│       ├── userId: string (creator)
│       ├── title: string
│       ├── topic: string
│       ├── difficulty: 'easy' | 'medium' | 'hard'
│       ├── questions: Question[]
│       ├── timeLimit?: number
│       ├── createdAt: Timestamp
│       └── attempts: QuizAttempt[]
│
└── discussions/ (future)
    └── {threadId}/
        └── ...
```

---

## 🔄 **Data Flow & Connections**

### **1. User Authentication Flow**

```
User Register/Login
    ↓
Firebase Auth (authentication)
    ↓
AuthProvider → onAuthStateChanged listener
    ↓
authStore.setUser() → Fetch user from Firestore
    ↓
If user doesn't exist → Create user document in Firestore
    ↓
User state available throughout app
```

**Files:**
- `src/store/authStore.ts` - Auth state management
- `src/components/AuthProvider.tsx` - Initializes auth on mount
- `src/lib/firebase.ts` - Firebase configuration

---

### **2. Session Creation Flow**

```
User fills form at /sessions/new
    ↓
createSession() called
    ↓
Generate unique 8-character joinCode
    ↓
Create session document in Firestore:
  - sessions/{sessionId}
  - Auto-generate joinURL: /join/{joinCode}
  - Set roomId = sessionId
    ↓
Redirect to /sessions/{sessionId}
    ↓
Session detail page loads
    - Shows join code
    - Shows copy link button
    - Real-time participant updates
```

**Files:**
- `src/lib/firebaseSessions.ts` - Session CRUD operations
- `src/app/sessions/new/page.tsx` - Session creation form
- `src/app/sessions/[id]/page.tsx` - Session detail view

---

### **3. Join Session Flow**

```
User clicks /join/{joinCode} link
    ↓
getSessionByJoinCode(joinCode)
    ↓
Session found?
    ↓ YES
addParticipantToSession()
    ↓
Add userId to sessions/{sessionId}/participants subcollection
    ↓
Add userId to sessions/{sessionId}.participants array
    ↓
Redirect to /rooms/{roomId}/live
    ↓
VideoRoom component loads
    ↓
Add presence to rooms/{roomId}/participants
    ↓
Subscribe to real-time updates
```

**Files:**
- `src/app/join/[joinCode]/page.tsx` - Join page
- `src/lib/firebaseSessions.ts` - Join operations
- `src/components/VideoRoom.tsx` - Room component

---

### **4. Video Room Flow**

```
User enters /rooms/{roomId}/live
    ↓
VideoRoom component mounts
    ↓
If Agora configured:
  - Show permission modal
  - Request camera/mic access
  - Join Agora channel
  - Publish video/audio tracks
    ↓
If Agora NOT configured:
  - Text-only mode
  - No video/audio
    ↓
Add presence to rooms/{roomId}/participants
    ↓
Subscribe to presence updates (real-time)
    ↓
Display participants in grid/list
    ↓
User leaves:
  - Remove presence from Firestore
  - Unpublish Agora tracks (if configured)
  - Leave Agora channel
```

**Files:**
- `src/components/VideoRoom.tsx` - Main video room
- `src/lib/presence.ts` - Presence tracking
- `src/lib/agora.ts` - Agora SDK helpers

---

### **5. Participant Tracking (Dual System)**

**Session Participants:**
```
sessions/{sessionId}/participants/{userId}
```
- Tracks who joined the session
- Shows in session detail page
- Managed by firebaseSessions.ts

**Room Presence:**
```
rooms/{roomId}/participants/{userId}
```
- Tracks who's currently in the video room
- Shows in video room UI
- Real-time updates
- Managed by presence.ts

**Connection:**
- `sessionId` = `roomId` (same ID)
- Both track the same users but for different purposes
- Session participants = "who joined"
- Room presence = "who's online now"

---

## 🔗 **Key Connections**

### **Session ↔ Room Connection**
```typescript
// When session is created:
roomId: sessionId  // Same ID links them

// When joining:
/join/{joinCode} → find session → redirect to /rooms/{sessionId}/live
```

### **User ↔ Session Connection**
```typescript
// Session document:
hostId: userId
participants: [userId1, userId2, ...]

// Participant subcollection:
sessions/{sessionId}/participants/{userId}
```

### **Session ↔ Room Presence Connection**
```typescript
// Session participants (who joined):
sessions/{sessionId}/participants/{userId}

// Room presence (who's online):
rooms/{roomId}/participants/{userId}

// roomId === sessionId, so they're linked
```

---

## 📡 **Real-Time Subscriptions**

### **1. Session Updates**
```typescript
subscribeToSession(sessionId, callback)
// Listens to: sessions/{sessionId}
// Updates: Session data, participant count
```

### **2. All Sessions**
```typescript
subscribeToAllSessions(callback)
// Listens to: sessions collection
// Updates: Session list page
```

### **3. Room Presence**
```typescript
subscribeToParticipants(roomId, callback)
// Listens to: rooms/{roomId}/participants
// Updates: Video room participant list
```

### **4. Quizzes**
```typescript
subscribeToQuizzes(callback)
// Listens to: quizzes collection
// Updates: Quiz list page
```

---

## 🔐 **Security & Rules**

### **Recommended Firestore Rules**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users - can read own, write own
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Sessions - all authenticated users can read, hosts can create/update
    match /sessions/{sessionId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.hostId;
      allow update: if request.auth != null;
      
      // Session participants subcollection
      match /participants/{userId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Rooms - for video presence
    match /rooms/{roomId} {
      allow read: if request.auth != null;
      
      // Room participants (presence)
      match /participants/{userId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Quizzes - public read, authenticated write
    match /quizzes/{quizId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 🔧 **Backend Helper Files**

### **1. `src/lib/firebase.ts`**
- Firebase app initialization
- Auth configuration
- Firestore database instance

### **2. `src/lib/firestore.ts`**
- Quiz operations (save, get, subscribe)
- User score updates
- Dashboard data fetching

### **3. `src/lib/firebaseSessions.ts`**
- Session CRUD operations
- Join code generation
- Participant management
- Real-time session subscriptions

### **4. `src/lib/presence.ts`**
- Room presence tracking
- Real-time participant updates
- Video/audio state tracking

### **5. `src/lib/agora.ts`**
- Agora SDK client management
- Channel join/leave
- Video/audio track handling

---

## 🎯 **Complete Data Flow Example**

### **Scenario: User Creates Session & Others Join**

```
1. USER A creates session:
   → POST /sessions/new
   → createSession() → Firestore: sessions/{sessionId}
   → Join code generated: "ABC12345"
   → joinURL: "/join/ABC12345"
   → Redirect to /sessions/{sessionId}

2. USER A shares link:
   → Copy link: https://domain.com/join/ABC12345
   → Link shared with USER B

3. USER B clicks link:
   → GET /join/ABC12345
   → getSessionByJoinCode("ABC12345")
   → Session found: {sessionId, roomId}
   → addParticipantToSession()
   → Add to sessions/{sessionId}/participants/{userB}
   → Redirect to /rooms/{sessionId}/live

4. USER B enters video room:
   → VideoRoom component loads
   → Add presence: rooms/{sessionId}/participants/{userB}
   → Subscribe to presence updates
   → Display USER B in participant list

5. USER A sees update:
   → Session detail page subscribed to session
   → Participant count updates: 2/20
   → USER B appears in participant list

6. Both in video room:
   → Real-time presence updates
   → See each other in participant grid
   → Can toggle video/audio (if Agora configured)
```

---

## ✅ **Verification Checklist**

- [x] Firebase Auth connected
- [x] User documents created on registration
- [x] Sessions create/read/update working
- [x] Join code generation unique
- [x] Participant tracking in sessions
- [x] Room presence tracking
- [x] Real-time subscriptions active
- [x] Join flow redirects correctly
- [x] Video room connects to sessions
- [x] Agora integration (optional) works
- [x] All helper functions connected
- [x] Error handling in place

---

## 🚀 **How Everything Works Together**

1. **Auth** → User logs in → State stored in Zustand
2. **Sessions** → User creates → Stored in Firestore → Shareable link generated
3. **Join** → User clicks link → Added to participants → Redirects to room
4. **Presence** → User enters room → Presence tracked → Real-time updates
5. **Video** → If Agora configured → Video streaming → If not → Text mode
6. **Tracking** → All actions → Firestore → Real-time UI updates

**All components are connected and working together!** 🎉

