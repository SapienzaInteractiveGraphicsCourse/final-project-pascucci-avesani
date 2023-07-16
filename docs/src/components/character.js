import * as THREE from "three";
import * as eventListener from "../controls/eventListeners.js";
import { isMazeWallColliding, isLightSwichColliding } from "./map.js";
import { CharacterAnimation } from "./animation.js";
import { mazeLength } from "./map.js";

// Create character hit box
const geometry = new THREE.BoxGeometry(1.6, 1.9, 1.2);
const material = new THREE.MeshBasicMaterial({
  transparent: true,
  opacity: 0,
});
const characterCube = new THREE.Mesh(geometry, material);
characterCube.position.y = 0.95;
characterCube.geometry.computeBoundingBox();
const characterBox = new THREE.Box3();

var flashlight;

export class Character extends CharacterAnimation {
  constructor(scene, camera) {
    super(scene, characterCube);
    this.camera = camera;
    this.moveSpeed = 0.05;
    this.jumpSpeed = 0.04;
    this.isJumping = false;
    this.jumpHeight = 0;

    this.state = "idle";
    this.movingState = [0, 0];
    this.deceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
    this.acceleration = new THREE.Vector3(1, 0.25, 50.0);
    this.velocity = new THREE.Vector3(0, 0, 0);
  }

  movement(timeInSeconds) {
    this.handleKeyEvents(timeInSeconds);
    this.jump();

    const { velocity, deceleration } = this;
    const frameDecceleration = new THREE.Vector3(
      velocity.x * deceleration.x,
      velocity.y * deceleration.y,
      velocity.z * deceleration.z
    );
    frameDecceleration.multiplyScalar(timeInSeconds);
    frameDecceleration.z =
      Math.sign(frameDecceleration.z) *
      Math.min(Math.abs(frameDecceleration.z), Math.abs(velocity.z));
    velocity.add(frameDecceleration);

    const controlObject = this.group;

    const oldPosition = new THREE.Vector3();
    oldPosition.copy(controlObject.position);

    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyQuaternion(controlObject.quaternion);
    forward.normalize();

    const sideways = new THREE.Vector3(1, 0, 0);
    sideways.applyQuaternion(controlObject.quaternion);
    sideways.normalize();

    sideways.multiplyScalar(velocity.x * timeInSeconds);
    forward.multiplyScalar(velocity.z * timeInSeconds);

    controlObject.position.add(forward);
    controlObject.position.add(sideways);

    characterBox
      .copy(characterCube.geometry.boundingBox)
      .applyMatrix4(characterCube.matrixWorld);

    this.handleCollision(controlObject, oldPosition);

    oldPosition.copy(controlObject.position);

    const idealOffSet = new THREE.Vector3(-1, 2, -4);
    idealOffSet.applyQuaternion(controlObject.quaternion);
    idealOffSet.add(controlObject.position);

    const idealLookAt = new THREE.Vector3(0, 1, 5);
    idealLookAt.applyQuaternion(controlObject.quaternion);
    idealLookAt.add(controlObject.position);

    this.camera.position.copy(idealOffSet);
    this.camera.lookAt(idealLookAt);

    if (this.group.position.z < -mazeLength - 2) {
      eventListener.loadWinMenu();
      document.documentElement.style.cursor = "auto";
      this.group.position.z = 0;
    }

    flashlight = this.group.getObjectByName("SpotLight");
    if (flashlight)
      flashlight.target.position.set(idealLookAt.x, 1.5, idealLookAt.z);

  }

