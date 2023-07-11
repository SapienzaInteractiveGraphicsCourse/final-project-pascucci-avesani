import * as THREE from "three";

var coordinatesArray;
let mazeLength;

const difficulty = 1;

if (!difficulty) {
  //to handle
} else {
  if (difficulty == 1) {
    coordinatesArray = [
      120, 0, 600, 0, 600, 0, 600, 600, 480, 600, 0, 600, 0, 600, 0, 0, 0, 120,
      120, 120, 120, 120, 120, 240, 120, 240, 120, 360, 120, 360, 120, 480, 120,
      120, 240, 120, 240, 240, 240, 360, 240, 360, 240, 480, 360, 0, 360, 120,
      360, 120, 360, 240, 240, 240, 360, 240, 240, 480, 360, 480, 360, 240, 480,
      240, 360, 360, 480, 360, 480, 360, 480, 480, 480, 480, 480, 600, 480, 120,
      600, 120,
    ];
    coordinatesArray = coordinatesArray.map((coord) => Math.abs(coord / 12));
    mazeLength = 600 / 12;
  } else if (difficulty == 2) {
    coordinatesArray = [
      85.71428571428571, 0, 600, 0, 600, 0, 600, 600, 514.2857142857143, 600, 0,
      600, 0, 600, 0, 0, 85.71428571428571, 0, 85.71428571428571,
      85.71428571428571, 0, 171.42857142857142, 85.71428571428571,
      171.42857142857142, 85.71428571428571, 257.1428571428571,
      85.71428571428571, 342.85714285714283, 85.71428571428571,
      342.85714285714283, 85.71428571428571, 428.57142857142856,
      85.71428571428571, 428.57142857142856, 85.71428571428571,
      514.2857142857142, 85.71428571428571, 85.71428571428571,
      171.42857142857142, 85.71428571428571, 85.71428571428571,
      171.42857142857142, 171.42857142857142, 171.42857142857142,
      85.71428571428571, 257.1428571428571, 171.42857142857142,
      257.1428571428571, 171.42857142857142, 342.85714285714283,
      171.42857142857142, 428.57142857142856, 171.42857142857142,
      428.57142857142856, 171.42857142857142, 514.2857142857142,
      171.42857142857142, 85.71428571428571, 257.1428571428571,
      85.71428571428571, 171.42857142857142, 171.42857142857142,
      257.1428571428571, 171.42857142857142, 257.1428571428571,
      171.42857142857142, 257.1428571428571, 257.1428571428571,
      171.42857142857142, 257.1428571428571, 257.1428571428571,
      257.1428571428571, 171.42857142857142, 342.85714285714283,
      257.1428571428571, 342.85714285714283, 171.42857142857142,
      514.2857142857142, 257.1428571428571, 514.2857142857142,
      257.1428571428571, 85.71428571428571, 342.85714285714283,
      85.71428571428571, 257.1428571428571, 171.42857142857142,
      342.85714285714283, 171.42857142857142, 342.85714285714283,
      257.1428571428571, 342.85714285714283, 342.85714285714283,
      257.1428571428571, 342.85714285714283, 342.85714285714283,
      342.85714285714283, 342.85714285714283, 342.85714285714283,
      342.85714285714283, 428.57142857142856, 257.1428571428571,
      428.57142857142856, 342.85714285714283, 428.57142857142856,
      342.85714285714283, 428.57142857142856, 342.85714285714283,
      514.2857142857142, 342.85714285714283, 85.71428571428571,
      428.57142857142856, 85.71428571428571, 342.85714285714283,
      171.42857142857142, 428.57142857142856, 171.42857142857142,
      342.85714285714283, 257.1428571428571, 428.57142857142856,
      257.1428571428571, 428.57142857142856, 342.85714285714283,
      428.57142857142856, 428.57142857142856, 342.85714285714283,
      514.2857142857142, 428.57142857142856, 514.2857142857142,
      514.2857142857142, 85.71428571428571, 514.2857142857142,
      171.42857142857142, 428.57142857142856, 171.42857142857142,
      514.2857142857142, 171.42857142857142, 514.2857142857142,
      171.42857142857142, 514.2857142857142, 257.1428571428571,
      514.2857142857142, 257.1428571428571, 514.2857142857142,
      342.85714285714283, 428.57142857142856, 342.85714285714283,
      514.2857142857142, 342.85714285714283, 514.2857142857142,
      428.57142857142856, 514.2857142857142, 514.2857142857142,
      428.57142857142856, 514.2857142857142, 514.2857142857142,
      514.2857142857142, 514.2857142857142, 428.57142857142856,
      599.9999999999999, 428.57142857142856,
    ];
    coordinatesArray = coordinatesArray.map((coord) => Math.abs(coord / 8));
    mazeLength = 600 / 8;
  } else if (difficulty == 3) {
    coordinatesArray = [
      40, 0, 600, 0, 600, 0, 600, 600, 560, 600, 0, 600, 0, 600, 0, 0, 40, 0,
      40, 40, 40, 40, 40, 80, 0, 120, 40, 120, 0, 160, 40, 160, 40, 200, 40,
      240, 40, 240, 40, 280, 40, 280, 40, 320, 0, 400, 40, 400, 40, 440, 40,
      480, 40, 480, 40, 520, 40, 520, 40, 560, 80, 40, 80, 80, 40, 80, 80, 80,
      40, 120, 80, 120, 80, 120, 80, 160, 80, 160, 80, 200, 40, 200, 80, 200,
      80, 240, 80, 280, 40, 320, 80, 320, 80, 320, 80, 360, 40, 360, 80, 360,
      40, 400, 80, 400, 40, 440, 80, 440, 80, 520, 80, 560, 40, 560, 80, 560,
      80, 40, 120, 40, 120, 80, 120, 120, 80, 120, 120, 120, 120, 160, 120, 200,
      120, 200, 120, 240, 80, 240, 120, 240, 80, 280, 120, 280, 120, 280, 120,
      320, 80, 360, 120, 360, 120, 360, 120, 400, 120, 400, 120, 440, 80, 480,
      120, 480, 120, 480, 120, 520, 80, 520, 120, 520, 120, 40, 160, 40, 120,
      80, 160, 80, 160, 120, 160, 160, 120, 160, 160, 160, 160, 200, 160, 240,
      120, 320, 160, 320, 160, 320, 160, 360, 160, 360, 160, 400, 120, 440, 160,
      440, 160, 440, 160, 480, 120, 480, 160, 480, 160, 520, 160, 560, 120, 560,
      160, 560, 160, 40, 200, 40, 200, 40, 200, 80, 200, 80, 200, 120, 160, 120,
      200, 120, 200, 120, 200, 160, 200, 160, 200, 200, 160, 200, 200, 200, 200,
      240, 200, 280, 160, 280, 200, 280, 160, 320, 200, 320, 200, 360, 200, 400,
      200, 400, 200, 440, 160, 440, 200, 440, 200, 480, 200, 520, 160, 520, 200,
      520, 200, 520, 200, 560, 240, 40, 240, 80, 240, 80, 240, 120, 240, 120,
      240, 160, 240, 160, 240, 200, 240, 200, 240, 240, 200, 240, 240, 240, 200,
      280, 240, 280, 200, 320, 240, 320, 240, 320, 240, 360, 240, 360, 240, 400,
      200, 440, 240, 440, 240, 480, 240, 520, 200, 560, 240, 560, 280, 0, 280,
      40, 240, 80, 280, 80, 280, 120, 280, 160, 280, 160, 280, 200, 280, 200,
      280, 240, 280, 240, 280, 280, 280, 280, 280, 320, 240, 320, 280, 320, 280,
      360, 280, 400, 280, 400, 280, 440, 240, 440, 280, 440, 280, 440, 280, 480,
      280, 480, 280, 520, 240, 520, 280, 520, 240, 560, 280, 560, 320, 40, 320,
      80, 280, 80, 320, 80, 280, 120, 320, 120, 320, 120, 320, 160, 320, 160,
      320, 200, 280, 240, 320, 240, 320, 280, 320, 320, 320, 320, 320, 360, 280,
      360, 320, 360, 280, 400, 320, 400, 320, 480, 320, 520, 320, 520, 320, 560,
      280, 560, 320, 560, 320, 40, 360, 40, 360, 40, 360, 80, 360, 80, 360, 120,
      360, 120, 360, 160, 320, 200, 360, 200, 320, 240, 360, 240, 320, 280, 360,
      280, 360, 280, 360, 320, 320, 360, 360, 360, 360, 400, 360, 440, 320, 440,
      360, 440, 320, 480, 360, 480, 320, 520, 360, 520, 360, 560, 360, 600, 360,
      80, 400, 80, 360, 160, 400, 160, 360, 200, 400, 200, 360, 240, 400, 240,
      400, 240, 400, 280, 360, 320, 400, 320, 400, 360, 400, 400, 400, 400, 400,
      440, 360, 440, 400, 440, 360, 480, 400, 480, 360, 520, 400, 520, 400, 520,
      400, 560, 400, 40, 440, 40, 400, 80, 440, 80, 440, 80, 440, 120, 400, 120,
      440, 120, 400, 160, 440, 160, 400, 200, 440, 200, 440, 240, 440, 280, 400,
      280, 440, 280, 400, 320, 440, 320, 440, 320, 440, 360, 400, 360, 440, 360,
      440, 400, 440, 440, 440, 440, 440, 480, 400, 480, 440, 480, 440, 520, 440,
      560, 440, 560, 440, 600, 440, 40, 480, 40, 480, 40, 480, 80, 440, 120,
      480, 120, 480, 120, 480, 160, 480, 160, 480, 200, 440, 240, 480, 240, 480,
      280, 480, 320, 440, 320, 480, 320, 480, 360, 480, 400, 440, 400, 480, 400,
      480, 440, 480, 480, 480, 480, 480, 520, 440, 520, 480, 520, 480, 520, 480,
      560, 520, 0, 520, 40, 480, 80, 520, 80, 520, 80, 520, 120, 480, 160, 520,
      160, 520, 160, 520, 200, 520, 200, 520, 240, 480, 240, 520, 240, 520, 240,
      520, 280, 480, 320, 520, 320, 480, 360, 520, 360, 520, 360, 520, 400, 520,
      400, 520, 440, 480, 480, 520, 480, 480, 560, 520, 560, 560, 40, 560, 80,
      520, 80, 560, 80, 560, 120, 560, 160, 520, 160, 560, 160, 560, 240, 560,
      280, 520, 280, 560, 280, 520, 320, 560, 320, 560, 320, 560, 360, 520, 400,
      560, 400, 520, 440, 560, 440, 560, 440, 560, 480, 560, 480, 560, 520, 520,
      520, 560, 520, 520, 560, 560, 560, 560, 80, 600, 80, 560, 200, 600, 200,
      560, 400, 600, 400,
    ];
    coordinatesArray = coordinatesArray.map((coord) => Math.abs(coord / 4));
    mazeLength = 600 / 4;
  }
}

