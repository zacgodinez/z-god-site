import initAssetPreload from './preload-assets';
import createScene from './create-scene';

type SceneManager = {
  init: () => void;
  cleanup: () => void;
};

const LOCAL_STORAGE_INIT_TIMEOUT = 3000;
const LOCAL_STORAGE_THREE_JS_INIT = 'threejs_initialized';
const CANVAS_ID = 'scene';
const MODE = import.meta.env.MODE;
const isDevelopment = MODE === 'development';
const isThreeJSCached = localStorage.getItem(LOCAL_STORAGE_THREE_JS_INIT) === 'true';
let isInitialized = false;
let sceneManager: Record<string, SceneManager> = {};

const preloader = initAssetPreload();

const initializeScene = () => {
  if (!sceneManager[CANVAS_ID]) {
    sceneManager[CANVAS_ID] = createScene(CANVAS_ID, isDevelopment);
    sceneManager[CANVAS_ID].init();
  }
};

const initThreeJS = () => {
  if (!isInitialized) {
    isInitialized = true;

    localStorage.setItem(LOCAL_STORAGE_THREE_JS_INIT, 'true');

    initializeScene();
  }
};

const init = () => {
  initThreeJS();
};

if (isThreeJSCached) {
  init();
} else {
  window.addEventListener('scroll', init, { once: true });
  window.addEventListener('click', init, { once: true });
  window.addEventListener('mousemove', init, { once: true });
  window.addEventListener('touchstart', init, { once: true });

  setTimeout(() => {
    init();
  }, LOCAL_STORAGE_INIT_TIMEOUT);

  preloader.init().then((results) => {
    console.log('All assets preloaded:', results);
  });
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
