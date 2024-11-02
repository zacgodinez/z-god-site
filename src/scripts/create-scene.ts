import * as THREE from 'three';
import GUI from 'lil-gui';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { BloomEffect, EffectComposer, EffectPass, RenderPass, KernelSize, BlendFunction } from 'postprocessing';
import { resizeRendererToDisplaySize } from './utils';

const GRID_SIZE = 300;
const GRID_DIVISIONS = 300;
const START_Y = 0.0;
const END_Y = -1.2;
const LERP_FACTOR = 0.1;

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

type SceneState = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer | null;
  composer: EffectComposer | null;
  ambientLight: THREE.AmbientLight;
  pointLight: THREE.PointLight;
  gridHelper: THREE.GridHelper | null;
  lightSegments: THREE.Mesh[];
  cameraControls: OrbitControls | null;
  dragControls: DragControls | null;
  stats: Stats | null;
  gui: GUI | null;
  animationEnabled: boolean;
  animationPlaying: boolean;
  targetY: number;
};

const createScene = (canvasId: string, isDevelopment: boolean = false) => {
  const state: SceneState = {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(),
    renderer: null,
    composer: null,
    ambientLight: new THREE.AmbientLight(),
    pointLight: new THREE.PointLight(),
    gridHelper: null,
    lightSegments: [],
    cameraControls: null,
    dragControls: null,
    stats: null,
    gui: null,
    animationEnabled: true,
    animationPlaying: true,
    targetY: START_Y,
  };

  const getBloomIntensity = (isDarkMode: boolean): number => {
    return isDarkMode ? 5.0 : 2.0;
  };

  const getBloomLuminanceThreshold = (isDarkMode: boolean): number => {
    return isDarkMode ? 0.1 : 0.6;
  };

  const createSegmentMaterial = () => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    return new THREE.MeshStandardMaterial({
      color: isDarkMode ? COLORS.streak.dark : COLORS.streak.light,
      emissive: isDarkMode ? COLORS.streak.dark : COLORS.streak.light,
      emissiveIntensity: 5.0,
      transparent: true,
      opacity: 1,
      metalness: 0,
      roughness: 0,
      toneMapped: false,
    });
  };

  const updateSegmentMaterials = () => {
    state.lightSegments.forEach((segment) => {
      const material = segment.material as THREE.MeshStandardMaterial;
      const isDarkMode = document.documentElement.classList.contains('dark');
      const color = isDarkMode ? COLORS.streak.dark : COLORS.streak.light;
      material.color.setHex(color);
      material.emissive.setHex(color);
    });
  };

  const createLightSegment = () => {
    const segmentGeometry = new THREE.BoxGeometry(0.05, 0.05, 1);
    const segmentMaterial = createSegmentMaterial();
    const isHorizontal = Math.random() < 0.5;
    const position = Math.floor(Math.random() * GRID_DIVISIONS) - GRID_DIVISIONS / 2 + 0.5;
    const segment = new THREE.Mesh(segmentGeometry, segmentMaterial);

    if (isHorizontal) {
      segment.position.set(-GRID_SIZE / 2, -1.55, position);
      segment.rotation.y = Math.PI / 2;
    } else {
      segment.position.set(position, -1.55, -GRID_SIZE / 2);
    }

    state.scene.add(segment);
    state.lightSegments.push(segment);
  };

  const initRenderer = () => {
    const canvas = document.querySelector(`canvas#${canvasId}`);
    if (!canvas) return null;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });

    // Set pixel ratio and size properly
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);

    // Match canvas size to display size
    const { clientWidth, clientHeight } = canvas;
    renderer.setSize(clientWidth, clientHeight, false);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    return renderer;
  };

  const initComposer = () => {
    if (!state.renderer || !state.camera) return null;

    const composer = new EffectComposer(state.renderer);
    const renderPass = new RenderPass(state.scene, state.camera);
    composer.addPass(renderPass);

    const isDarkMode = document.documentElement.classList.contains('dark');

    const bloomEffect = new BloomEffect({
      blendFunction: BlendFunction.ADD,
      kernelSize: KernelSize.HUGE,
      luminanceThreshold: getBloomLuminanceThreshold(isDarkMode),
      luminanceSmoothing: 0.8,
      intensity: getBloomIntensity(isDarkMode),
    });

    const bloomPass = new EffectPass(state.camera, bloomEffect);
    composer.addPass(bloomPass);
    return composer;
  };

  const setupLights = () => {
    state.ambientLight = new THREE.AmbientLight('white', 0.4);
    state.pointLight = new THREE.PointLight('white', 20, 100);
    state.pointLight.position.set(-2, 2, 2);
    state.pointLight.castShadow = true;
    state.pointLight.shadow.radius = 4;
    state.pointLight.shadow.camera.near = 0.5;
    state.pointLight.shadow.camera.far = 4000;
    state.pointLight.shadow.mapSize.width = 2048;
    state.pointLight.shadow.mapSize.height = 2048;

    state.scene.add(state.ambientLight);
    state.scene.add(state.pointLight);
  };

  const setupCamera = () => {
    if (!state.renderer) return;
    const canvas = state.renderer.domElement;
    state.camera = new THREE.PerspectiveCamera(120, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    state.camera.position.set(-1.3, 0.0, 0);
    state.camera.lookAt(0, 0, 0);
  };

  const setupControls = () => {
    if (!state.renderer || !state.camera) return;
    const canvas = state.renderer.domElement;

    state.cameraControls = new OrbitControls(state.camera, canvas);
    state.cameraControls.enableDamping = true;
    state.cameraControls.autoRotate = false;

    if (!isDevelopment) {
      state.cameraControls.enabled = false;
      state.cameraControls.enableZoom = false;
      state.cameraControls.enableRotate = false;
      state.cameraControls.enablePan = false;
    }

    setupDragControls();
  };

  const setupDragControls = () => {
    if (!state.camera || !state.renderer) return;

    state.dragControls = new DragControls([], state.camera, state.renderer.domElement);
    state.dragControls.addEventListener('hoveron', handleDragHoverOn);
    state.dragControls.addEventListener('hoveroff', handleDragHoverOff);
    state.dragControls.addEventListener('dragstart', handleDragStart);
    state.dragControls.addEventListener('dragend', handleDragEnd);
    state.dragControls.enabled = isDevelopment;
  };

  const handleDragHoverOn = (event: { object: THREE.Object3D }) => {
    if (!isDevelopment) return;
    const mesh = event.object as THREE.Mesh;
    const material = mesh.material as THREE.MeshStandardMaterial;
    material.emissive.set('orange');
  };

  const handleDragHoverOff = (event: { object: THREE.Object3D }) => {
    if (!isDevelopment) return;
    const mesh = event.object as THREE.Mesh;
    const material = mesh.material as THREE.MeshStandardMaterial;
    material.emissive.set('black');
  };

  const handleDragStart = (event: { object: THREE.Object3D }) => {
    if (!isDevelopment || !state.cameraControls) return;
    const mesh = event.object as THREE.Mesh;
    const material = mesh.material as THREE.MeshStandardMaterial;
    state.cameraControls.enabled = false;
    state.animationPlaying = false;
    material.emissive.set('black');
    material.opacity = 0.7;
    material.needsUpdate = true;
  };

  const handleDragEnd = (event: { object: THREE.Object3D }) => {
    if (!isDevelopment || !state.cameraControls) return;
    state.cameraControls.enabled = true;
    state.animationPlaying = true;
    const mesh = event.object as THREE.Mesh;
    const material = mesh.material as THREE.MeshStandardMaterial;
    material.emissive.set('black');
    material.opacity = 1;
    material.needsUpdate = true;
  };

  const updateGridHelper = () => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    const color1 = isDarkMode ? COLORS.grid.dark : COLORS.grid.light;
    const color2 = isDarkMode ? COLORS.grid.dark : COLORS.grid.light;

    if (state.gridHelper) {
      state.scene.remove(state.gridHelper);
      state.gridHelper.geometry.dispose();
      (state.gridHelper.material as THREE.Material).dispose();
    }

    state.gridHelper = new THREE.GridHelper(GRID_SIZE, GRID_DIVISIONS, color1, color2);
    state.gridHelper.position.y = -1.5;
    state.scene.add(state.gridHelper);
  };

  const setupDarkModeObserver = () => {
    const observer = new MutationObserver(() => {
      updateGridHelper();
      updateSegmentMaterials();

      const bloomPass = state.composer?.passes.find(
        (pass) => pass instanceof EffectPass && pass.effects.some((effect) => effect instanceof BloomEffect)
      ) as EffectPass;

      const bloomEffect = bloomPass?.effects.find((effect) => effect instanceof BloomEffect) as BloomEffect;

      if (bloomEffect) {
        const isDarkMode = document.documentElement.classList.contains('dark');

        bloomEffect.intensity = getBloomIntensity(isDarkMode);
        bloomEffect.luminanceThreshold = getBloomLuminanceThreshold(isDarkMode);
        bloomEffect.updateMaterial = true;
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
  };

  const setupDebugGUI = () => {
    if (!isDevelopment || !state.dragControls || !state.cameraControls || !state.camera) return;

    state.gui = new GUI({ title: '🐞 Debug GUI', width: 300 });
    const controlsFolder = state.gui.addFolder('Controls');
    controlsFolder.add(state.dragControls, 'enabled').name('drag controls');

    const lightsFolder = state.gui.addFolder('Lights');
    lightsFolder.add(state.pointLight, 'visible').name('point light');
    lightsFolder.add(state.ambientLight, 'visible').name('ambient light');

    const cameraFolder = state.gui.addFolder('Camera');
    cameraFolder.add(state.cameraControls, 'autoRotate');
    cameraFolder.add(state.camera.position, 'x', -10, 10).name('Position X');
    cameraFolder.add(state.camera.position, 'y', -10, 10).name('Position Y');
    cameraFolder.add(state.camera.position, 'z', -10, 10).name('Position Z');

    const resetGui = () => {
      localStorage.removeItem('guiState');
      state.gui?.reset();
    };
    state.gui.add({ resetGui }, 'resetGui').name('RESET');
    state.gui.close();
  };

  const updateCameraPositionOnScroll = () => {
    const pageHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollableHeight = pageHeight - windowHeight;

    if (scrollableHeight > 0) {
      const scrollPosition = window.scrollY;
      const scrollProgress = Math.min(scrollPosition / scrollableHeight, 1);
      state.targetY = START_Y + (END_Y - START_Y) * scrollProgress;

      if (scrollPosition > 0 && state.camera) {
        state.camera.position.y += (state.targetY - state.camera.position.y) * LERP_FACTOR;
      }
    }
  };

  const animate = () => {
    requestAnimationFrame(animate);
    updateCameraPositionOnScroll();

    state.composer?.render();
    state.stats?.update();

    if (state.animationEnabled && state.animationPlaying && state.gridHelper) {
      state.gridHelper.position.x += 0.005;
      if (state.gridHelper.position.x > 1) {
        state.gridHelper.position.x = 0;
      }

      state.lightSegments = state.lightSegments.filter((segment) => {
        if (segment.rotation.y === 0) {
          segment.position.z += 0.5;
          if (segment.position.z > GRID_SIZE / 2) {
            state.scene.remove(segment);
            return false;
          }
        } else {
          segment.position.x += 0.5;
          if (segment.position.x > GRID_SIZE / 2) {
            state.scene.remove(segment);
            return false;
          }
        }
        return true;
      });

      if (Math.random() < 0.05) {
        createLightSegment();
      }
    }

    if (state.renderer && resizeRendererToDisplaySize(state.renderer)) {
      const canvas = state.renderer.domElement;
      state.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      state.camera.updateProjectionMatrix();
    }

    state.cameraControls?.update();
    state.renderer?.render(state.scene, state.camera);
  };

  const cleanup = () => {
    state.lightSegments.forEach((segment) => {
      segment.geometry.dispose();
      (segment.material as THREE.Material).dispose();
    });

    state.gridHelper?.geometry.dispose();
    if (state.gridHelper?.material) {
      (state.gridHelper.material as THREE.Material).dispose();
    }

    state.renderer?.dispose();
    state.composer?.dispose();
  };

  const init = () => {
    state.renderer = initRenderer();
    if (!state.renderer) return;

    setupCamera();
    setupLights();
    setupControls();
    updateGridHelper();
    setupDarkModeObserver();

    state.composer = initComposer();

    if (isDevelopment) {
      state.stats = new Stats();
      document.body.appendChild(state.stats.dom);
      setupDebugGUI();
    }

    animate();
  };

  return {
    init,
    cleanup,
  };
};

export default createScene;
