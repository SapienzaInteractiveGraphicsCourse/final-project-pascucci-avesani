import * as THREE from "three";
import * as eventListener from "../controls/eventListeners";
import { isObjectColliding } from "./map";
import { CharacterAnimation } from "./animation";

// Create character hit box
const geometry = new THREE.BoxGeometry(0.8, 1.9, 0.5);
const material = new THREE.MeshBasicMaterial({
  transparent: true,
  opacity: 0,
});
const characterCube = new THREE.Mesh(geometry, material);
characterCube.position.y = 0.95;
characterCube.geometry.computeBoundingBox();
const characterBox = new THREE.Box3();

// Used to group together character and box
let group = new THREE.Group();

export class Character extends CharacterAnimation {
  constructor(scene, camera) {
    super(scene, characterCube);
    this.camera = camera;
    this.moveSpeed = 0.05;
    this.jumpSpeed = 0.04;
    this.isJumping = false;
    this.jumpHeight = 0;
    this.isColliding = false;

    this.state = "idle";
    this.lastMovement = {};

    this.deceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
    this.acceleration = new THREE.Vector3(1, 0.25, 50.0);
    this.velocity = new THREE.Vector3(0, 0, 0);
    group = this.getGroup();
  }

  movement(timeInSeconds) {
    const activeKeys = eventListener.activeKeys;

    if (activeKeys.Space && !this.isJumping) {
      this.isJumping = true;
    }

    if (this.isJumping) {
      this.jumpHeight += this.jumpSpeed;
      group.position.y = Math.sin(this.jumpHeight) * 5; // Adjust the jump height and speed here
      if (this.jumpHeight >= Math.PI) {
        this.isJumping = false;
        this.jumpHeight = 0;
        activeKeys;
      }
    }

    const velocity = this.velocity;
    const frameDecceleration = new THREE.Vector3(
      velocity.x * this.deceleration.x,
      velocity.y * this.deceleration.y,
      velocity.z * this.deceleration.z
    );
    frameDecceleration.multiplyScalar(timeInSeconds);
    frameDecceleration.z =
      Math.sign(frameDecceleration.z) *
      Math.min(Math.abs(frameDecceleration.z), Math.abs(velocity.z));

    velocity.add(frameDecceleration);

    const controlObject = group;
    const Q = new THREE.Quaternion();
    const A = new THREE.Vector3();
    const R = controlObject.quaternion.clone();

    const acc = this.acceleration.clone();
    if (activeKeys.ShiftLeft) {
      acc.multiplyScalar(2.5);
    }

    if (this.state == "idle") {
      acc.multiplyScalar(0.0);
      velocity.multiplyScalar(0.0);
    }

    if (activeKeys.KeyW)
      if (!(this.isColliding && this.lastMovement.KeyW))
        velocity.z += acc.z * timeInSeconds * 0.5;
      else velocity.z = 0;

    if (activeKeys.KeyS) {
      if (!(this.isColliding && this.lastMovement.KeyS))
        velocity.z -= acc.z * timeInSeconds * 0.5;
      else velocity.z = 0;
    }
    if (activeKeys.KeyA) {
      A.set(0, 1, 0);
      Q.setFromAxisAngle(
        A,
        4.0 * Math.PI * timeInSeconds * this.acceleration.y
      );
      R.multiply(Q);
    }
    if (activeKeys.KeyD) {
      A.set(0, 1, 0);
      Q.setFromAxisAngle(
        A,
        4.0 * -Math.PI * timeInSeconds * this.acceleration.y
      );
      R.multiply(Q);
    }

    controlObject.quaternion.copy(R);

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

    oldPosition.copy(controlObject.position);

    const idealOffSet = new THREE.Vector3(-1, 2, -4);
    idealOffSet.applyQuaternion(controlObject.quaternion);
    idealOffSet.add(controlObject.position);

    const idealLookAt = new THREE.Vector3(0, 1, 5);
    idealLookAt.applyQuaternion(controlObject.quaternion);
    idealLookAt.add(controlObject.position);

    this.camera.position.copy(idealOffSet);
    this.camera.lookAt(idealLookAt);

    // Update the character box position, mandatory to call every time the character moves
    characterBox
      .copy(characterCube.geometry.boundingBox)
      .applyMatrix4(characterCube.matrixWorld);

    //Check for collisions
    if (isObjectColliding(characterBox) && !this.isColliding)
      this.lastMovement = { ...activeKeys };
    this.isColliding = isObjectColliding(characterBox);
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