//Reduce maze dimensions

const wallsGeometry = {};
const wallMaterials = {};
const wallMeshes = {};
const wallBoxes = {};

// Configure textures
const loader = new THREE.TextureLoader();

const wallTtexture = [
  loader.load("../../assets/wallText/Stylized_Sci-fi_Wall_001_basecolor.jpg"),
  loader.load("../../assets/wallText/Stylized_Sci-fi_Wall_001_normal.jpg"),
  loader.load(
    "../../assets/wallText/Stylized_Sci-fi_Wall_001_ambientOcclusion.jpg"
  ),
];

const wallTtexture2 = [
  loader.load("../../assets/wallText/Stylized_Sci-fi_Wall_001_basecolor.jpg"),
  loader.load("../../assets/wallText/Stylized_Sci-fi_Wall_001_normal.jpg"),
  loader.load(
    "../../assets/wallText/Stylized_Sci-fi_Wall_001_ambientOcclusion.jpg"
  ),
];

const wallTtexture3 = [
  loader.load("../../assets/wallText/Stylized_Sci-fi_Wall_001_basecolor.jpg"),
  loader.load("../../assets/wallText/Stylized_Sci-fi_Wall_001_normal.jpg"),
  loader.load(
    "../../assets/wallText/Stylized_Sci-fi_Wall_001_ambientOcclusion.jpg"
  ),
];

