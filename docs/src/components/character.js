import * as THREE from "three";
import * as eventListener from "../controls/eventListeners.js";
import { isObjectColliding } from "./map.js";
import { CharacterAnimation } from "./animation.js";
import { mazeLength } from "./map.js";
import { loadWinMenu } from "../controls/eventListeners.js";

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

    if (this.group.position.z < -mazeLength - 3) {
      loadWinMenu();
      this.group.position.z = 0;
    }

    let spotlight = this.group.getObjectByName("SpotLight");
    if (spotlight) {
      console.log(spotlight.quaternion);
      this.group
        .getObjectByName("SpotLight")
        .target.position.set(idealLookAt.x, idealLookAt.y, idealLookAt.z);
      console.log(idealLookAt);
    }
  }

  handleCollision(controlObject, oldPosition) {
    let { movingState } = this;
    const { x, z } = controlObject.position;
    const collidingObjects = isObjectColliding(characterBox);

    if (collidingObjects == 0) {
      if (z < oldPosition.z) movingState[1] = 1;
      else movingState[1] = -1;
      if (x < oldPosition.x) movingState[0] = 1;
      else movingState[0] = -1;
    } else {
      for (let i = 0; i < collidingObjects.length; i++) {
        if (collidingObjects[i][1] == collidingObjects[i][3]) {
          if (z < oldPosition.z && movingState[1] == 1)
            controlObject.position.z = oldPosition.z;
          else if (z > oldPosition.z && movingState[1] == -1)
            controlObject.position.z = oldPosition.z;
        } else if (collidingObjects[i][0] == collidingObjects[i][2]) {
          if (x < oldPosition.x && movingState[0] == 1)
            controlObject.position.x = oldPosition.x;
          else if (x > oldPosition.x && movingState[0] == -1) {
            controlObject.position.x = oldPosition.x;
          }
        }

        if (collidingObjects[i][1] == collidingObjects[i][3]) {
          if (
            !(
              Math.abs(x) <
                Math.max(
                  (Math.abs(collidingObjects[i][0]),
                  Math.abs(collidingObjects[i][2]))
                ) &&
              Math.abs(x) >
                Math.min(
                  Math.abs(collidingObjects[i][0]),
                  Math.abs(collidingObjects[i][2])
                )
            )
          ) {
            if (x < oldPosition.x && movingState[0] == 1)
              controlObject.position.x = oldPosition.x;
            else if (x > oldPosition.x && movingState[0] == -1) {
              controlObject.position.x = oldPosition.x;
            }
          }
        } else if (collidingObjects[i][0] == collidingObjects[i][2]) {
          if (
            !(
              Math.abs(z) <
                Math.max(
                  (Math.abs(collidingObjects[i][1]),
                  Math.abs(collidingObjects[i][3]))
                ) &&
              Math.abs(z) >
                Math.min(
                  Math.abs(collidingObjects[i][1]),
                  Math.abs(collidingObjects[i][3])
                )
            )
          ) {
            if (z < oldPosition.z && movingState[1] == 1)
              controlObject.position.z = oldPosition.z;
            else if (z > oldPosition.z && movingState[1] == -1)
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
