import * as THREE from "three";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
boxMesh.position.y = 0.5; // Move the box half of its height above the floor

export class Character {
  constructor(scene, camera) {
    this.moveSpeed = 0.1;
    this.jumpSpeed = 0.1;
    this.isJumping = false;
    this.jumpHeight = 0;
    this.camera = camera;
    // Position and rotate the camera
    this.camera.position.z = 5;
    this.camera.position.y = 2;
    scene.add(boxMesh);
  }

  jump() {
    this.jumpHeight += this.jumpSpeed;
    boxMesh.position.y = 0.5 + Math.sin(this.jumpHeight) * 1; // Adjust the jump height and speed here
    if (this.jumpHeight >= Math.PI) {
      this.isJumping = false;
      this.jumpHeight = 0;
    }
  }
  moveRignt() {
    boxMesh.position.x += this.moveSpeed;
  }
  moveLeft() {
    boxMesh.position.x -= this.moveSpeed;
  }
  moveForward() {
    boxMesh.position.z -= this.moveSpeed;
  }
  moveBackward() {
    boxMesh.position.z += this.moveSpeed;
  }
  setSprint() {
    console.log("sprint!");
    if (this.moveSpeed <= 0.05) this.moveSpeed *= 4;
  }
  unsetSprint() {
    this.moveSpeed /= 4;
  }

  updateCamera() {
    this.camera.position.x = boxMesh.position.x;
    this.camera.position.z = boxMesh.position.z + 5;
    this.camera.lookAt(boxMesh.position);
  }
}
