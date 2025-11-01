# 🚀 Backend Quick Reference

## **All Backend Systems Connected & Working**

---

## 📊 **Firestore Collections**

| Collection | Purpose | Key Fields |
|------------|---------|------------|
| `users/{userId}` | User profiles | name, email, totalScore, quizzesCompleted |
| `sessions/{sessionId}` | Study sessions | title, joinCode, joinURL, participants[], roomId |
| `sessions/{sessionId}/participants/{userId}` | Session participants | userId, userName, joinedAt |
| `rooms/{roomId}/participants/{userId}` | Room presence | userId, userName, isVideoOn, isAudioOn |
| `quizzes/{quizId}` | AI-generated quizzes | title, questions[], attempts[] |

---

## 🔄 **Data Flow Connections**

```
CREATE SESSION
  ↓
Firestore: sessions/{id}
  ↓
JOIN CODE: /join/{code}
  ↓
USER JOINS
  ↓
Add to: sessions/{id}/participants/{userId}
  ↓
REDIRECT: /rooms/{id}/live
  ↓
ADD PRESENCE: rooms/{id}/participants/{userId}
  ↓
REAL-TIME UPDATES
  ↓
All users see updates instantly
```

---

## 📁 **Key Files & Their Connections**

### **Session Management**
- `src/lib/firebaseSessions.ts` → All session operations
- `src/app/sessions/new/page.tsx` → Creates sessions
- `src/app/sessions/[id]/page.tsx` → Shows session details
- `src/app/join/[joinCode]/page.tsx` → Handles join flow

### **Video Rooms**
- `src/lib/presence.ts` → Presence tracking
- `src/lib/agora.ts` → Video streaming (optional)
- `src/components/VideoRoom.tsx` → Room UI

### **Core Backend**
- `src/lib/firebase.ts` → Firebase initialization
- `src/lib/firestore.ts` → General Firestore ops
- `src/lib/backendService.ts` → Unified service layer

---

## ✅ **Everything is Connected!**

- ✅ Auth → Firestore users
- ✅ Sessions → Join codes
- ✅ Join → Participants
- ✅ Sessions → Video rooms
- ✅ Rooms → Presence tracking
- ✅ Real-time updates → All components

**Backend is fully operational!** 🎉

