import GUI from 'lil-gui';
import {
  AmbientLight,
  BoxGeometry,
  GridHelper,
  LoadingManager,
  Mesh,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PointLight,
  PointLightHelper,
  Scene,
  WebGLRenderer,
} from 'three';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { BloomEffect, EffectComposer, EffectPass, RenderPass, KernelSize, BlendFunction } from 'postprocessing';
import { resizeRendererToDisplaySize } from './utils';

const MODE = import.meta.env.MODE;
const IS_DEV_MODE = MODE === 'development';
const GRID_SIZE = 300;
const GRID_DIVISIONS = 300;
const ANIMATION = { enabled: true, play: true };
const START_Y = 0.0;
const END_Y = -1.2;
const LERP_FACTOR = 0.1;
const CANVAS_ID = 'scene';
const COLORS = {
  streak: {
    light: 0xfeadcb,
    dark: 0x00ffff,
  },
  grid: {
    light: 0x91caf2,
    dark: 0x134c73,
  },
};

let targetY = START_Y;
let canvas: HTMLElement;
let renderer: WebGLRenderer;
let scene: Scene;
let loadingManager: LoadingManager;
let ambientLight: AmbientLight;
let pointLight: PointLight;
let camera: PerspectiveCamera;
let cameraControls: OrbitControls;
let dragControls: DragControls;
let gridHelper: GridHelper;
let pointLightHelper: PointLightHelper;
let stats: Stats;
let gui: GUI;
let lightSegments: Mesh[] = [];
let composer: EffectComposer;

// ===== 🪄 Tron light effect =====
lightSegments = [];
const segmentGeometry = new BoxGeometry(0.05, 0.05, 1);

function createSegmentMaterial() {
  const isDarkMode = document.documentElement.classList.contains('dark');
  return new MeshStandardMaterial({
    color: isDarkMode ? COLORS.streak.dark : COLORS.streak.light,
    emissive: isDarkMode ? COLORS.streak.dark : COLORS.streak.light,
    emissiveIntensity: 5.0,
    transparent: true,
    opacity: 1,
    metalness: 0,
    roughness: 0,
    toneMapped: false,
  });
}

const segmentMaterial = createSegmentMaterial();

function updateSegmentMaterials() {
  lightSegments.forEach((segment) => {
    const material = segment.material as MeshStandardMaterial;
    const isDarkMode = document.documentElement.classList.contains('dark');
    const color = isDarkMode ? COLORS.streak.dark : COLORS.streak.light;
    material.color.setHex(color);
    material.emissive.setHex(color);
  });
}

function createLightSegment() {
  const isHorizontal = Math.random() < 0.5;
  const position = Math.floor(Math.random() * GRID_DIVISIONS) - GRID_DIVISIONS / 2 + 0.5;
  const segment = new Mesh(segmentGeometry, segmentMaterial);

  if (isHorizontal) {
    segment.position.set(-GRID_SIZE / 2, -1.55, position);
    segment.rotation.y = Math.PI / 2;
  } else {
    segment.position.set(position, -1.55, -GRID_SIZE / 2);
  }

  scene.add(segment);
  lightSegments.push(segment);
}

