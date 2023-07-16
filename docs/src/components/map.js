import * as THREE from "three";
import { GLTFLoader } from "GLTFLoader";

var coordinatesArray;
var mazeLength;

let loader;
let modelLoader = new GLTFLoader();

let wallsGeometry = {};
let wallMaterials = {};
let wallMeshes = {};
let wallTtexture, wallTtexture2, wallTtexture3;
let invisibleWallStartMesh;
let invisibleWallEndMesh, invisibleWallEndMesh2;
let endWallMaterial, endWallMaterial2;
let wallBoxes = {};
let startWallBox = new THREE.Box3();

let floorTextures;
let floorBaseColor, floorAmbientOcclusion, floorHeight, floorNormal;

let ceilingTextures;
let ceilingBaseColor, ceilingAmbientOcclusion, ceilingHeight, ceilingNormal;

let background;
let ceilingLight;
let lightButton;
let lightsPositions = [];
let buttonsPositions = [];
let buttonBoxes = {};
let buttonMeshes = {};

const lights = {};

function initScene(mode) {
  if (!mode) {
    //to handle
  } else {
    if (mode == 1) {
      coordinatesArray = [
        120, 0, 600, 0, 600, 0, 600, 600, 480, 600, 0, 600, 0, 600, 0, 0, 0,
        120, 120, 120, 120, 120, 120, 240, 120, 240, 120, 360, 120, 360, 120,
        480, 120, 120, 240, 120, 240, 240, 240, 360, 240, 360, 240, 480, 360, 0,
        360, 120, 360, 120, 360, 240, 240, 240, 360, 240, 240, 480, 360, 480,
        360, 240, 480, 240, 360, 360, 480, 360, 480, 360, 480, 480, 480, 480,
        480, 600, 480, 120, 600, 120,
      ];
      coordinatesArray = coordinatesArray.map((coord) => Math.abs(coord / 12));
      mazeLength = 600 / 12;
    } else if (mode == 2) {
      coordinatesArray = [
        85.71428571428571, 0, 600, 0, 600, 0, 600, 600, 514.2857142857143, 600,
        0, 600, 0, 600, 0, 0, 85.71428571428571, 0, 85.71428571428571,
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
    } else if (mode == 3) {
      coordinatesArray = [
        60, 0, 600, 0, 600, 0, 600, 600, 540, 600, 0, 600, 0, 600, 0, 0, 60, 0,
        60, 60, 0, 120, 60, 120, 60, 120, 60, 180, 60, 180, 60, 240, 60, 300,
        60, 360, 0, 420, 60, 420, 60, 480, 60, 540, 60, 60, 120, 60, 120, 60,
        120, 120, 120, 120, 120, 180, 120, 180, 120, 240, 120, 240, 120, 300,
        60, 300, 120, 300, 60, 360, 120, 360, 60, 420, 120, 420, 60, 480, 120,
        480, 120, 480, 120, 540, 180, 120, 180, 180, 180, 180, 180, 240, 180,
        240, 180, 300, 120, 360, 180, 360, 120, 420, 180, 420, 120, 540, 180,
        540, 180, 60, 240, 60, 240, 60, 240, 120, 240, 120, 240, 180, 240, 180,
        240, 240, 180, 300, 240, 300, 240, 300, 240, 360, 180, 360, 240, 360,
        180, 420, 240, 420, 180, 480, 240, 480, 180, 540, 240, 540, 240, 540,
        240, 600, 240, 60, 300, 60, 300, 120, 300, 180, 300, 180, 300, 240, 240,
        240, 300, 240, 240, 300, 300, 300, 300, 360, 300, 420, 240, 420, 300,
        420, 240, 480, 300, 480, 300, 480, 300, 540, 300, 60, 360, 60, 300, 120,
        360, 120, 300, 240, 360, 240, 300, 300, 360, 300, 360, 300, 360, 360,
        300, 420, 360, 420, 360, 420, 360, 480, 300, 480, 360, 480, 360, 60,
        420, 60, 360, 120, 420, 120, 360, 180, 420, 180, 420, 180, 420, 240,
        420, 300, 420, 360, 360, 360, 420, 360, 360, 420, 420, 420, 420, 480,
        420, 540, 360, 540, 420, 540, 420, 540, 420, 600, 480, 0, 480, 60, 420,
        120, 480, 120, 480, 120, 480, 180, 420, 240, 480, 240, 420, 300, 480,
        300, 480, 360, 480, 420, 420, 420, 480, 420, 480, 420, 480, 480, 480,
        480, 480, 540, 480, 60, 540, 60, 480, 120, 540, 120, 540, 180, 540, 240,
        480, 240, 540, 240, 540, 240, 540, 300, 480, 300, 540, 300, 480, 360,
        540, 360, 540, 360, 540, 420, 540, 480, 540, 540, 540, 120, 600, 120,
        540, 480, 600, 480,
      ];
      coordinatesArray = coordinatesArray.map((coord) => Math.abs(coord / 5));
      mazeLength = 600 / 5;
    }
  }
  //Reduce maze dimensions

  // Configure textures
  loader = new THREE.TextureLoader();

  wallTtexture = [
    loader.load("./assets/wallText/Stylized_Sci-fi_Wall_001_basecolor.jpg"),
    loader.load("./assets/wallText/Stylized_Sci-fi_Wall_001_normal.jpg"),
    loader.load(
      "./assets/wallText/Stylized_Sci-fi_Wall_001_ambientOcclusion.jpg"
    ),
  ];

  wallTtexture2 = [
    loader.load("./assets/wallText/Stylized_Sci-fi_Wall_001_basecolor.jpg"),
    loader.load("./assets/wallText/Stylized_Sci-fi_Wall_001_normal.jpg"),
    loader.load(
      "./assets/wallText/Stylized_Sci-fi_Wall_001_ambientOcclusion.jpg"
    ),
  ];

  wallTtexture3 = [
    loader.load("./assets/wallText/Stylized_Sci-fi_Wall_001_basecolor.jpg"),
    loader.load("./assets/wallText/Stylized_Sci-fi_Wall_001_normal.jpg"),
    loader.load(
      "./assets/wallText/Stylized_Sci-fi_Wall_001_ambientOcclusion.jpg"
    ),
  ];

  floorTextures = [
    (floorBaseColor = loader.load(
      "./assets/floorText/Concrete_017_basecolor.jpg"
    )),
    (floorAmbientOcclusion = loader.load(
      "./assets/floorText/Concrete_017_ambientOcclusion.jpg"
    )),
    (floorNormal = loader.load("./assets/floorText/Concrete_017_normal.jpg")),
    (floorHeight = loader.load("./assets/floorText/Concrete_017_height.png")),
  ];

  floorTextures.forEach((texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(30, 30);
  });

  ceilingTextures = [
    (ceilingBaseColor = loader.load(
      "./assets/ceilingText/Concrete_Ceiling_002_basecolor.jpg"
    )),
    (ceilingNormal = loader.load(
      "./assets/ceilingText/Concrete_Ceiling_002_normal.jpg"
    )),
    (ceilingHeight = loader.load(
      "./assets/ceilingText/Concrete_Ceiling_002_height.png"
    )),
    (ceilingAmbientOcclusion = loader.load(
      "./assets/ceilingText/Concrete_Ceiling_002_ambientOcclusion.jpg"
    )),
  ];

  ceilingTextures.forEach((texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(mode * 2, mode * 2);
  });

  background = loader.load("./assets/sky_background.png");
}

// Draw the maze
function maze(scene, mode) {
  const height = 7;
  const width = 1;

  let portalTexture = loader.load("./assets/portal.gif");
  const invisibleWallGeometry = new THREE.BoxGeometry(13, 10, 1, 64, 64);
  const invisibleWallMaterial = new THREE.MeshBasicMaterial({
    visible: false,
  });

  invisibleWallStartMesh = new THREE.Mesh(
    invisibleWallGeometry,
    invisibleWallMaterial
  );
  invisibleWallStartMesh.position.set(-6.5, 5, 0);
  wallMeshes[coordinatesArray.length] = invisibleWallStartMesh;
  invisibleWallStartMesh.geometry.computeBoundingBox();
  const startLight = new THREE.PointLight(0x00ffff, 1, 10);
  startLight.position.copy(invisibleWallStartMesh.position);
  scene.add(startLight);

  endWallMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    transparent: true,
    side: THREE.DoubleSide,
    alphaTest: 0.5,
  });

  endWallMaterial.alphaMap = portalTexture;
  endWallMaterial.alphaMap.magFilter = THREE.NearestFilter;

  endWallMaterial2 = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    transparent: true,
    side: THREE.DoubleSide,
    alphaTest: 0.5,
  });

  endWallMaterial2.alphaMap = portalTexture;
  endWallMaterial2.alphaMap.magFilter = THREE.NearestFilter;

  invisibleWallEndMesh = new THREE.Mesh(invisibleWallGeometry, endWallMaterial);
  invisibleWallEndMesh.position.set(-mazeLength + 5, 3, -mazeLength);
  invisibleWallEndMesh2 = new THREE.Mesh(
    invisibleWallGeometry,
    endWallMaterial2
  );
  invisibleWallEndMesh2.position.set(-mazeLength + 5, 3, -mazeLength + 0.5);
  const endWallBackground = new THREE.Mesh(
    invisibleWallGeometry,
    new THREE.MeshBasicMaterial({ map: portalTexture })
  );
  endWallBackground.position.set(-mazeLength + 5, 3, -mazeLength - 1);
  const portalLight = new THREE.PointLight(0x00ffff, 1, 8);
  portalLight.position.copy(invisibleWallEndMesh.position);
  portalLight.position.z += 2;
  scene.add(invisibleWallEndMesh);
  scene.add(invisibleWallEndMesh2);
  scene.add(portalLight);
  scene.add(endWallBackground);

  coordinatesArray.push(0, 0, 10, 0);

  for (let i = 0, j = 0; i < coordinatesArray.length; i += 4, j++) {
    // Initialize wall boxes
    wallBoxes[j] = new THREE.Box3();

    const length = Math.max(
      Math.abs(coordinatesArray[i] - coordinatesArray[i + 2]),
      Math.abs(coordinatesArray[i + 1] - coordinatesArray[i + 3])
    );

    wallsGeometry[j] = new THREE.BoxGeometry(length + 0.5, height, width, 1, 1);

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
      new THREE.MeshPhongMaterial({
        map: wallTtexture3[0],
        normalMap: wallTtexture3[1],
        aoMap: wallTtexture3[2],
        aoMapIntensity: 1.5,
      }),
      new THREE.MeshPhongMaterial({
        map: wallTtexture3[0],
        normalMap: wallTtexture3[1],
        aoMap: wallTtexture3[2],
        aoMapIntensity: 1.5,
      }), //left side
      new THREE.MeshBasicMaterial({ color: "#ffffff" }), //top side
      new THREE.MeshBasicMaterial({ color: "#ffffff" }), //bottom side
      new THREE.MeshPhongMaterial({
        map: activeTexture[0],
        normalMap: activeTexture[1],
        aoMap: activeTexture[2],
        aoMapIntensity: 1.5,
      }), //front side
      new THREE.MeshPhongMaterial({
        map: activeTexture[0],
        normalMap: activeTexture[1],
        aoMap: activeTexture[2],
        aoMapIntensity: 1.5,
      }), //back side
    ];

    wallMeshes[j] = new THREE.Mesh(wallsGeometry[j], wallMaterials[j]);
    if (i == coordinatesArray.length - 4) {
      wallMeshes[j] = invisibleWallStartMesh;
    }

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

    if (mode == 1) {
      wallMeshes[j].castShadow = true;
      wallMeshes[j].receiveShadow = true;
    }
    scene.add(wallMeshes[j]);
  }
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
  floorMesh.castShadow = false;
  floorMesh.receiveShadow = true;
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

