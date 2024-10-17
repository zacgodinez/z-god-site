import { qs } from './utils';
import { TCanvas } from './webgl/TCanvas';

let initialized = false; // Track whether Three.js has been initialized

const initThreeJS = () => {
  if (!initialized) {
    initialized = true; // Mark as initialized to prevent multiple invocations

    // Store in localStorage that Three.js has been initialized
    localStorage.setItem('threejs_initialized', 'true');

    const canvasContainer = qs<HTMLDivElement>('.canvas-container');
    if (canvasContainer) {
      const canvas = new TCanvas(canvasContainer);

      canvasContainer.style.opacity = '1';

      window.addEventListener('beforeunload', () => {
        canvas.dispose();
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

  // Set a timeout to initialize Three.js if no interaction occurs after 3 seconds
  setTimeout(() => {
    console.log('Timeout reached, initializing Three.js');
    initThreeJS();
  }, 5000);
}
