import * as THREE from "three";
import * as eventListener from "../controls/eventListeners";
import { isObjectColliding } from "./map";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// Define character
const loader = new GLTFLoader();
let model;

// Variables to store the current rotation values
let currentLegRotation = 0;
let currentArmRotation = 0;
let currentHeadRotation = 0;
let currentTorsoRotation = 0;

// Create character hit box
const geometry = new THREE.BoxGeometry(0.8, 1.9, 0.5);
const material = new THREE.MeshBasicMaterial({
  transparent: true,
  opacity: 0.5,
});
const characterCube = new THREE.Mesh(geometry, material);
characterCube.position.y = 0.95;
characterCube.geometry.computeBoundingBox();
const characterBox = new THREE.Box3();

// Used to group together character and box
const group = new THREE.Group();

const box = new THREE.Box3();

var currentPosition = new THREE.Vector3();
var currentLookAt = new THREE.Vector3();

export class Character {
  constructor(scene, camera) {
    this.moveSpeed = 0.05;
    this.jumpSpeed = 0.04;
    this.isJumping = false;
    this.jumpHeight = 0;
    // Camera settings
    this.camera = camera;
    this.camera.position.x = -2;
    this.camera.position.z = 10;
    this.camera.position.y = 2;
    this.isColliding = false;

    loader.load(
      "../../assets/Male_01_V01.glb",
      function (gltf) {
        model = gltf.scene;

        // Set the desired scale for the model
        group.add(model, characterCube);

        const desiredScale = 1;
        group.scale.set(desiredScale, desiredScale, desiredScale);

        group.position.set(-2, 0, 5);
        group.rotateY(Math.PI);

        scene.add(group);
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );

    this.state = "idle";
    this.lastMovement = false;

    this.deceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
    this.acceleration = new THREE.Vector3(1, 0.25, 50.0);
    this.velocity = new THREE.Vector3(0, 0, 0);
  }

  movement() {
    let activeKeys = eventListener.activeKeys;

    const moveAmount = activeKeys.ShiftLeft
      ? this.moveSpeed * 3
      : this.moveSpeed;

    const rotFactor = Math.PI * 0.05;

    if (activeKeys.KeyW) {
      /* if (group.rotation.y > 0 && group.rotation.y < Math.PI)
        group.rotation.y -= rotFactor;
      else if (group.rotation.y >= Math.PI && group.rotation.y < 2 * Math.PI)
        group.rotation.y += rotFactor;
      if (group.rotation.y == 2 * Math.PI) group.rotation.y = 0; */
      if (!(this.isColliding && this.lastMovement.KeyW))
        group.position.z -= moveAmount;
    }
    if (activeKeys.KeyS) {
      /* if (group.rotation.y >= 0 && group.rotation.y < Math.PI)
        group.rotation.y += rotFactor;
      else if (group.rotation.y > Math.PI && group.rotation.y < 2 * Math.PI) {
        group.rotation.y -= rotFactor;
      }  */
      if (!(this.isColliding && this.lastMovement.KeyS))
        group.position.z += moveAmount;
    }
    if (activeKeys.KeyD) {
      /* if (activeKeys.KeyW) group.rotation.y = (Math.PI * 7) / 4;
      else if (activeKeys.KeyS) group.rotation.y = (Math.PI * 5) / 4;
      else {
        if (
          group.rotation.y > -Math.PI / 2 &&
          group.rotation.y <= Math.PI / 2
        ) {
          group.rotation.y -= rotFactor;
          if (group.rotation.y == -Math.PI / 2)
            group.rotation.y = (Math.PI * 3) / 2;
        } else if (
          group.rotation.y > Math.PI / 2 &&
          group.rotation.y < (Math.PI * 3) / 2
        )
          group.rotation.y += rotFactor;
      } */
      if (!(this.isColliding && this.lastMovement.KeyD))
        group.position.x += moveAmount;
    }
    if (activeKeys.KeyA) {
      /* if (activeKeys.KeyW) group.rotation.y = Math.PI / 4;
      else if (activeKeys.KeyS) group.rotation.y = (Math.PI * 3) / 4;
      else {
        if (group.rotation.y > -Math.PI / 2 && group.rotation.y < Math.PI / 2)
          group.rotation.y += rotFactor;
        else if (
          group.rotation.y > Math.PI / 2 &&
          group.rotation.y <= (Math.PI * 3) / 2
        )
          group.rotation.y -= rotFactor;
      } */
      if (!(this.isColliding && this.lastMovement.KeyA))
        group.position.x -= moveAmount;
    }

    if (activeKeys.KeyR) {
      group.rotation.y += moveAmount;
    }

    // Jumping
    if (activeKeys.Space && !this.isJumping) {
      this.isJumping = true;
    }

    if (this.isJumping) {
      this.jumpHeight += this.jumpSpeed * 2;
      group.position.y = Math.sin(this.jumpHeight) + 30; // Adjust the jump height and speed here
      if (this.jumpHeight >= 20 * Math.PI) {
        this.isJumping = false;
        this.jumpHeight = 0;
      }
    }

    // Update the character box position, mandatory to call every time the character moves
    characterBox
      .copy(characterCube.geometry.boundingBox)
      .applyMatrix4(characterCube.matrixWorld);

    //Check for collisions
    if (isObjectColliding(characterBox) && !this.isColliding)
      this.lastMovement = { ...activeKeys };
    this.isColliding = isObjectColliding(characterBox);
  }

  movement2(timeInSeconds) {

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
    frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
        Math.abs(frameDecceleration.z), Math.abs(velocity.z));

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

    if (activeKeys.KeyW) {
      velocity.z += acc.z * timeInSeconds * 0.5;
    }
    if (activeKeys.KeyS) {
      velocity.z -= acc.z * timeInSeconds * 0.5;
    }
    if (activeKeys.KeyA) {
      A.set(0, 1, 0);
      Q.setFromAxisAngle(A, 4.0 * Math.PI * timeInSeconds * this.acceleration.y);
      R.multiply(Q);
    }
    if (activeKeys.KeyD) {
      A.set(0, 1, 0);
      Q.setFromAxisAngle(A, 4.0 * -Math.PI * timeInSeconds * this.acceleration.y);
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
  }

  animation() {
    // Calculate a time-based value for the leg and arm movement
    const time = Date.now() * 0.001;

    if (this.state == "idle" && model) this.idle();
    else if (this.state == "walking") this.walk();
    else if (this.state == "running") this.run();
    else if (this.state == "jumping") this.run();
  }

  updateState() {
    let activeKeys = eventListener.activeKeys;
    const walkingKeys = ["KeyW", "KeyA", "KeyS", "KeyD"];
    this.state = "idle";
    for (const k in activeKeys) {
      if (walkingKeys.includes(k)) {
        activeKeys.ShiftLeft
          ? (this.state = "running")
          : (this.state = "walking");
      } else if (k == "Space") this.state = "jumping";
    }
  }

  idle() {
    // Rotate the neck slightly
    const neck = model.getObjectByName("Neck");
    if (neck) {
      neck.rotation.y = Math.sin(Date.now() * 0.0025) * Math.PI * 0.02;
    }

    // Rotate the spine slightly
    const spine = model.getObjectByName("Spine");
    if (spine) {
      spine.rotation.y = Math.sin(Date.now() * 0.005) * Math.PI * 0.02;
    }

    const torso1 = model.getObjectByName("Spine1");
    if (torso1) {
      torso1.rotation.x = Math.sin(Date.now() * 0.005) * Math.PI * 0.02;
    }

    // Rotate the arms slightly
    const leftArm = model.getObjectByName("LeftArm");
    const rightArm = model.getObjectByName("RightArm");
    if (leftArm && rightArm) {
      leftArm.rotation.z = Math.sin(Date.now() * 0.002) * Math.PI * 0.02;
      rightArm.rotation.z = -Math.sin(Date.now() * 0.002) * Math.PI * 0.02;
    }

    // Flex one leg and advance it slightly
    const leftLeg = model.getObjectByName("LeftLeg");
    const rightLeg = model.getObjectByName("RightLeg");
    if (leftLeg && rightLeg) {
      const legAngle = Math.sin(Date.now() * 0.0015) * Math.PI * 0.02;
      const legOffset = 0.1; // Adjust the offset as desired

      leftLeg.rotation.x = legAngle;
      rightLeg.rotation.x = 0; // Keep the right leg in a neutral position
      leftLeg.position.z = -legOffset; // Move the left leg slightly forward
      rightLeg.position.z = 0; // Keep the right leg in a neutral position
    }
  }

  walk() {
    // Calculate a time-based value for the leg and arm movement
    const time = Date.now() * 0.001;
    const legRotation = Math.sin(time * 4) * Math.PI * 0.2;
    const armRotation = Math.cos(time * 2) * Math.PI * 0.1;
    const headRotation = Math.sin(time * 2) * Math.PI * 0.05;
    const torsoRotation = Math.cos(time * 4) * Math.PI * 0.05;

    // Smoothly interpolate the rotation values
    const legRotationDelta = legRotation - currentLegRotation;
    currentLegRotation += legRotationDelta * 0.1;

    const armRotationDelta = armRotation - currentArmRotation;
    currentArmRotation += armRotationDelta * 0.1;

    const headRotationDelta = headRotation - currentHeadRotation;
    currentHeadRotation += headRotationDelta * 0.1;

    const torsoRotationDelta = torsoRotation - currentTorsoRotation;
    currentTorsoRotation += torsoRotationDelta * 0.1;

    // Rotate the left and right legs
    const leftLeg = model.getObjectByName("LeftLeg");
    const rightLeg = model.getObjectByName("RightLeg");
    if (leftLeg && rightLeg) {
      leftLeg.rotation.x = currentLegRotation;
      rightLeg.rotation.x = -currentLegRotation;
    }

    // Rotate the left and right arms
    const leftArm = model.getObjectByName("LeftArm");
    const rightArm = model.getObjectByName("RightArm");
    if (leftArm && rightArm) {
      leftArm.rotation.z = currentArmRotation;
      rightArm.rotation.z = currentArmRotation;
    }

    // Rotate the head and torso
    const head = model.getObjectByName("Neck");
    const torso = model.getObjectByName("Spine");
    if (head && torso) {
      head.rotation.y = currentHeadRotation;
      head.rotation.z = currentHeadRotation;
      torso.rotation.y = currentTorsoRotation;
    }
  }

  run() {
    // Calculate a time-based value for the leg and arm movement
    const time = Date.now() * 0.001;
    const legRotation = Math.sin(time * 8) * Math.PI * 0.5;
    const armRotation = Math.cos(time * 4) * Math.PI * 0.25;
    const headRotation = Math.sin(time * 4) * Math.PI * 0.1;
    const torsoRotation = Math.cos(time * 8) * Math.PI * 0.1;

    // Smoothly interpolate the rotation values
    const legRotationDelta = legRotation - currentLegRotation;
    currentLegRotation += legRotationDelta * 0.1;

    const armRotationDelta = armRotation - currentArmRotation;
    currentArmRotation += armRotationDelta * 0.1;

    const headRotationDelta = headRotation - currentHeadRotation;
    currentHeadRotation += headRotationDelta * 0.1;

    const torsoRotationDelta = torsoRotation - currentTorsoRotation;
    currentTorsoRotation += torsoRotationDelta * 0.1;

    // Calculate leaning angle based on leg rotation
    const leaningAngle = legRotation * 0.1;

    // Rotate the left and right legs
    const leftLeg = model.getObjectByName("LeftLeg");
    const rightLeg = model.getObjectByName("RightLeg");
    if (leftLeg && rightLeg) {
      leftLeg.rotation.x = currentLegRotation;
      rightLeg.rotation.x = -currentLegRotation;
    }

    // Rotate the left and right arms
    const leftArm = model.getObjectByName("LeftArm");
    const rightArm = model.getObjectByName("RightArm");
    if (leftArm && rightArm) {
      leftArm.rotation.z = currentArmRotation;
      rightArm.rotation.z = currentArmRotation;
    }

    // Rotate the head and torso
    const head = model.getObjectByName("Neck");
    const torso = model.getObjectByName("Spine");
    const torso1 = model.getObjectByName("Spine1");
    if (head && torso) {
      head.rotation.y = currentHeadRotation;
      head.rotation.x = currentHeadRotation;
      torso.rotation.y = currentTorsoRotation;

      // Apply leaning to the torso
      torso1.rotation.x = Math.PI * 0.1;
    }
  }
}
