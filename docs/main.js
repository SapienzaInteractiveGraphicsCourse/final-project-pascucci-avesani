import * as THREE from "three";
import { generateScene } from "./src/components/map.js";
import { Character } from "./src/components/character.js";
import { startTimer, initTimer } from "./src/controls/eventListeners.js";

let character;
let clock;
let renderer;
let scene, camera;
let mode = 0,
  chosen = 0;

window.onresize = function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

function init() {
  //mode = chosen = 1;
  initTimer();

  document.getElementById("Start").onclick = function () {
    if (mode && chosen) {
      document.getElementById("startMenu").style.display = "none";
      canvas.style.display = "block";
      handleButtonPressed("Start");
    } else if (mode && !chosen) alert("Select a character first!");
    else if (!mode && chosen) alert("Select a game mode first!");
    else alert("Please select gamemode and character!");
  };
}

export function handleButtonPressed(element) {
  switch (element) {
    case "Easy":
      mode = 1;
      break;
    case "Normal":
      mode = 2;
      break;
    case "Hard":
      mode = 3;
      break;
    case "v1":
      chosen = 1;
      break;
    case "v2":
      chosen = 2;
      break;
    case "v3":
      chosen = 3;
      break;
    case "Resume":
      startTimer();
      break;
    case "Restart":
      location.reload();
      break;
    case "newGame":
      location.reload();
      break;
    case "Start":
      initGame();
      animate();
      break;
  }
}
export function initGame() {
  document.getElementById("canvas").style.display = "none";
  document.getElementById("loadingScreen").style.display = "block";
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
  renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (mode == 1) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  // Create map
  generateScene(scene, mode);

  // Create Clock
  clock = new THREE.Clock();

  // Create character
  character = new Character(scene, camera);

  // Create a directional light
  let dirlight = new THREE.DirectionalLight(0xffffff, 0.7);
  dirlight.position.set(100, 100, 100);
  //scene.add(dirlight);

  let ambient = new THREE.AmbientLight(0xffffff, 0.001);
  scene.add(ambient);

  const light = new THREE.PointLight(0xffffff, 1.0);
  light.position.set(-5.5, 7, -10);
  //scene.add(light);
}

//Render loop
export function animate() {
  requestAnimationFrame(animate);

  character.animation();
  character.updateState();
  character.movement(clock.getDelta());

  renderer.render(scene, camera);
}

init();

export { chosen };
