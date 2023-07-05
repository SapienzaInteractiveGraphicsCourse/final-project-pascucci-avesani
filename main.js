import * as THREE from "three";
import { generateScene } from "./src/components/map";
import { Character } from "./src/components/character";
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'

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

// Create Clock
const clock = new THREE.Clock();

// Create character
var character = new Character(scene, camera);

// Create a directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);



//Render loop

function animate(currentTime) {

  requestAnimationFrame(animate);

  character.animation();
  character.updateState();
  character.movement2(clock.getDelta());

  renderer.render(scene, camera);
}

animate();