let floorBaseColor, floorAmbientOcclusion, floorHeight, floorNormal;

let floorTextures = [
  (floorBaseColor = loader.load("assets/floorText/Concrete_017_baseColor.jpg")),
  (floorAmbientOcclusion = loader.load(
    "assets/floorText/Concrete_017_ambientOcclusion.jpg"
  )),
  (floorNormal = loader.load("assets/floorText/Concrete_017_normal.jpg")),
  (floorHeight = loader.load("assets/floorText/Concrete_017_height.png")),
];

floorTextures.forEach((texture) => {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(30, 30);
});

let ceilingBaseColor, ceilingAmbientOcclusion, ceilingHeight, ceilingNormal;

const ceilingTextures = [
  (ceilingBaseColor = loader.load(
    "../../assets/ceilingText/Concrete_Ceiling_002_basecolor.jpg"
  )),
  (ceilingNormal = loader.load(
    "../../assets/ceilingText/Concrete_Ceiling_002_normal.jpg"
  )),
  (ceilingHeight = loader.load(
    "../../assets/ceilingText/Concrete_Ceiling_002_height.png"
  )),
  (ceilingAmbientOcclusion = loader.load(
    "../../assets/ceilingText/Concrete_Ceiling_002_ambientOcclusion.jpg"
  )),
];

ceilingTextures.forEach((texture) => {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(difficulty * 2, difficulty * 2);
});

const background = loader.load(
  "assets/High_resolution_wallpaper_background_ID_77701837927.png"
);

