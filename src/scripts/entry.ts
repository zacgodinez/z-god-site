import { qs } from './utils';
import { TCanvas } from './webgl/TCanvas';

let initialized = false; // Track whether Three.js has been initialized

const initThreeJS = () => {
  if (!initialized) {
    initialized = true; // Mark as initialized to prevent multiple invocations

    const canvasContainer = qs<HTMLDivElement>('.canvas-container');
    if (canvasContainer) {
      const canvas = new TCanvas(canvasContainer);

      window.addEventListener('beforeunload', () => {
        canvas.dispose();
      });
    }
  }
};

// Wait for the window to load before setting up event listeners and timeout
window.addEventListener('load', () => {
  // Wait for user input (scroll, click, mousemove, or touch) to initialize Three.js
  window.addEventListener('scroll', initThreeJS, { once: true });
  window.addEventListener('click', initThreeJS, { once: true });
  window.addEventListener('mousemove', initThreeJS, { once: true });
  window.addEventListener('touchstart', initThreeJS, { once: true });

  // Set a timeout to initialize Three.js if no interaction occurs after 3 seconds
  setTimeout(() => {
    initThreeJS();
  }, 1000);
});
