import * as THREE from "three";
import * as eventListener from "../controls/eventListeners";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
boxMesh.position.y = 0.5; // Move the box half of its height above the floor

export class Character {
  constructor(scene, camera) {
    this.moveSpeed = 0.05;
    this.jumpSpeed = 0.05;
    this.isJumping = false;
    this.jumpHeight = 0;
    this.camera = camera;
    // Position and rotate the camera
    this.camera.position.x = 0;
    this.camera.position.z = 5;
    this.camera.position.y = 2;
    scene.add(boxMesh);
  }

  movement() {
    let activeKeys = eventListener.activeKeys;
    // Move the box
    const moveAmount = activeKeys.ShiftLeft
      ? this.moveSpeed * 3
      : this.moveSpeed;
    if (activeKeys.KeyW) {
      boxMesh.position.z -= moveAmount;
    }
    if (activeKeys.KeyS) {
      boxMesh.position.z += moveAmount;
    }
    if (activeKeys.KeyA) {
      boxMesh.position.x -= moveAmount;
    }
    if (activeKeys.KeyD) {
      boxMesh.position.x += moveAmount;
    }

    // Jumping
    if (activeKeys.Space && !this.isJumping) {
      this.isJumping = true;
    }

    if (this.isJumping) {
      this.jumpHeight += this.jumpSpeed;
      boxMesh.position.y = 0.5 + Math.sin(this.jumpHeight) * 1; // Adjust the jump height and speed here
      if (this.jumpHeight >= Math.PI) {
        this.isJumping = false;
        this.jumpHeight = 0;
        activeKeys;
      }
    }
  }

  updateCamera() {
    this.camera.position.x = boxMesh.position.x;
    this.camera.position.z = boxMesh.position.z + 5;
    this.camera.lookAt(boxMesh.position);
  }
}
