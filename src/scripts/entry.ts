import { qs } from './utils';
let initialized = false; // Track whether Three.js has been initialized

const initThreeJS = () => {
  if (!initialized) {
    initialized = true; // Mark as initialized to prevent multiple invocations

    // Store in localStorage that Three.js has been initialized
    localStorage.setItem('threejs_initialized', 'true');

    // get canvas
    const CANVAS_ID = 'scene';
    const canvasContainer = qs<HTMLDivElement>(`canvas#${CANVAS_ID}`);

    if (canvasContainer) {
      // Dynamically import TCanvas only when needed
      import('./scene')
        .then(() => {
          canvasContainer.style.opacity = '1';
        })
        .catch((error) => {
          console.error('Error loading TCanvas module:', error);
        });
    }
  }
};

// Check if Three.js has been initialized before (cached)
const isThreeJSCached = localStorage.getItem('threejs_initialized') === 'true';

if (isThreeJSCached) {
  // If cached, immediately initialize Three.js
  initThreeJS();
} else {
  // If not cached, wait for user input (scroll, click, mousemove, or touch)
  window.addEventListener('scroll', initThreeJS, { once: true });
  window.addEventListener('click', initThreeJS, { once: true });
  window.addEventListener('mousemove', initThreeJS, { once: true });
  window.addEventListener('touchstart', initThreeJS, { once: true });

  // Set a timeout to initialize Three.js if no interaction occurs after 5 seconds
  setTimeout(() => {
    initThreeJS();
  }, 5000);
}
