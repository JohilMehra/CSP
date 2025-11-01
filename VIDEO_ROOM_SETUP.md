# 🎥 Live Study Video Room Setup Guide

This guide explains how to set up the Agora Web SDK for live video streaming in study rooms.

## Prerequisites

1. **Agora Account**: Sign up at [https://www.agora.io/](https://www.agora.io/)
2. **Firebase Project**: Already configured in your project

## Setup Steps

### 1. Install Dependencies

```bash
cd csp-portal
npm install
```

This will install `agora-rtc-sdk-ng` along with other dependencies.

### 2. Get Agora Credentials

1. Log in to [Agora Console](https://console.agora.io/)
2. Create a new project or select an existing one
3. Navigate to **Project Management** → **Project List**
4. Copy your **App ID**
5. (Optional) Generate a **Temporary Token** for testing:
   - Go to **Project Management** → **Edit** → **Generate Temporary Token**
   - Copy the token (valid for 24 hours)

### 3. Configure Environment Variables

Add the following to your `.env.local` file:

```env
# Agora Configuration
NEXT_PUBLIC_AGORA_APP_ID=your-agora-app-id
NEXT_PUBLIC_AGORA_TOKEN=your-temporary-token-or-leave-empty
```

**Note**: 
- `NEXT_PUBLIC_AGORA_TOKEN` is optional for development. For production, you'll need to generate tokens server-side.
- For production, you should create a backend API endpoint to generate tokens securely.

### 4. Firebase Firestore Rules

Make sure your Firestore security rules allow read/write access to the `rooms` collection:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write room presence
    match /rooms/{roomId}/participants/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null; // Users can see other participants
    }
    
    // Add other rules as needed
  }
}
```

### 5. Start the Development Server

```bash
npm run dev
```

## Features

### ✅ Implemented Features

- ✅ Join live study room via `/rooms/[roomId]/live`
- ✅ Turn camera ON/OFF
- ✅ Turn microphone ON/OFF
- ✅ See other participants' video tiles in responsive grid
- ✅ Leave room
- ✅ Show participant names under video tiles
- ✅ Firestore presence tracking
- ✅ Remove user on closing tab/leaving room
- ✅ Real-time participant updates
- ✅ Responsive video grid layout

## Usage

### Joining a Room

1. Navigate to `/rooms` to see available rooms
2. Click on a room card to view details
3. Click **"Join Live Room"** button
4. Grant camera/microphone permissions when prompted
5. You'll join the live video room

### Controls

- **Camera Toggle**: Click the video icon to turn camera on/off
- **Microphone Toggle**: Click the mic icon to mute/unmute
- **Leave Room**: Click the phone icon to exit the room

### Video Grid

The video grid automatically adjusts based on the number of participants:
- 1 participant: 1 column
- 2 participants: 2 columns
- 3-4 participants: 2 columns
- 5-9 participants: 3 columns
- 10+ participants: 4 columns

## Production Considerations

### Token Generation

For production, you should generate Agora tokens server-side for security. Example:

1. Create an API route: `/api/agora/token`
2. Use Agora's server SDK to generate tokens
3. Return tokens to the client securely

### Security

- Never expose your Agora App Certificate in the client
- Always generate tokens server-side
- Implement proper authentication checks
- Set up Firestore security rules correctly

### Performance

- Agora recommends limiting participants to 17 per channel for optimal performance
- Consider implementing speaker view for large groups
- Monitor network bandwidth usage

## Troubleshooting

### "Missing user or Agora configuration" error

- Check that `NEXT_PUBLIC_AGORA_APP_ID` is set in `.env.local`
- Restart the dev server after adding environment variables
- Make sure the user is logged in

### Camera/Microphone not working

- Check browser permissions
- Ensure HTTPS in production (required for media devices)
- Test in a modern browser (Chrome, Firefox, Safari, Edge)

### Participants not showing

- Check Firestore rules allow read access
- Verify Agora credentials are correct
- Check browser console for errors

### Token Issues

- For development, you can leave `NEXT_PUBLIC_AGORA_TOKEN` empty or use a temporary token
- For production, implement server-side token generation
- Tokens expire after 24 hours (temporary tokens)

## API Reference

### Components

- `VideoRoom`: Main component for live video rooms
- Location: `src/components/VideoRoom.tsx`

### Utilities

- `src/lib/agora.ts`: Agora SDK helper functions
- `src/lib/presence.ts`: Firestore presence tracking functions

## Support

For Agora-specific issues, refer to:
- [Agora Documentation](https://docs.agora.io/)
- [Agora Web SDK](https://docs.agora.io/en/video-calling/get-started/get-started-sdk?platform=web)