function init() {
  {
    canvas = document.querySelector(`canvas#${CANVAS_ID}`)!;
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    scene = new Scene();
  }

  {
    loadingManager = new LoadingManager();
    loadingManager.onStart = () => {
      console.log('loading started');
    };
    loadingManager.onProgress = (url, loaded, total) => {
      console.log('loading in progress:');
      console.log(`${url} -> ${loaded} / ${total}`);
    };
    loadingManager.onLoad = () => {
      console.log('loaded!');
    };
    loadingManager.onError = () => {
      console.log('❌ error while loading');
    };
  }

  {
    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomEffect = new BloomEffect({
      blendFunction: BlendFunction.ADD,
      kernelSize: KernelSize.HUGE,
      luminanceThreshold: 0.1,
      luminanceSmoothing: 0.8,
      intensity: 5.0,
    });

    const bloomPass = new EffectPass(camera, bloomEffect);
    composer.addPass(bloomPass);
  }

  {
    ambientLight = new AmbientLight('white', 0.4);
    pointLight = new PointLight('white', 20, 100);
    pointLight.position.set(-2, 2, 2);
    pointLight.castShadow = true;
    pointLight.shadow.radius = 4;
    pointLight.shadow.camera.near = 0.5;
    pointLight.shadow.camera.far = 4000;
    pointLight.shadow.mapSize.width = 2048;
    pointLight.shadow.mapSize.height = 2048;
    scene.add(ambientLight);
    scene.add(pointLight);
  }

  {
    camera = new PerspectiveCamera(120, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(-1.3, 0.0, 0);
    camera.lookAt(0, 0, 0);
  }

  {
    cameraControls = new OrbitControls(camera, canvas);
    cameraControls.enableDamping = true;
    cameraControls.autoRotate = false;

    if (!IS_DEV_MODE) {
      cameraControls.enabled = false;
      cameraControls.enableZoom = false;
      cameraControls.enableRotate = false;
      cameraControls.enablePan = false;
    }
    cameraControls.update();

    dragControls = new DragControls([], camera, renderer.domElement);
    dragControls.addEventListener('hoveron', (event) => {
      if (!IS_DEV_MODE) return;
      const mesh = event.object as Mesh;
      const material = mesh.material as MeshStandardMaterial;
      material.emissive.set('orange');
    });
    dragControls.addEventListener('hoveroff', (event) => {
      if (!IS_DEV_MODE) return;
      const mesh = event.object as Mesh;
      const material = mesh.material as MeshStandardMaterial;
      material.emissive.set('black');
    });
    dragControls.addEventListener('dragstart', (event) => {
      if (!IS_DEV_MODE) return;
      const mesh = event.object as Mesh;
      const material = mesh.material as MeshStandardMaterial;
      cameraControls.enabled = false;
      ANIMATION.play = false;
      material.emissive.set('black');
      material.opacity = 0.7;
      material.needsUpdate = true;
    });
    dragControls.addEventListener('dragend', (event) => {
      if (!IS_DEV_MODE) return;
      cameraControls.enabled = true;
      ANIMATION.play = true;
      const mesh = event.object as Mesh;
      const material = mesh.material as MeshStandardMaterial;
      material.emissive.set('black');
      material.opacity = 1;
      material.needsUpdate = true;
    });
    dragControls.enabled = IS_DEV_MODE;
  }

  {
    pointLightHelper = new PointLightHelper(pointLight, undefined, 'orange');
    pointLightHelper.visible = false;
    scene.add(pointLightHelper);
  }

  function updateGridHelperColor() {
    const isDarkMode = document.documentElement.classList.contains('dark');
    const color1 = isDarkMode ? COLORS.grid.dark : COLORS.grid.light;
    const color2 = isDarkMode ? COLORS.grid.dark : COLORS.grid.light;

    if (gridHelper) {
      scene.remove(gridHelper);
      gridHelper.geometry.dispose();
      gridHelper.material.dispose();
    }

    gridHelper = new GridHelper(GRID_SIZE, GRID_DIVISIONS, color1, color2);
    gridHelper.position.y = -1.5;

    scene.add(gridHelper);
  }

  updateGridHelperColor();

  {
    const observer = new MutationObserver(() => {
      updateGridHelperColor();
      updateSegmentMaterials();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }

  if (MODE === 'development') {
    stats = new Stats();
    document.body.appendChild(stats.dom);
  }

  if (MODE === 'development') {
    gui = new GUI({ title: '🐞 Debug GUI', width: 300 });
    const controlsFolder = gui.addFolder('Controls');
    controlsFolder.add(dragControls, 'enabled').name('drag controls');

    const lightsFolder = gui.addFolder('Lights');
    lightsFolder.add(pointLight, 'visible').name('point light');
    lightsFolder.add(ambientLight, 'visible').name('ambient light');

    const cameraFolder = gui.addFolder('Camera');
    cameraFolder.add(cameraControls, 'autoRotate');
    cameraFolder.add(camera.position, 'x', -10, 10).name('Position X');
    cameraFolder.add(camera.position, 'y', -10, 10).name('Position Y');
    cameraFolder.add(camera.position, 'z', -10, 10).name('Position Z');

    const resetGui = () => {
      localStorage.removeItem('guiState');
      gui.reset();
    };
    gui.add({ resetGui }, 'resetGui').name('RESET');
    gui.close();
  }
}

function updateCameraPositionOnScroll() {
  const pageHeight = document.documentElement.scrollHeight;
  const windowHeight = window.innerHeight;
  const scrollableHeight = pageHeight - windowHeight;

  if (scrollableHeight > 0) {
    const scrollPosition = window.scrollY;
    const scrollProgress = Math.min(scrollPosition / scrollableHeight, 1);

    targetY = START_Y + (END_Y - START_Y) * scrollProgress;

    if (scrollPosition > 0) {
      camera.position.y += (targetY - camera.position.y) * LERP_FACTOR;
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  updateCameraPositionOnScroll();

  composer.render();

  if (IS_DEV_MODE) {
    stats.update();
  }

  if (ANIMATION.enabled && ANIMATION.play) {
    gridHelper.position.x += 0.005;
    if (gridHelper.position.x > 1) {
      gridHelper.position.x = 0;
    }

    lightSegments?.forEach((segment, index) => {
      if (segment.rotation.y === 0) {
        segment.position.z += 0.5;
        if (segment.position.z > GRID_SIZE / 2) {
          scene.remove(segment);
          lightSegments.splice(index, 1);
        }
      } else {
        segment.position.x += 0.5;
        if (segment.position.x > GRID_SIZE / 2) {
          scene.remove(segment);
          lightSegments.splice(index, 1);
        }
      }
    });

    if (Math.random() < 0.05) {
      createLightSegment();
    }
  }

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  cameraControls.update();

  renderer.render(scene, camera);
}

init();
animate();
