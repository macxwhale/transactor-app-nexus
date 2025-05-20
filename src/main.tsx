
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

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system" storageKey="mpesa-theme">
    <App />
  </ThemeProvider>
);
