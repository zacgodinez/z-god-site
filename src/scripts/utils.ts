import { WebGLRenderer } from 'three';

export function resizeRendererToDisplaySize(renderer: WebGLRenderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

export function resolvePath(path: string) {
  const p = path.startsWith('/') ? path.substring(1) : path;
  return import.meta.env.BASE_URL + p;
}

export function qs<T extends HTMLElement>(selectors: string) {
  return document.querySelector<T>(selectors)!;
}

export function qsAll<T extends HTMLElement>(selectors: string) {
  return document.querySelectorAll<T>(selectors);
}
