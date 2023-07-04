import * as THREE from "three";
import { generateScene } from "./src/components/map";
import { Character } from "./src/components/character";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  50
);
camera.setFocalLength(20);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create map
generateScene(scene);

// Create character
var character = new Character(scene, camera);

// Create a directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0); // Set the orbit target to the center of the scene
controls.enableRotate = true;

//Render loop

function animate() {
  requestAnimationFrame(animate);

  character.movement();
  character.animation();
  character.updateState();
  controls.update();
  character.updateCamera();
  renderer.render(scene, camera);
}

animate();
