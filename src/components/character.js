import * as THREE from "three";
import * as eventListener from "../controls/eventListeners";
import { isObjectColliding } from "./map";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

// Define character
const loader = new GLTFLoader();
let model;

// Variables to store the current rotation values
let currentLegRotation = 0;
let currentArmRotation = 0;
let currentHeadRotation = 0;
let currentTorsoRotation = 0;

// Create character (square) box
//boxMesh.geometry.computeBoundingBox();

/* // Initial character position
boxMesh.position.y = 0.5; // Move the box half of its height above the floor
boxMesh.position.x = -2;
boxMesh.position.z = 5;*/

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

    loader.load('../../assets/Male_01_V01.glb', function (gltf) {
      model = gltf.scene;
    
      // Set the desired scale for the model
      const desiredScale = 1;
      model.scale.set(desiredScale, desiredScale, desiredScale);
      model.rotateY(Math.PI);

      model.position.set(-2, 0, 5);
    
      scene.add(model);
    }, undefined, function (error) {
      console.error(error);
    });

    this.state = "idle";
  }

  movement() {
    let activeKeys = eventListener.activeKeys;
    // Move the box
    const moveAmount = activeKeys.ShiftLeft
      ? this.moveSpeed * 3
      : this.moveSpeed;
    if (activeKeys.KeyW) {
      if (model.rotation.y > 0)
        model.rotation.y -= Math.PI * 0.05;
      else
        model.rotation.y = 0;
      model.position.z -= moveAmount;
    }
    if (activeKeys.KeyS) {
      if (model.rotation.y < Math.PI)
        model.rotation.y += Math.PI * 0.05;
      else
        model.rotation.y = Math.PI;
      model.position.z += moveAmount;
    }
    if (activeKeys.KeyA) {
      model.position.x -= moveAmount;
    }
    if (activeKeys.KeyD) {
      model.position.x += moveAmount;
    }

    if (activeKeys.KeyR) {
      model.rotation.y += moveAmount;
    }

    // Jumping
    if (activeKeys.Space && !this.isJumping) {
      this.isJumping = true;
    }

    if (this.isJumping) {
      this.jumpHeight += this.jumpSpeed;
      model.position.y = Math.sin(this.jumpHeight) * 1; // Adjust the jump height and speed here
      if (this.jumpHeight >= Math.PI) {
        this.isJumping = false;
        this.jumpHeight = 0;
        activeKeys;
      }
    }

    // Update the character box position, mandatory to call every time the character moves
    //box.copy(model.geometry.boundingBox).applyMatrix4(model.matrixWorld);

    //Check if the object is colliding with map objects
    this.isColliding = isObjectColliding(box);
    console.log("Collisione:", this.isColliding);
  }

  animation() {
  // Calculate a time-based value for the leg and arm movement
  const time = Date.now() * 0.001;

  if (this.state == "idle")
    this.idle();

  else if (this.state == "walking")
    this.walk();

  else if (this.state == "running")
    this.run();
  else
    console.log("undefined state!");
  }

  updateCamera() {
    if(model) this.camera.position.x = model.position.x;
    if(model) this.camera.position.z = model.position.z + 4;
    if(model) this.camera.lookAt(model.position);
  }

  updateState() {
    let activeKeys = eventListener.activeKeys;
    const walkingKeys = ["KeyW", "KeyA", "KeyS", "KeyD"];
    this.state = "idle";
    for (const k in activeKeys){
      if (walkingKeys.includes(k)){
        activeKeys.ShiftLeft ? this.state = "running" : this.state = "walking";
      }
      else if (k == "Space")
        this.state = "jumping"
    }
  }

  idle() {
    // Rotate the neck slightly
    const neck = model.getObjectByName('Neck');
    if (neck) {
      neck.rotation.y = Math.sin(Date.now() * 0.0025) * Math.PI * 0.02;
    }

    // Rotate the spine slightly
    const spine = model.getObjectByName('Spine');
    if (spine) {
      spine.rotation.y = Math.sin(Date.now() * 0.005) * Math.PI * 0.02;
    }

    const torso1 = model.getObjectByName('Spine1');
    if (torso1) {
      torso1.rotation.x = Math.sin(Date.now() * 0.005) * Math.PI * 0.02;
    }

    // Rotate the arms slightly
    const leftArm = model.getObjectByName('LeftArm');
    const rightArm = model.getObjectByName('RightArm');
    if (leftArm && rightArm) {
      leftArm.rotation.z = Math.sin(Date.now() * 0.002) * Math.PI * 0.02;
      rightArm.rotation.z = - Math.sin(Date.now() * 0.002) * Math.PI * 0.02;
    }

    // Flex one leg and advance it slightly
    const leftLeg = model.getObjectByName('LeftLeg');
    const rightLeg = model.getObjectByName('RightLeg');
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
    const leftLeg = model.getObjectByName('LeftLeg');
    const rightLeg = model.getObjectByName('RightLeg');
    if (leftLeg && rightLeg) {
      leftLeg.rotation.x = currentLegRotation;
      rightLeg.rotation.x = -currentLegRotation;
    }

    // Rotate the left and right arms
    const leftArm = model.getObjectByName('LeftArm');
    const rightArm = model.getObjectByName('RightArm');
    if (leftArm && rightArm) {
      leftArm.rotation.z = currentArmRotation;
      rightArm.rotation.z = currentArmRotation;
    }

    // Rotate the head and torso
    const head = model.getObjectByName('Neck');
    const torso = model.getObjectByName('Spine');
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
    const leftLeg = model.getObjectByName('LeftLeg');
    const rightLeg = model.getObjectByName('RightLeg');
    if (leftLeg && rightLeg) {
      leftLeg.rotation.x = currentLegRotation;
      rightLeg.rotation.x = -currentLegRotation;
    }
  
    // Rotate the left and right arms
    const leftArm = model.getObjectByName('LeftArm');
    const rightArm = model.getObjectByName('RightArm');
    if (leftArm && rightArm) {
      leftArm.rotation.z = currentArmRotation;
      rightArm.rotation.z = currentArmRotation;
    }
  
    // Rotate the head and torso
    const head = model.getObjectByName('Neck');
    const torso = model.getObjectByName('Spine');
    const torso1 = model.getObjectByName('Spine1');
    if (head && torso) {
      head.rotation.y = currentHeadRotation;
      head.rotation.x = currentHeadRotation;
      torso.rotation.y = currentTorsoRotation;
  
      // Apply leaning to the torso
      torso1.rotation.x = Math.PI * 0.1;
    }
  }
}
