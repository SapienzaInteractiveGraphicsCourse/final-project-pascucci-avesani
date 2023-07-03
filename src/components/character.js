import * as THREE from "three";
import * as eventListener from "../controls/eventListeners";
import { isObjectColliding } from "./map";

// Define character
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
// Create character (square) box
boxMesh.geometry.computeBoundingBox();

// Initial character position
boxMesh.position.y = 0.5; // Move the box half of its height above the floor
boxMesh.position.x = -2;
boxMesh.position.z = 5;

const box = new THREE.Box3();

export class Character {
  constructor(scene, camera) {
    this.moveSpeed = 0.05;
    this.jumpSpeed = 0.05;
    this.isJumping = false;
    this.jumpHeight = 0;
    // Camera settings
    this.camera = camera;
    this.camera.position.x = 0;
    this.camera.position.z = 5;
    this.camera.position.y = 2;
    this.isColliding = false;
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

    // Update the character box position, mandatory to call every time the character moves
    box.copy(boxMesh.geometry.boundingBox).applyMatrix4(boxMesh.matrixWorld);

    //Check if the object is colliding with map objects
    this.isColliding = isObjectColliding(box);
    console.log("Collisione:", this.isColliding);
  }

  updateCamera() {
    this.camera.position.x = boxMesh.position.x;
    this.camera.position.z = boxMesh.position.z + 5;
    this.camera.lookAt(boxMesh.position);
  }
}