// Draw the maze
function maze(scene) {
  const height = 7;
  const width = 1;

  const invisibleWallGeometry = new THREE.BoxGeometry(10, height, 0.1);
  const invisibleWallMaterial = new THREE.MeshBasicMaterial({
    wireframe: true,
  });

  const invisibleWallStartMesh = new THREE.Mesh(
    invisibleWallGeometry,
    invisibleWallMaterial
  );
  invisibleWallStartMesh.position.set(-5, 3.5, 0);
  wallMeshes[coordinatesArray.length] = invisibleWallStartMesh;

  const invisibleWallEndMesh = new THREE.Mesh(
    invisibleWallGeometry,
    invisibleWallMaterial
  );
  invisibleWallEndMesh.position.set(-mazeLength + 5, 3.5, -mazeLength);
  wallMeshes[coordinatesArray.length + 1] = invisibleWallEndMesh;

  for (let i = 0, j = 0; i < coordinatesArray.length; i += 4, j++) {
    // Initialize wall boxes
    wallBoxes[j] = new THREE.Box3();

    const length = Math.max(
      Math.abs(coordinatesArray[i] - coordinatesArray[i + 2]),
      Math.abs(coordinatesArray[i + 1] - coordinatesArray[i + 3])
    );

    wallsGeometry[j] = new THREE.BoxGeometry(length, height, width, 64, 64);

    let activeTexture;
    if (length <= 20) {
      activeTexture = wallTtexture;
    } else {
      wallTtexture2.forEach((texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(length / 20, 1);
      });
      activeTexture = wallTtexture2;
    }

    wallTtexture3.forEach((texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(0.2, 1);
    });

    wallMaterials[j] = [
      new THREE.MeshStandardMaterial({
        map: wallTtexture3[0],
        normalMap: wallTtexture3[1],
        aoMap: wallTtexture3[2],
        aoMapIntensity: 1.5,
      }),
      new THREE.MeshStandardMaterial({
        map: wallTtexture3[0],
        normalMap: wallTtexture3[1],
        aoMap: wallTtexture3[2],
        aoMapIntensity: 1.5,
      }), //left side
      new THREE.MeshBasicMaterial({ color: "#ffffff" }), //top side
      new THREE.MeshBasicMaterial({ color: "#ffffff" }), //bottom side
      new THREE.MeshStandardMaterial({
        map: activeTexture[0],
        normalMap: activeTexture[1],
        aoMap: activeTexture[2],
        aoMapIntensity: 1.5,
      }), //front side
      new THREE.MeshStandardMaterial({
        map: activeTexture[0],
        normalMap: activeTexture[1],
        aoMap: activeTexture[2],
        aoMapIntensity: 1.5,
      }), //back side
    ];

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
  scene.add(wallMeshes[coordinatesArray.length]);
  scene.add(wallMeshes[coordinatesArray.length + 1]);
  wallBoxes[coordinatesArray.length] = wallBoxes[coordinatesArray.length + 1] =
    new THREE.Box3();
}

// Draw the floor
function floor(scene) {
  const floorGeometry = new THREE.PlaneGeometry(mazeLength + 2, mazeLength + 2);
  const floorMaterial = new THREE.MeshStandardMaterial({
    map: floorBaseColor,
    side: THREE.DoubleSide,
    normalMap: floorNormal,
    aoMap: floorAmbientOcclusion,
    aoMapIntensity: 5,
  });
  const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
  floorMesh.rotation.x = Math.PI / 2; // Rotate the floor to be horizontal
  floorMesh.position.x = -mazeLength / 2;
  floorMesh.position.z = -mazeLength / 2;
  scene.add(floorMesh);

  const ceilingGeometry = new THREE.BoxGeometry(
    mazeLength + 2,
    3,
    mazeLength + 2,
    1024,
    1024
  );
  const ceilingMaterial = new THREE.MeshStandardMaterial({
    map: ceilingBaseColor,
    normalMap: ceilingNormal,
    displacementMap: ceilingHeight,
    displacementScale: 0.4,
    aoMap: ceilingAmbientOcclusion,
    aoMapIntensity: 1.5,
  });
  const ceilingMesh = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
  ceilingMesh.position.set(-mazeLength / 2, 8.5, -mazeLength / 2);

  scene.add(ceilingMesh);
}

export function generateScene(scene) {
  maze(scene);
  floor(scene);
  scene.background = background;
}

// Calculate if a given box is colliding with Map objects
export function isObjectColliding(box) {
  const collidingObjects = [];
  for (let i = 0, j = 0; i < coordinatesArray.length; i += 4, j++) {
    wallBoxes[j]
      .copy(wallMeshes[j].geometry.boundingBox)
      .applyMatrix4(wallMeshes[j].matrixWorld);
    if (box.intersectsBox(wallBoxes[j])) {
      collidingObjects.push([
        coordinatesArray[i],
        coordinatesArray[i + 1],
        coordinatesArray[i + 2],
        coordinatesArray[i + 3],
      ]);
    }
  }
  return collidingObjects;
}
