import * as THREE from "three";
var windowCenterX = window.innerWidth / 2;
var windowCenterY = window.innerHeight / 2;

export class CameraControls {
  constructor(camera) {
    this.camera = camera;
    this.pov = new THREE.Vector3(0, 0, 5);
    this.lastMouseX = windowCenterX;
    this.lastMouseY = windowCenterY;
    this.mouseDown = false;
    this.camera.position.copy(this.pov);
  }

  handleMouseMove(event) {
    console.log("handleMouseMove");
    var deltaX = event.clientX - this.lastMouseX;
    var deltaY = event.clientY - this.lastMouseY;
    if (!this.mouseDown) {
      this.pov.x -= deltaX * 0.01;
      this.pov.y += deltaY * 0.01;
      this.camera.position.copy(this.pov);
    } else {
      this.camera.rotation.y += deltaX * 0.01;
      this.camera.rotation.x += deltaY * 0.01;
    }
    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;
  }
  handleMouseDown(event) {
    this.mouseDown = true;
  }
  handleMouseUp(event) {
    this.mouseDown = false;
  }

  handleWheel(event) {
    var delta = event.deltaY;
    this.pov.z += delta * 0.01;
    this.camera.position.copy(this.pov);
  }

  moveForward() {
    this.pov.z -= 0.05;
    this.camera.position.copy(this.pov);
  }

  moveBackward() {
    this.pov.z += 0.05;
    this.camera.position.copy(this.pov);
  }

  moveLeft() {
    this.pov.x -= 0.05;
    this.camera.position.copy(this.pov);
  }

  moveRight() {
    this.pov.x += 0.05;
    this.camera.position.copy(this.pov);
  }
}
