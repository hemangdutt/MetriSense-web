import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Intercept false-positive errors thrown into the window by third-party browser extensions
if (typeof window !== 'undefined') {
  const isExtensionLockerError = (msg: unknown) =>
    typeof msg === 'string' && msg.includes('Breaking Browser Locker Behavior');

  window.addEventListener(
    'error',
    (event) => {
      if (
        isExtensionLockerError(event.message) ||
        isExtensionLockerError(event.error?.message)
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return true;
      }
    },
    true
  );

  window.addEventListener(
    'unhandledrejection',
    (event) => {
      if (
        isExtensionLockerError(event.reason?.message) ||
        isExtensionLockerError(event.reason)
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

