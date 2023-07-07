import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

let model, flashLight;

// Define character
const loader = new GLTFLoader();

// Used to group together character and box
const group = new THREE.Group();

const desiredScale = 1;

// Variables to store the current rotation values
let currentLegRotation = 0;
let currentArmRotation = 0;
let currentHeadRotation = 0;
let currentTorsoRotation = 0;

export class CharacterAnimation {
  constructor(scene, characterCube) {
    this.initialize(scene, characterCube);
    //this.loadFlashLight();
  }

  async initialize(scene, characterCube) {
    this.loadModel(scene, characterCube);
    this.startCheckingCondition();
  }

  loadModel(scene, characterCube) {
    loader.load(
      "../../assets/Male_01_V01.glb",
      function (gltf) {
        model = gltf.scene;

        // Set the desired scale for the model
        group.add(model, characterCube);
        group.scale.set(desiredScale, desiredScale, desiredScale);
        group.rotateY(Math.PI);
        group.position.set(-2, 0, 5);
        scene.add(group);
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      function (error) {
        console.error(error);
      }
    );
  }

  startCheckingCondition() {
    const interval = setInterval(checkCondition, 1000);
    const load = this.loadFlashLight;
    function checkCondition() {
      if (model) {
        load();
        clearInterval(interval);
      }
    }
  }

  loadFlashLight() {
    loader.load(
      "../../assets/flashLight.glb",

      function (gltf) {
        console.log("Loading flashlight");
        flashLight = gltf.scene;
        model
          .getObjectByName("RightHand")
          .add(flashLight.getObjectByName("Sketchfab_model"));

        const flashlightModel = model.getObjectByName("Sketchfab_model");
        flashlightModel.scale.set(0.03, 0.03, 0.03);
        flashlightModel.position.set(0, 0.07, 0.01);
        for (let i = 1; i < 6; i++)
          model.getObjectByName("RightHand").children[i].rotateX(2);
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      function (error) {
        console.error(error);
      }
    );
  }

  animation() {
    if (model) {
      switch (this.state) {
        case "idle":
          this.idle();
          break;
        case "walking":
          this.walk();
          break;
        case "running":
          this.run();
          break;
        case "jumping":
          this.run();
          break;
      }
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

  getGroup() {
    return group;
  }
}
