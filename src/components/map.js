import * as THREE from "three";

function wall(scene) {
  const wallGeometry = new THREE.BoxGeometry(20, 6, 0, 1);
  const wallMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });
  const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
  wallMesh.rotation.y = Math.PI / 2;
  wallMesh.position.x = 2;
  wallMesh.position.y = 3;
  scene.add(wallMesh);

  var wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
  wall2.rotation.y = Math.PI / 2;
  wall2.position.x = -2; // Desired x-position for the second wall
  wall2.position.y = 3;
  scene.add(wall2);

  var wall3 = new THREE.Mesh(wallGeometry, wallMaterial);

  wall3.position.z = -15; // Desired x-position for the second wall
  wall3.position.y = 3;
  scene.add(wall3);
}

export function generateScene(scene) {
  wall(scene);
  const floorGeometry = new THREE.PlaneGeometry(100, 100);
  const floorMaterial = new THREE.MeshBasicMaterial({
    color: 0x808080,
    side: THREE.DoubleSide,
  });
  const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
  floorMesh.rotation.x = Math.PI / 2; // Rotate the floor to be horizontal
  scene.add(floorMesh);
}
