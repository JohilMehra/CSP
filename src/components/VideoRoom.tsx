'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  getClient,
  joinChannel,
  leaveChannel,
  getLocalTracks,
} from '../lib/agora';
import type {
  IRemoteVideoTrack,
  IRemoteAudioTrack,
} from 'agora-rtc-sdk-ng';

const VideoRoom: React.FC<{ channel?: string }> = ({ channel }) => {
  // ✅ Load from environment safely with fallback values
  const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID || '';
  const token = process.env.NEXT_PUBLIC_AGORA_TEMP_TOKEN || null;
  const safeChannel = channel || 'study-room-1'; // fallback if undefined

  const localContainerRef = useRef<HTMLDivElement>(null);
  const [remoteUsers, setRemoteUsers] = useState<any[]>([]);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    const client = getClient();

    // Remote users’ tracks
    const handleUserPublished = async (user: any, mediaType: 'video' | 'audio') => {
      try {
        await client.subscribe(user, mediaType);
        console.log('[Agora] Subscribed to:', user.uid, mediaType);

        if (mediaType === 'video') {
          const remoteVideoTrack = user.videoTrack as IRemoteVideoTrack;
          const containerId = `remote-${user.uid}`;
          let container = document.getElementById(containerId);
          if (!container) {
            container = document.createElement('div');
            container.id = containerId;
            container.style.width = '320px';
            container.style.height = '240px';
            container.style.border = '1px solid gray';
            document.getElementById('remote-container')?.appendChild(container);
          }
          remoteVideoTrack.play(containerId);
        }

        if (mediaType === 'audio') {
          const remoteAudioTrack = user.audioTrack as IRemoteAudioTrack;
          remoteAudioTrack.play();
        }

        setRemoteUsers((prev) => [
          ...prev.filter((u) => u.uid !== user.uid),
          user,
        ]);
      } catch (err) {
        console.error('[Agora] subscribe error:', err);
      }
    };

    const handleUserUnpublished = (user: any) => {
      document.getElementById(`remote-${user.uid}`)?.remove();
      setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
    };

    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', handleUserUnpublished);

    return () => {
      client.off('user-published', handleUserPublished);
      client.off('user-unpublished', handleUserUnpublished);
    };
  }, []);

  // ✅ Safe join handler with validation
  const handleJoin = async () => {
    if (!appId) {
      alert('Agora App ID is missing! Please check your .env.local file.');
      console.error('[Agora] Missing App ID. Stopping join process.');
      return;
    }

    if (!safeChannel) {
      alert('Channel name missing!');
      console.error('[Agora] Channel name is missing.');
      return;
    }

    try {
      console.log('[Agora] Joining channel:', safeChannel, 'with App ID:', appId);
      await joinChannel({ appId, channel: safeChannel, token });
      const { localVideoTrack } = getLocalTracks();
      if (localVideoTrack && localContainerRef.current) {
        localVideoTrack.play(localContainerRef.current);
      }
      setIsJoined(true);
      console.log('[Agora] Successfully joined channel:', safeChannel);
    } catch (err: any) {
      console.error('[Agora] Join failed:', err);
      alert(
        'Failed to join Agora channel.\n' +
          'Please verify App ID, mode (Testing), and .env.local file.'
      );
    }
  };

  const handleLeave = async () => {
    try {
      await leaveChannel();
      if (localContainerRef.current) localContainerRef.current.innerHTML = '';
      const remoteDiv = document.getElementById('remote-container');
      if (remoteDiv) remoteDiv.innerHTML = '';
      setRemoteUsers([]);
      setIsJoined(false);
      console.log('[Agora] Left channel successfully');
    } catch (err) {
      console.error('[Agora] Leave error:', err);
    }
  };

  return (
    <div className="p-4 space-y-4 text-center">
      <h2 className="text-2xl font-bold mb-2">Agora Video Room</h2>
      <p className="text-gray-500 text-sm mb-4">
        Channel: <b>{safeChannel}</b>
      </p>

      <div className="flex justify-center gap-4 mb-4">
        {!isJoined ? (
          <button
            onClick={handleJoin}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Join
          </button>
        ) : (
          <button
            onClick={handleLeave}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Leave
          </button>
        )}
      </div>

      <div className="flex justify-center gap-6 flex-wrap">
        <div>
          <h3>Local</h3>
          <div
            ref={localContainerRef}
            id="local-container"
            style={{
              width: 320,
              height: 240,
              border: '2px solid #333',
              background: '#000',
            }}
          />
        </div>

        <div>
          <h3>Remote</h3>
          <div
            id="remote-container"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              justifyContent: 'center',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoRoom;
