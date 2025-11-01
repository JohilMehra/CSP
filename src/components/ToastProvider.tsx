'use client';

// Safe Toaster component that won't crash if react-hot-toast isn't installed
// Simply returns null - toast notifications will use console fallback from @/lib/toast

export default function ToastProvider() {
  // Always return null if package isn't installed
  // The toast wrapper in @/lib/toast handles the fallback
  return null;
}

