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
const geometry = new THREE.BoxGeometry(0.8, 3.8, 0.5);
const material = new THREE.MeshBasicMaterial({
  transparent: true,
  opacity: 0.5,
});
const characterCube = new THREE.Mesh(geometry, material);
characterCube.geometry.computeBoundingBox();
const characterBox = new THREE.Box3();

// Used to group together character and box
const group = new THREE.Group();

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

    loader.load(
      "../../assets/Male_01_V01.glb",
      function (gltf) {
        model = gltf.scene;

        // Set the desired scale for the model
        const desiredScale = 1;
        model.scale.set(desiredScale, desiredScale, desiredScale);
        model.rotateY(Math.PI);

        group.add(characterCube, model);
        group.position.set(-2, 0, 5);
        group.rotation.y = 0;

        scene.add(group);
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );

    this.group = group;

    this.state = "idle";
  }

  movement() {
    let activeKeys = eventListener.activeKeys;
    // Move the box
    const moveAmount = activeKeys.ShiftLeft
      ? this.moveSpeed * 3
      : this.moveSpeed;

    const rotFactor = Math.PI * 0.05;

    if (activeKeys.KeyW) {
      if (group.rotation.y > 0 && group.rotation.y < Math.PI)
        group.rotation.y -= rotFactor;
      else if (group.rotation.y >= Math.PI && group.rotation.y < 2 * Math.PI)
        group.rotation.y += rotFactor;
      if (group.rotation.y == 2 * Math.PI) group.rotation.y = 0;

      group.position.z -= moveAmount;
    }
    if (activeKeys.KeyS) {
      if (group.rotation.y >= 0 && group.rotation.y < Math.PI)
        group.rotation.y += rotFactor;
      else if (group.rotation.y > Math.PI && group.rotation.y < 2 * Math.PI) {
        group.rotation.y -= rotFactor;
      }

      group.position.z += moveAmount;
    }
    if (activeKeys.KeyA) {
      if (activeKeys.KeyW) group.rotation.y = (Math.PI * 7) / 4;
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
      }

      group.position.x -= moveAmount;
    }
    if (activeKeys.KeyD) {
      if (activeKeys.KeyW) group.rotation.y = Math.PI / 4;
      else if (activeKeys.KeyS) group.rotation.y = (Math.PI * 3) / 4;
      else {
        if (group.rotation.y > -Math.PI / 2 && group.rotation.y < Math.PI / 2)
          group.rotation.y += rotFactor;
        else if (
          group.rotation.y > Math.PI / 2 &&
          group.rotation.y <= (Math.PI * 3) / 2
        )
          group.rotation.y -= rotFactor;
      }

      group.position.x += moveAmount;
    }

    if (activeKeys.KeyR) {
      group.rotation.y += moveAmount;
    }

    // Jumping
    if (activeKeys.Space && !this.isJumping) {
      this.isJumping = true;
    }

    if (this.isJumping) {
      this.jumpHeight += this.jumpSpeed;
      group.position.y = Math.sin(this.jumpHeight) * 1; // Adjust the jump height and speed here
      if (this.jumpHeight >= Math.PI) {
        this.isJumping = false;
        this.jumpHeight = 0;
        activeKeys;
      }
    }

    // Update the character box position, mandatory to call every time the character moves
    //box.copy(model.geometry.boundingBox).applyMatrix4(model.matrixWorld);

    //Check if the object is colliding with map objects
    //this.isColliding = isObjectColliding(characterBox);
    //console.log("Collisione:", this.isColliding);

    if (group) console.log(group.rotation.y);
  }

  animation() {
    // Calculate a time-based value for the leg and arm movement
    const time = Date.now() * 0.001;

    if (this.state == "idle" && group.children[1]) this.idle();
    else if (this.state == "walking") this.walk();
    else if (this.state == "running") this.run();
    else if (this.state == "jumping") this.run();
  }

  updateCamera() {
    if (group) this.camera.position.x = group.position.x;
    if (group) this.camera.position.z = group.position.z + 3.5;
    if (group) this.camera.lookAt(this.camera.position);
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
    const model = group.children[1];
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
    const model = group.children[1];
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
    const model = group.children[1];
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
