import * as THREE from "three";

var coordinatesArray = [
  40, 0, 600, 0, 600, 0, 600, 600, 560, 600, 0, 600, 0, 600, 0, 0, 40, 0, 40,
  40, 40, 40, 40, 80, 0, 120, 40, 120, 0, 160, 40, 160, 40, 200, 40, 240, 40,
  240, 40, 280, 40, 280, 40, 320, 0, 400, 40, 400, 40, 440, 40, 480, 40, 480,
  40, 520, 40, 520, 40, 560, 80, 40, 80, 80, 40, 80, 80, 80, 40, 120, 80, 120,
  80, 120, 80, 160, 80, 160, 80, 200, 40, 200, 80, 200, 80, 240, 80, 280, 40,
  320, 80, 320, 80, 320, 80, 360, 40, 360, 80, 360, 40, 400, 80, 400, 40, 440,
  80, 440, 80, 520, 80, 560, 40, 560, 80, 560, 80, 40, 120, 40, 120, 80, 120,
  120, 80, 120, 120, 120, 120, 160, 120, 200, 120, 200, 120, 240, 80, 240, 120,
  240, 80, 280, 120, 280, 120, 280, 120, 320, 80, 360, 120, 360, 120, 360, 120,
  400, 120, 400, 120, 440, 80, 480, 120, 480, 120, 480, 120, 520, 80, 520, 120,
  520, 120, 40, 160, 40, 120, 80, 160, 80, 160, 120, 160, 160, 120, 160, 160,
  160, 160, 200, 160, 240, 120, 320, 160, 320, 160, 320, 160, 360, 160, 360,
  160, 400, 120, 440, 160, 440, 160, 440, 160, 480, 120, 480, 160, 480, 160,
  520, 160, 560, 120, 560, 160, 560, 160, 40, 200, 40, 200, 40, 200, 80, 200,
  80, 200, 120, 160, 120, 200, 120, 200, 120, 200, 160, 200, 160, 200, 200, 160,
  200, 200, 200, 200, 240, 200, 280, 160, 280, 200, 280, 160, 320, 200, 320,
  200, 360, 200, 400, 200, 400, 200, 440, 160, 440, 200, 440, 200, 480, 200,
  520, 160, 520, 200, 520, 200, 520, 200, 560, 240, 40, 240, 80, 240, 80, 240,
  120, 240, 120, 240, 160, 240, 160, 240, 200, 240, 200, 240, 240, 200, 240,
  240, 240, 200, 280, 240, 280, 200, 320, 240, 320, 240, 320, 240, 360, 240,
  360, 240, 400, 200, 440, 240, 440, 240, 480, 240, 520, 200, 560, 240, 560,
  280, 0, 280, 40, 240, 80, 280, 80, 280, 120, 280, 160, 280, 160, 280, 200,
  280, 200, 280, 240, 280, 240, 280, 280, 280, 280, 280, 320, 240, 320, 280,
  320, 280, 360, 280, 400, 280, 400, 280, 440, 240, 440, 280, 440, 280, 440,
  280, 480, 280, 480, 280, 520, 240, 520, 280, 520, 240, 560, 280, 560, 320, 40,
  320, 80, 280, 80, 320, 80, 280, 120, 320, 120, 320, 120, 320, 160, 320, 160,
  320, 200, 280, 240, 320, 240, 320, 280, 320, 320, 320, 320, 320, 360, 280,
  360, 320, 360, 280, 400, 320, 400, 320, 480, 320, 520, 320, 520, 320, 560,
  280, 560, 320, 560, 320, 40, 360, 40, 360, 40, 360, 80, 360, 80, 360, 120,
  360, 120, 360, 160, 320, 200, 360, 200, 320, 240, 360, 240, 320, 280, 360,
  280, 360, 280, 360, 320, 320, 360, 360, 360, 360, 400, 360, 440, 320, 440,
  360, 440, 320, 480, 360, 480, 320, 520, 360, 520, 360, 560, 360, 600, 360, 80,
  400, 80, 360, 160, 400, 160, 360, 200, 400, 200, 360, 240, 400, 240, 400, 240,
  400, 280, 360, 320, 400, 320, 400, 360, 400, 400, 400, 400, 400, 440, 360,
  440, 400, 440, 360, 480, 400, 480, 360, 520, 400, 520, 400, 520, 400, 560,
  400, 40, 440, 40, 400, 80, 440, 80, 440, 80, 440, 120, 400, 120, 440, 120,
  400, 160, 440, 160, 400, 200, 440, 200, 440, 240, 440, 280, 400, 280, 440,
  280, 400, 320, 440, 320, 440, 320, 440, 360, 400, 360, 440, 360, 440, 400,
  440, 440, 440, 440, 440, 480, 400, 480, 440, 480, 440, 520, 440, 560, 440,
  560, 440, 600, 440, 40, 480, 40, 480, 40, 480, 80, 440, 120, 480, 120, 480,
  120, 480, 160, 480, 160, 480, 200, 440, 240, 480, 240, 480, 280, 480, 320,
  440, 320, 480, 320, 480, 360, 480, 400, 440, 400, 480, 400, 480, 440, 480,
  480, 480, 480, 480, 520, 440, 520, 480, 520, 480, 520, 480, 560, 520, 0, 520,
  40, 480, 80, 520, 80, 520, 80, 520, 120, 480, 160, 520, 160, 520, 160, 520,
  200, 520, 200, 520, 240, 480, 240, 520, 240, 520, 240, 520, 280, 480, 320,
  520, 320, 480, 360, 520, 360, 520, 360, 520, 400, 520, 400, 520, 440, 480,
  480, 520, 480, 480, 560, 520, 560, 560, 40, 560, 80, 520, 80, 560, 80, 560,
  120, 560, 160, 520, 160, 560, 160, 560, 240, 560, 280, 520, 280, 560, 280,
  520, 320, 560, 320, 560, 320, 560, 360, 520, 400, 560, 400, 520, 440, 560,
  440, 560, 440, 560, 480, 560, 480, 560, 520, 520, 520, 560, 520, 520, 560,
  560, 560, 560, 80, 600, 80, 560, 200, 600, 200, 560, 400, 600, 400,
];
//Reduce maze dimensions
coordinatesArray = coordinatesArray.map((coord) => Math.abs(coord / 10));

