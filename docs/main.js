import * as THREE from "three";
import { generateScene } from "./src/components/map.js";
import { Character } from "./src/components/character.js";


let character;
let clock; 
let renderer;
let scene, camera;
var mode, chosen;

function init() {

  mode = chosen = 0;

  document.getElementById("Easy").onclick = function () {
      mode = 1;
  }
  document.getElementById("Normal").onclick = function () {
      mode = 2;
  }
  document.getElementById("Hard").onclick = function () {
      mode = 3;
  }
  document.getElementById("Start").onclick = function () {
    if (mode && chosen) {
      document.getElementById("startMenu").style.display = 'none';
      canvas.style.display = 'block';
      initGame();
      animate();
    }
    else if (mode && !chosen)
      alert("Select a character first!");
    else if (!mode && chosen)
      alert("Select a game mode first!");
    else
      alert("Please select gamemode and character!");
  }
  document.getElementById("Resume").onclick = function () {
    canvas.style.display = 'block';
    document.getElementById("pauseMenu").style.display = 'none';
  }
  document.getElementById("Restart").onclick = function () {
    canvas.style.display = 'none';
    document.getElementById("pauseMenu").style.display = 'none';
    document.getElementById("startMenu").style.display = 'block';
    init();
  }
  document.getElementById("newGame").onclick = function () {
    canvas.style.display = 'none';
    document.getElementById("pauseMenu").style.display = 'none';
    document.getElementById("winMenu").style.display = 'none';
    document.getElementById("startMenu").style.display = 'block';
    init();
  }
  document.addEventListener('keydown', handleKeyDown);

  function handleKeyDown(event) {
    if (event.keyCode === 27 && mode && chosen) { // 27 is the key code for the Escape key
      canvas.style.display = 'none';
      document.getElementById("pauseMenu").style.display = 'block';
    }
  }
  document.getElementById("v1").onclick = function () {
    chosen = 1;
  }
  document.getElementById("v2").onclick = function () {
    chosen = 2;
  }
  document.getElementById("v3").onclick = function () {
    chosen = 3;
  }
}

export function initGame() {
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
    generateScene(scene, mode);

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

    //scene.fog = new THREE.Fog(0x222222, 0, 10);
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

export var chosen;
