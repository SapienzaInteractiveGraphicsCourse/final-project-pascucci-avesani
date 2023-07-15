import * as THREE from "three";
import { GLTFLoader } from "GLTFLoader";
import { OrbitControls } from "OrbitControls";

const loader = new GLTFLoader();

let models = [
  "./assets/characters/Male_01_V01.glb",
  "./assets/characters/Male_02_V01.glb",
  "./assets/characters/Female_03_V02.glb",
];

const textureLoader = new THREE.TextureLoader();
const background = textureLoader.load("./assets/sky_background.png");

let loadedModels = [];

const scene1 = new THREE.Scene();
const scene2 = new THREE.Scene();
const scene3 = new THREE.Scene();

let scenes = [];
scenes.push(scene1, scene2, scene3);

const camera1 = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const camera2 = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const camera3 = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera1.position.z = 1;
camera2.position.z = 1;
camera3.position.z = 1;

// Set game window size
let canvas1, renderer1;
let canvas2, renderer2;
let canvas3, renderer3;

let controls1;
let controls2;
let controls3;

let loadingStatus = 0;

for (let i = 0; i < 3; i++) {
  loadedModels.push(
    loader.load(
      models[i],
      function (glb) {
        const model = glb.scene;
        model.position.y = -1.5;
        model.scale.set(2, 1, 2);
        scenes[i].add(model, new THREE.AmbientLight(0xffffff, 0.5));
        scenes[i].background = background;
      },
      function (xhr) {
        loadingStatus = (xhr.loaded / xhr.total) * 100;
        document.getElementById("loadingStatus").innerText =
          "Loading character";
      }
    )
  );
}

function initialize() {
  const interval = setInterval(checkCondition, 1000);

  function checkCondition() {
    let loaded = true;
    for (let i = 0; i < 3; i++) if (!models[i]) loaded = false;

    if (loaded) {
      clearInterval(interval);
      initMenu();
    }
  }
}

function initMenu() {
  document.getElementById("loadingScreen").style.display = "none";
  document.getElementById("showMenu").style.display = "block";

  canvas1 = document.getElementById("model1");
  renderer1 = new THREE.WebGLRenderer({ canvas: canvas1 });
  renderer1.setSize(canvas1.clientWidth, canvas1.clientHeight);

  canvas2 = document.getElementById("model2");
  renderer2 = new THREE.WebGLRenderer({ canvas: canvas2 });
  renderer2.setSize(canvas1.clientWidth, canvas1.clientHeight);

  canvas3 = document.getElementById("model3");
  renderer3 = new THREE.WebGLRenderer({ canvas: canvas3 });
  renderer3.setSize(canvas1.clientWidth, canvas1.clientHeight);

  controls1 = new OrbitControls(camera1, renderer1.domElement);
  controls2 = new OrbitControls(camera2, renderer2.domElement);
  controls3 = new OrbitControls(camera3, renderer3.domElement);

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  renderer1.render(scene1, camera1);
  renderer2.render(scene2, camera2);
  renderer3.render(scene3, camera3);

  controls1.update();
  controls2.update();
  controls3.update();
}

initialize();
