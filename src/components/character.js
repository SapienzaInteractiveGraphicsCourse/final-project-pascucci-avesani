import * as THREE from "three";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
boxMesh.position.y = 0.5; // Move the box half of its height above the floor

export class Character {
  constructor(scene) {
    this.moveSpeed = 0.05;
    this.jumpSpeed = 0.05;
    this.isJumping = false;
    this.jumpHeight = 0;
    scene.add(boxMesh);
  }

  jump() {
    console.log("Jump!");
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
    console.log("no more sprint!");
    this.moveSpeed /= 4;
  }
}
