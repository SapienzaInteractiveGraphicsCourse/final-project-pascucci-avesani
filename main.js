import * as THREE from "https://unpkg.com/three@0.154.0/build/three.module.js";
import { generateScene } from "./src/components/map";
import { Character } from "./src/components/character";

let character;
let clock; 
let renderer;
let scene, camera;
let mode = 0;

function init() {

  document.getElementById("Easy").onclick = function () {
      mode = 1;
      document.getElementById("startMenu").style.display = 'none';
      canvas.style.display = 'block';
      initGame();
      animate();
  }
  document.getElementById("Normal").onclick = function () {
      mode = 2;
      document.getElementById("startMenu").style.display = 'none';
      canvas.style.display = 'block';
      initGame();
      animate();
  }
  document.getElementById("Hard").onclick = function () {
      mode = 3;
      document.getElementById("startMenu").style.display = 'none';
      canvas.style.display = 'block';
      initGame();
      animate();
  }
  document.getElementById("Resume").onclick = function () {
    canvas.style.display = 'block';
    document.getElementById("pauseMenu").style.display = 'none';
  }
  document.getElementById("Restart").onclick = function () {
    canvas.style.display = 'none';
    document.getElementById("pauseMenu").style.display = 'none';
    document.getElementById("startMenu").style.display = 'block';
  }
  document.addEventListener('keydown', handleKeyDown);

  function handleKeyDown(event) {
    if (event.keyCode === 27) { // 27 is the key code for the Escape key
      canvas.style.display = 'none';
      document.getElementById("pauseMenu").style.display = 'block';
    }
  }
}

function initGame() {
    // Camera and scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.x = -2;
    camera.position.z = -10;
    camera.position.y = 2;

    // Set game window size
    let canvas = document.getElementById("canvas");
    renderer = new THREE.WebGLRenderer({canvas: canvas});
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Create map
    generateScene(scene);

    // Create Clock
    clock = new THREE.Clock();

    // Create character
    character = new Character(scene, camera);

    // Create a directional light
    let dirlight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirlight.position.set(100, 100, 100);
    scene.add(dirlight);

    let ambient = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambient);

    scene.fog = new THREE.Fog(0x222222, 0, 10);
}

//Render loop
function animate() {
  requestAnimationFrame(animate);

  character.animation();
  character.updateState();
  character.movement(clock.getDelta());

  renderer.render(scene, camera);
}

init();
