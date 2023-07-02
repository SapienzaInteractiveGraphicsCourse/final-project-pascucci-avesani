export class EventListener {
  constructor(character) {
    this.character = character;

    this.keys = {};
  }

  onKeyDown(event) {
    this.keys[event.code] = true;

    if (this.keys["Space"]) {
      this.character.jump();
    }
    if (this.keys["KeyW"]) {
      this.character.moveForward();
    }
    if (this.keys["KeyA"]) {
      this.character.moveLeft();
    }
    if (this.keys["KeyS"]) {
      this.character.moveBackward();
    }
    if (this.keys["KeyD"]) {
      this.character.moveRignt();
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
}
