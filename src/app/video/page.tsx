'use client';

import React from 'react';
import VideoRoom from '@/components/VideoRoom';

export default function VideoPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">StudySync Video Room</h1>
      <p className="mb-4 text-gray-300">
        This is your real-time video chat room for collaboration.
      </p>
      <VideoRoom channel="study-room-1" />
    </main>
  );
}
