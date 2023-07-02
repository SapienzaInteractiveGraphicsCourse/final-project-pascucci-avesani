import * as THREE from "three";
import { generateScene } from "./src/components/map";
import { Character } from "./src/components/character";
import { EventListener } from "./src/controls/eventListeners";
import { CameraControls } from "./src/controls/cameraControls";

// Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const cameraControls = new CameraControls(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Floor
generateScene(scene);
// Box
var character = new Character(scene);
var eventListener = new EventListener(character, cameraControls);

camera.position.z = 10;

// mouse event listeners
document.addEventListener(
  "keydown",
  (event) => {
    eventListener.onKeyDown(event);
  },
  false
);
document.addEventListener(
  "keyup",
  (event) => {
    eventListener.onKeyUp(event);
  },
  false
);
document.addEventListener(
  "mousemove",
  (event) => {
    eventListener.onMouseMove(event);
  },
  false
);
document.addEventListener(
  "wheel",
  (event) => {
    eventListener.onWheel(event);
  },
  false
);
document.addEventListener(
  "mousedown",
  (event) => {
    eventListener.onMouseUp(event);
  },
  false
);
document.addEventListener(
  "mouseup",
  (event) => {
    eventListener.onMouseDown(event);
  },
  false
);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
