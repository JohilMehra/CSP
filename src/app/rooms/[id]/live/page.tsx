'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import VideoRoom from '@/components/VideoRoom';

export default function LiveRoomPage() {
  const params = useParams();
  const channelName = params.id as string; // 👈 extract from /rooms/[id]/live

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Live Room: {channelName}</h1>
      <VideoRoom channel={channelName} /> {/* ✅ pass it here */}
    </main>
  );
}
