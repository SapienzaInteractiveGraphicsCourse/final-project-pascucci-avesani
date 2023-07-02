export class EventListener {
  constructor(character, cameraControls) {
    this.character = character;
    this.cameraControls = cameraControls;
    this.keys = {};
  }

  onKeyDown(event) {
    this.keys[event.code] = true;

    if (this.keys["Space"]) {
      this.character.jump();
    }

    if (this.keys["KeyW"]) {
      this.character.moveForward();
      this.cameraControls.moveForward();
    }
    if (this.keys["KeyA"]) {
      this.character.moveLeft();
      this.cameraControls.moveLeft();
    }
    if (this.keys["KeyS"]) {
      this.character.moveBackward();
      this.cameraControls.moveBackward();
    }
    if (this.keys["KeyD"]) {
      this.character.moveRignt();
      this.cameraControls.moveRight();
    }
    if (this.keys["ShiftLeft"]) {
      this.character.setSprint();
    }
  }

  onKeyUp(event) {
    if (this.keys["ShiftLeft"]) {
      this.character.unsetSprint();
    }
    this.keys[event.code] = false;
  }

  onWheel(event) {
    this.cameraControls.handleWheel(event);
  }
  onMouseDown(event) {
    this.cameraControls.handleMouseDown(event);
  }
  onMouseUp(event) {
    this.cameraControls.handleMouseUp(event);
  }
  onMouseMove(event) {
    this.cameraControls.handleMouseMove(event);
  }
}