function loadLightModel() {
  modelLoader.load(
    "./assets/ceilingLight.glb",
    function (glb) {
      ceilingLight = glb.scene;
    },
    function () {
      document.getElementById("loadingStatus").innerText =
        " loading ceiling light";
    },
    function (error) {
      console.error(error);
    }
  );
  modelLoader.load(
    "./assets/lightbutton.glb",
    function (glb) {
      lightButton = glb.scene;
      lightButton.scale.set(0.3, 0.3, 0.3);
      lightButton.rotateZ(Math.PI);
    },
    function () {
      document.getElementById("loadingStatus").innerText =
        " loading light switch button";
    },
    function (error) {
      console.log(error);
    }
  );
}

function addLights(scene, mode) {
  const interval = setInterval(checkCondition, 1000);
  loadLightModel(scene);
  function checkCondition() {
    if (ceilingLight && lightButton) {
      clearInterval(interval);
      insertLights(scene, mode);
    }
  }
}

function insertLights(scene, mode) {
  const height = 6.5;
  const light = new THREE.PointLight(0xffffff, 0.5, 20);
  const positions = [];
  const Bheight = 1.5;
  const Bpositions = [];

  for (let i = 0; i < coordinatesArray.length; i += 4) {
    let zPosition, xPosition, BzPosition, BxPosition;
    let rotate = false;

    if (coordinatesArray[i] === coordinatesArray[i + 2]) {
      zPosition = -(coordinatesArray[i + 1] + coordinatesArray[i + 3]) / 2;
      xPosition = -coordinatesArray[i] - 5.5;
      BzPosition = zPosition;
      BxPosition = -coordinatesArray[i] - 0.7;
    } else if (coordinatesArray[i + 1] === coordinatesArray[i + 3]) {
      zPosition = -(coordinatesArray[i] + coordinatesArray[i + 2]) / 2;
      xPosition = -coordinatesArray[i + 1] - 5.5;
      rotate = true;
    }

    if (!positions.includes(xPosition) || !positions.includes(zPosition)) {
      positions.push(zPosition, xPosition);
      Bpositions.push(xPosition, zPosition);

      lightsPositions[i] = ceilingLight.clone(true);
      if (rotate) lightsPositions[i].rotateY(Math.PI / 2);
      lightsPositions[i].position.set(xPosition, height, zPosition);
      scene.add(lightsPositions[i]);

      buttonsPositions[i] = lightButton.clone(true);
      buttonsPositions[i].position.set(BxPosition, Bheight, BzPosition);

      buttonMeshes[i] = new THREE.Mesh(
        new THREE.BoxGeometry(2, 1, 2),
        new THREE.MeshBasicMaterial({ color: 0xffffff, visible: false })
      );
      buttonMeshes[i].position.set(BxPosition, Bheight, BzPosition);
      buttonMeshes[i].geometry.computeBoundingBox();
      buttonBoxes[i] = new THREE.Box3();

      scene.add(buttonsPositions[i], buttonMeshes[i]);

      lights[i] = light.clone();
      lights[i].position.set(xPosition, height, zPosition);
      if (mode == 1) lights[i].castShadow = true;
      scene.add(lights[i]);
    }
  }
}

export function generateScene(scene, mode) {
  initScene(mode);
  maze(scene, mode);
  floor(scene);
  addLights(scene, mode);

  scene.background = background;
}

export function isLightSwichColliding(box) {
  for (let i = 1; i < buttonsPositions.length; i++) {
    const buttonBox = buttonBoxes[i];
    const buttonMesh = buttonMeshes[i];
    if (buttonBox && buttonMesh) {
      buttonBox
        .copy(buttonMesh.geometry.boundingBox)
        .applyMatrix4(buttonMesh.matrixWorld);
      if (box.intersectsBox(buttonBox)) {
        lights[i].intensity = lights[i].intensity > 0 ? 0 : 1;
      }
    }
  }
}

const clock = new THREE.Clock();
// Calculate if a given box is colliding with Map objects
export function isMazeWallColliding(box) {
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
  startWallBox
    .copy(invisibleWallStartMesh.geometry.boundingBox)
    .applyMatrix4(invisibleWallStartMesh.matrixWorld);

  invisibleWallEndMesh2.rotateZ(clock.getDelta() * 2);
  invisibleWallEndMesh.rotateZ(clock.getDelta());

  return collidingObjects;
}

export var mazeLength;
