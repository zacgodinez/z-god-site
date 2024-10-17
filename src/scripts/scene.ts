import GUI from 'lil-gui';
import {
  AmbientLight,
  BoxGeometry,
  MeshBasicMaterial,
  Clock,
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
import { resizeRendererToDisplaySize } from './utils';

const CANVAS_ID = 'scene';
const mode = import.meta.env.MODE;

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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let clock: Clock;
let stats: Stats;
let gui: GUI;
let lightSegments: Mesh[];

const animation = { enabled: true, play: true };

init();
animate();

// ===== 🪄 Tron light effect =====
const gridSize = 300;
const gridDivisions = 300;
// eslint-disable-next-line prefer-const
lightSegments = [];
const segmentGeometry = new BoxGeometry(0.1, 0.1, 1);
const segmentMaterial = new MeshBasicMaterial({ color: 0x00ffff });

function createLightSegment() {
  const isHorizontal = Math.random() < 0.5;
  const position = Math.floor(Math.random() * gridDivisions) - gridDivisions / 2 + 0.5;

  const segment = new Mesh(segmentGeometry, segmentMaterial);

  if (isHorizontal) {
    segment.position.set(-gridSize / 2, -1.55, position);
    segment.rotation.y = Math.PI / 2;
  } else {
    segment.position.set(position, -1.55, -gridSize / 2);
  }

  scene.add(segment);
  lightSegments.push(segment);
}

function init() {
  // ===== 🖼️ CANVAS, RENDERER, & SCENE =====
  {
    canvas = document.querySelector(`canvas#${CANVAS_ID}`)!;
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    scene = new Scene();
  }

  // ===== 👨🏻‍💼 LOADING MANAGER =====
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

  // ===== 💡 LIGHTS =====
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

  // ===== 🎥 CAMERA =====
  {
    camera = new PerspectiveCamera(120, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(-1.3, 0.0, 0);
    camera.lookAt(0, 0, 0);
  }

  // ===== 🕹️ CONTROLS =====
  {
    cameraControls = new OrbitControls(camera, canvas);
    cameraControls.enableDamping = true;
    cameraControls.autoRotate = false;
    cameraControls.update();

    dragControls = new DragControls([], camera, renderer.domElement);
    dragControls.addEventListener('hoveron', (event) => {
      const mesh = event.object as Mesh;
      const material = mesh.material as MeshStandardMaterial;
      material.emissive.set('orange');
    });
    dragControls.addEventListener('hoveroff', (event) => {
      const mesh = event.object as Mesh;
      const material = mesh.material as MeshStandardMaterial;
      material.emissive.set('black');
    });
    dragControls.addEventListener('dragstart', (event) => {
      const mesh = event.object as Mesh;
      const material = mesh.material as MeshStandardMaterial;
      cameraControls.enabled = false;
      animation.play = false;
      material.emissive.set('black');
      material.opacity = 0.7;
      material.needsUpdate = true;
    });
    dragControls.addEventListener('dragend', (event) => {
      cameraControls.enabled = true;
      animation.play = true;
      const mesh = event.object as Mesh;
      const material = mesh.material as MeshStandardMaterial;
      material.emissive.set('black');
      material.opacity = 1;
      material.needsUpdate = true;
    });
    dragControls.enabled = false;
  }

  // ===== 🪄 HELPERS =====
  {
    pointLightHelper = new PointLightHelper(pointLight, undefined, 'orange');
    pointLightHelper.visible = false;
    scene.add(pointLightHelper);

    gridHelper = new GridHelper(300, 300, 0x2a4858, 0x2a4858);
    gridHelper.position.y = -1.5;
    scene.add(gridHelper);
  }

  // ===== 📈 STATS & CLOCK =====
  if (mode === 'development') {
    clock = new Clock();
    stats = new Stats();
    document.body.appendChild(stats.dom);
  }

  // ==== 🐞 DEBUG GUI ====
  if (mode === 'development') {
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

function animate() {
  requestAnimationFrame(animate);

  if (mode === 'development') {
    stats.update();
  }

  if (animation.enabled && animation.play) {
    // move grids
    gridHelper.position.x += 0.005;
    if (gridHelper.position.x > 1) {
      gridHelper.position.x = 0;
    }

    // Move light segments
    lightSegments?.forEach((segment, index) => {
      if (segment.rotation.y === 0) {
        segment.position.z += 0.5;
        if (segment.position.z > gridSize / 2) {
          scene.remove(segment);
          lightSegments.splice(index, 1);
        }
      } else {
        segment.position.x += 0.5;
        if (segment.position.x > gridSize / 2) {
          scene.remove(segment);
          lightSegments.splice(index, 1);
        }
      }
    });

    // Randomly create new light segments
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
