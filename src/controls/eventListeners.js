
// Keyboard input
const clickableKeys = {
  KeyW: { code: "KeyW", color: 0xff0000 },
  KeyS: { code: "KeyS", color: 0x00ff00 },
  KeyA: { code: "KeyA", color: 0x0000ff },
  KeyD: { code: "KeyD", color: 0xffff00 },
  ShiftLeft: { code: "ShiftLeft", color: 0xff00ff },
  Space: { code: "Space", color: 0x00ffff }
};


const keyElements = {};
const keyContainer = document.createElement("div");
keyContainer.style.position = "fixed";
keyContainer.style.top = "10px";
keyContainer.style.left = "10px";
keyContainer.style.fontSize = "20px";
keyContainer.style.color = "green";
document.body.appendChild(keyContainer);

for (const key in clickableKeys) {
  const keyElement = document.createElement("span");
  keyElement.textContent = key;
  keyElement.style.marginRight = "10px";
  keyElement.style.color = "green";
  keyContainer.appendChild(keyElement);
  keyElements[key] = keyElement;
}

const activeKeys = {};

//Event listeners
document.addEventListener("keydown", (event) => {
  if (event.code in clickableKeys) {
    activeKeys[event.code] = true;
    updateKeyDisplay();
  }
});

document.addEventListener("keyup", (event) => {
  if (event.code in clickableKeys) {
    delete activeKeys[event.code];
    updateKeyDisplay();
  }
});

function updateKeyDisplay() {
  for (const key in clickableKeys) {
    if (key in activeKeys) {
      keyElements[key].style.color = "red";
    } else {
      keyElements[key].style.color = "green";
    }
  }
}

export {activeKeys}