const wallsGeometry = {};
const wallMaterials = {};
const wallMeshes = {};
const wallBoxes = {};

// Draw the maze
function maze(scene) {
  const height = 6;

  for (let i = 0, j = 0; i < coordinatesArray.length; i += 4, j++) {
    // Initialize wall boxes
    wallBoxes[j] = new THREE.Box3();

    const length = Math.max(
      Math.abs(coordinatesArray[i] - coordinatesArray[i + 2]),
      Math.abs(coordinatesArray[i + 1] - coordinatesArray[i + 3])
    );

    wallsGeometry[j] = new THREE.BoxGeometry(length, height, 1);
    wallMaterials[j] = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });

    wallMeshes[j] = new THREE.Mesh(wallsGeometry[j], wallMaterials[j]);
    if (coordinatesArray[i] == coordinatesArray[i + 2]) {
      wallMeshes[j].rotation.y = Math.PI / 2;
      wallMeshes[j].position.x = -coordinatesArray[i];
      wallMeshes[j].position.z =
        -(coordinatesArray[i + 1] + coordinatesArray[i + 3]) / 2;
    } else if (coordinatesArray[i + 1] == coordinatesArray[i + 3]) {
      wallMeshes[j].position.x =
        -(coordinatesArray[i] + coordinatesArray[i + 2]) / 2;
      wallMeshes[j].position.z = -coordinatesArray[i + 1];
    }
    wallMeshes[j].position.y = height / 2;

    // Create wall box
    wallMeshes[j].geometry.computeBoundingBox();
    scene.add(wallMeshes[j]);
  }
}

// Draw the floor
function floor(scene) {
  const floorGeometry = new THREE.PlaneGeometry(100, 100);
  const floorMaterial = new THREE.MeshBasicMaterial({
    color: 0x808080,
    side: THREE.DoubleSide,
  });
  const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
  floorMesh.rotation.x = Math.PI / 2; // Rotate the floor to be horizontal
  floorMesh.position.x = -25;
  floorMesh.position.z = -25;
  scene.add(floorMesh);
}

export function generateScene(scene) {
  maze(scene);
  floor(scene);
}

// Calculate if a given box is colliding with Map objects
export function isObjectColliding(box) {
  for (let i = 0, j = 0; i < coordinatesArray.length; i += 4, j++) {
    wallBoxes[j]
      .copy(wallMeshes[j].geometry.boundingBox)
      .applyMatrix4(wallMeshes[j].matrixWorld);
    if (box.intersectsBox(wallBoxes[j])) return true;
  }
  return false;
}
