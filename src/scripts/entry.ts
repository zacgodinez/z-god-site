import { qs } from './utils';

let isInitialized = false;

const LOCAL_STORAGE_THREE_JS_INIT = 'threejs_initialized';
const CANVAS_ID = 'scene';

const initThreeJS = () => {
  if (!isInitialized) {
    isInitialized = true;

    localStorage.setItem(LOCAL_STORAGE_THREE_JS_INIT, 'true');
    const canvasContainer = qs<HTMLDivElement>(`canvas#${CANVAS_ID}`);

    if (canvasContainer) {
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

const isThreeJSCached = localStorage.getItem(LOCAL_STORAGE_THREE_JS_INIT) === 'true';

if (isThreeJSCached) {
  initThreeJS();
} else {
  window.addEventListener('scroll', initThreeJS, { once: true });
  window.addEventListener('click', initThreeJS, { once: true });
  window.addEventListener('mousemove', initThreeJS, { once: true });
  window.addEventListener('touchstart', initThreeJS, { once: true });

  setTimeout(() => {
    initThreeJS();
  }, 5000);
}
