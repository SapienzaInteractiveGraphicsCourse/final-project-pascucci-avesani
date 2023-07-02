import * as THREE from "three";
import { generateScene } from "./src/components/map";
import { Character } from "./src/components/character";
import * as eventListener from "./src/controls/eventListeners";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Floor
generateScene(scene);

// Box
var character = new Character(scene, camera);

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0); // Set the orbit target to the center of the scene
controls.enableRotate = true;

//Render loop

function animate() {
  requestAnimationFrame(animate);
  // Update orbit controls positions
  character.movement();
  controls.update();
  character.updateCamera();
  renderer.render(scene, camera);
}

animate();
