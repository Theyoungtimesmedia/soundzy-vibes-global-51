import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add error handling for Safari compatibility
try {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  
  createRoot(rootElement).render(<App />);
} catch (error) {
  console.error("Failed to initialize app:", error);
  
  // Fallback UI for critical errors
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #0d0d0d; color: #daa520; font-family: Arial, sans-serif; padding: 20px; text-align: center;">
        <div>
          <h1 style="font-size: 32px; margin-bottom: 16px;">Soundzy World Global</h1>
          <p style="font-size: 18px; margin-bottom: 24px; color: #888;">We're experiencing technical difficulties. Please try:</p>
          <ul style="list-style: none; padding: 0; margin-bottom: 24px;">
            <li style="margin: 8px 0;">• Clear your browser cache</li>
            <li style="margin: 8px 0;">• Refresh the page</li>
            <li style="margin: 8px 0;">• Try a different browser</li>
          </ul>
          <p style="margin-top: 24px;">
            <a href="https://wa.me/2348166687167" style="display: inline-block; background: #daa520; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Contact Us on WhatsApp</a>
          </p>
        </div>
      </div>
    `;
  }
}