  handleCollision(controlObject, oldPosition) {
    const { movingState } = this;
    const { x, z } = controlObject.position;
    const collidingObjects = isMazeWallColliding(characterBox);

    if (collidingObjects.length === 0) {
      movingState[1] = z < oldPosition.z ? 1 : -1;
      movingState[0] = x < oldPosition.x ? 1 : -1;
    } else {
      for (let i = 0; i < collidingObjects.length; i++) {
        const [x1, z1, x2, z2] = collidingObjects[i];

        if (z1 === z2) {
          if (
            (z < oldPosition.z && movingState[1] === 1) ||
            (z > oldPosition.z && movingState[1] === -1)
          ) {
            controlObject.position.z = oldPosition.z;
          }
        } else if (x1 === x2) {
          if (
            (x < oldPosition.x && movingState[0] === 1) ||
            (x > oldPosition.x && movingState[0] === -1)
          ) {
            controlObject.position.x = oldPosition.x;
          }
        }

        const maxX = Math.max(Math.abs(x1), Math.abs(x2));
        const minX = Math.min(Math.abs(x1), Math.abs(x2));
        const maxZ = Math.max(Math.abs(z1), Math.abs(z2));
        const minZ = Math.min(Math.abs(z1), Math.abs(z2));

        if (!(Math.abs(x) < maxX && Math.abs(x) > minX)) {
          if (
            (x < oldPosition.x && movingState[0] === 1) ||
            (x > oldPosition.x && movingState[0] === -1)
          ) {
            controlObject.position.x = oldPosition.x;
          }
        } else if (!(Math.abs(z) < maxZ && Math.abs(z) > minZ)) {
          if (
            (z < oldPosition.z && movingState[1] === 1) ||
            (z > oldPosition.z && movingState[1] === -1)
          ) {
            controlObject.position.z = oldPosition.z;
          }
        }
      }
    }
  }

  handleKeyEvents(timeInSeconds) {
    const { velocity, group } = this;
    const { activeKeys } = eventListener;
    const acc = this.acceleration.clone();

    const Q = new THREE.Quaternion();
    const A = new THREE.Vector3();
    const R = group.quaternion.clone();

    if (activeKeys.ShiftLeft) acc.multiplyScalar(2.5);
    for (const key in activeKeys) {
      switch (key) {
        case "KeyW":
          velocity.z += acc.z * timeInSeconds * 0.5;
          break;
        case "KeyS":
          velocity.z -= acc.z * timeInSeconds * 0.5;
          break;
        case "Space":
          if (!this.isJumping) this.isJumping = true;
          break;
        case "KeyA":
          A.set(0, 1, 0);
          Q.setFromAxisAngle(
            A,
            4.0 * Math.PI * timeInSeconds * this.acceleration.y
          );
          R.multiply(Q);
          break;
        case "KeyD":
          A.set(0, 1, 0);
          Q.setFromAxisAngle(
            A,
            4.0 * -Math.PI * timeInSeconds * this.acceleration.y
          );
          R.multiply(Q);
          break;
        case "KeyF":
          if (flashlight)
            flashlight.intensity = flashlight.intensity > 0 ? 0 : 0.7;
          delete activeKeys[key];
          break;
        case "KeyE":
          isLightSwichColliding(characterBox);
          delete activeKeys[key];
          break;
        case "Escape":
          document.documentElement.style.cursor = "auto";
          canvas.style.display = "none";
          document.getElementById("pauseMenu").style.display = "block";
          eventListener.pauseTimer();
          break;
      }
    }
    group.quaternion.copy(R);
  }

  jump() {
    let { group } = this;
    if (this.isJumping) {
      this.jumpHeight += this.jumpSpeed;
      group.position.y = Math.sin(this.jumpHeight) * 4; // Adjust the jump height and speed here
      if (this.jumpHeight >= Math.PI) {
        this.isJumping = false;
        this.jumpHeight = 0;
        group.position.y = 0;
      }
    }
  }

  updateState() {
    const activeKeys = eventListener.activeKeys;
    const walkingKeys = ["KeyW", "KeyA", "KeyS", "KeyD"];
    this.state = "idle";
    for (const k in activeKeys) {
      if (walkingKeys.includes(k))
        activeKeys.ShiftLeft
          ? (this.state = "running")
          : (this.state = "walking");
      else if (k == "Space") this.state = "jumping";
    }
  }
}

//518km
