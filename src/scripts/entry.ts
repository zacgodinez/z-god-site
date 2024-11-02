import createScene from './create-scene';

type SceneManager = {
  init: () => void;
  cleanup: () => void;
};

const LOCAL_STORAGE_THREE_JS_INIT = 'threejs_initialized';
const CANVAS_ID = 'scene';
const MODE = import.meta.env.MODE;
const isDevelopment = MODE === 'development';
const isThreeJSCached = localStorage.getItem(LOCAL_STORAGE_THREE_JS_INIT) === 'true';
let isInitialized = false;
let sceneManager: Record<string, SceneManager> = {};

const initThreeJS = () => {
  if (!isInitialized) {
    isInitialized = true;

    localStorage.setItem(LOCAL_STORAGE_THREE_JS_INIT, 'true');

    if (!sceneManager[CANVAS_ID]) {
      sceneManager[CANVAS_ID] = createScene(CANVAS_ID, isDevelopment);
      sceneManager[CANVAS_ID].init();
    }
  }
};

if (isThreeJSCached) {
  initThreeJS();
} else {
  window.addEventListener('scroll', initThreeJS, { once: true });
  window.addEventListener('click', initThreeJS, { once: true });
  window.addEventListener('mousemove', initThreeJS, { once: true });
  window.addEventListener('touchstart', initThreeJS, { once: true });

  setTimeout(() => {
    initThreeJS();
  }, 3000);
}

document.addEventListener('astro:before-swap', () => {
  Object.values(sceneManager).forEach((scene) => scene.cleanup());
  sceneManager = {};
});

document.addEventListener('astro:page-load', () => {
  if (!sceneManager[CANVAS_ID] && isInitialized) {
    sceneManager[CANVAS_ID] = createScene(CANVAS_ID, isDevelopment);
    sceneManager[CANVAS_ID].init();
  }
});
