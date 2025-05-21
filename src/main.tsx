
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './providers/ThemeProvider';

// Error boundary for debugging
const handleError = (error: Error) => {
  console.error("React Error:", error);
};

window.addEventListener('error', (event) => {
  console.error("Global Error:", event.error);
});

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="mpesa-theme">
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
