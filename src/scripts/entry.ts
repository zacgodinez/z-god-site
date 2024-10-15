import { qs } from './utils';
import { TCanvas } from './webgl/TCanvas';

const initThreeJS = () => {
  const canvasContainer = qs<HTMLDivElement>('.canvas-container');

  if (canvasContainer) {
    const canvas = new TCanvas(canvasContainer);

    window.addEventListener('beforeunload', () => {
      canvas.dispose();
    });
  }
};

// Use requestIdleCallback to initialize Three.js when the browser is idle
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    initThreeJS();
  });
} else {
  // Fallback if requestIdleCallback is not supported
  setTimeout(() => {
    initThreeJS();
  }, 2000); // Load after 2 seconds if not supported
}
