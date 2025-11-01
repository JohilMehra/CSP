// Safe toast wrapper that works with or without react-hot-toast installed
// This prevents crashes while allowing the package to be installed later

let toastModule: any = null;

try {
  // Try to import react-hot-toast if available
  toastModule = require('react-hot-toast');
} catch (e) {
  // Package not installed yet - use console fallback
  console.warn('react-hot-toast not installed - using console fallback');
}

const toastFallback = {
  success: (message: string) => {
    console.log('✅', message);
    if (typeof window !== 'undefined') {
      // Show a simple browser notification if available
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Success', { body: message });
      }
    }
  },
  error: (message: string) => {
    console.error('❌', message);
    if (typeof window !== 'undefined') {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Error', { body: message });
      }
    }
  },
  loading: (message: string) => {
    console.log('⏳', message);
  },
  dismiss: () => {},
};

// Export the real toast if available, otherwise fallback
export default toastModule?.default || toastFallback;

