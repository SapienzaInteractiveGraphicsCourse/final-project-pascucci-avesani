var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;

function onMouseMove(event, pov, camera) {
  var deltaX = event.clientX - lastMouseX;
  var deltaY = event.clientY - lastMouseY;

  if (!mouseDown) {
    pov.x -= deltaX * 0.01;
    pov.y += deltaY * 0.01;
    camera.position.copy(pov);
  } else {
    camera.rotation.y += deltaX * 0.01;
    camera.rotation.x += deltaY * 0.01;
  }

  lastMouseX = event.clientX;
  lastMouseY = event.clientY;
}

function onMouseDown() {
  mouseDown = true;
}

function onMouseUp() {
  mouseDown = false;
}

function onWheel(event, pov, camera) {
  var delta = event.deltaY;
  pov.z += delta * 0.01;
  camera.position.copy(pov);
}
