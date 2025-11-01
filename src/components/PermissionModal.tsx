'use client';

import { useState } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  X,
  AlertCircle
} from 'lucide-react';
import toast from '@/lib/toast';

interface PermissionModalProps {
  isOpen: boolean;
  onAllow: () => void;
  onCancel: () => void;
}

export default function PermissionModal({ isOpen, onAllow, onCancel }: PermissionModalProps) {
  const [isRequesting, setIsRequesting] = useState(false);

  if (!isOpen) return null;

  const handleAllow = async () => {
    setIsRequesting(true);
    
    try {
      // Request camera and microphone permissions
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      
      // Permissions granted
      setIsRequesting(false);
      onAllow();
    } catch (error: any) {
      setIsRequesting(false);
      
      // Handle different error types
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        toast.error('Camera and microphone access denied. Please enable permissions in your browser settings.');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        toast.error('No camera or microphone found. Please connect a device.');
      } else {
        toast.error('Failed to access camera and microphone. Please check your device settings.');
      }
      
      // Don't proceed if permissions denied
      console.error('Permission error:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Camera & Microphone Access</h2>
            <button
              onClick={onCancel}
              className="text-white/80 hover:text-white transition-colors"
              disabled={isRequesting}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start space-x-4 mb-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Video className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Allow Camera & Microphone
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                To join the study room, we need access to your camera and microphone for video conferencing.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Your privacy is protected:</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-700">
                      <li>Video and audio are only shared in the room</li>
                      <li>You can turn off camera/mic anytime</li>
                      <li>No recordings without your consent</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Permissions Info */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center space-x-3 text-sm">
              <Video className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Camera - Required for video sharing</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Mic className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Microphone - Required for audio communication</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onCancel}
              disabled={isRequesting}
              className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleAllow}
              disabled={isRequesting}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isRequesting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Requesting...</span>
                </>
              ) : (
                <>
                  <Video className="w-4 h-4" />
                  <span>Allow & Join</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

