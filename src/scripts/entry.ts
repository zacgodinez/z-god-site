import { qs } from './utils';

window.addEventListener('load', async () => {
  const { TCanvas } = await import('./webgl/TCanvas');
  const canvasContainer = qs<HTMLDivElement>('.canvas-container');

  if (canvasContainer) {
    const canvas = new TCanvas(canvasContainer);

    window.addEventListener('beforeunload', () => {
      canvas.dispose();
    });
  }
});
