import * as THREE from "three";
import { generateScene } from "./src/components/map";
import { Character } from "./src/components/character";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Camera and scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.x = -2;
camera.position.z = -10;
camera.position.y = 2;

// Set game window size
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// Create map
generateScene(scene);

// Create Clock
const clock = new THREE.Clock();

// Create character
var character = new Character(scene, camera);

// Create a directional light
let dirlight = new THREE.DirectionalLight(0xffffff, 0.7);
dirlight.position.set(100, 100, 100);
scene.add(dirlight);

let ambient = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambient);

//

//Render loop
function animate() {
  requestAnimationFrame(animate);
  character.animation();
  character.updateState();
  character.movement(clock.getDelta());
  renderer.render(scene, camera);
}

animate();
