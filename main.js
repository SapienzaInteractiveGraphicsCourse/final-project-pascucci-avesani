import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
var pov = new THREE.Vector3(0, 0, 5); // Initial POV position

var windowCenterX = window.innerWidth / 2;
var windowCenterY = window.innerHeight / 2;
lastMouseX = windowCenterX;
lastMouseY = windowCenterY;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 10;

// mouse event listeners
document.addEventListener(
  "mousemove",
  (event) => {
    onMouseMove(event, pov, camera);
  },
  false
);
document.addEventListener("mousedown", onMouseDown, false);
document.addEventListener("mouseup", onMouseUp, false);
addEventListener(
  "wheel",
  (event) => {
    onWheel(event, pov, camera);
  },
  false
);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
