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

// Wait for user input (scroll, click, or mousemove) to initialize Three.js
window.addEventListener('scroll', initThreeJS, { once: true });
window.addEventListener('click', initThreeJS, { once: true });
window.addEventListener('mousemove', initThreeJS, { once: true });
