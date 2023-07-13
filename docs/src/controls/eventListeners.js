// Keyboard input
const clickableKeys = {
  KeyW: { code: "KeyW", color: 0xff0000 },
  KeyS: { code: "KeyS", color: 0x00ff00 },
  KeyA: { code: "KeyA", color: 0x0000ff },
  KeyD: { code: "KeyD", color: 0xffff00 },
  ShiftLeft: { code: "ShiftLeft", color: 0xff00ff },
  Space: { code: "Space", color: 0x00ffff },
};

const pressableKeys = {
  KeyE: { code: "KeyE", color: 0xffff00 },
  KeyF: { code: "KeyF", color: 0xffff00 },
};

const activeKeys = {};

//Event listeners
document.addEventListener("keydown", (event) => {
  if (event.code in clickableKeys) {
    activeKeys[event.code] = true;
  }
});

document.addEventListener("keyup", (event) => {
  if (event.code in clickableKeys) {
    delete activeKeys[event.code];
  }
});

document.addEventListener("keypress", (event) => {
  if (event.code in pressableKeys) {
    activeKeys[event.code] = true;
  }
});

// Timer
let seconds = 0;
let minutes = 0;
let timerElement;
export function initTimer() {
  timerElement = document.createElement("div");
  timerElement.id = "timer";
  timerElement.textContent = "0:00";
  timerElement.style.display = "none";
  document.body.appendChild(timerElement);
}

function updateTimer() {
  let formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  timerElement.textContent = `${minutes}:${formattedSeconds}`;
}

export function deleteTimer() {
  document.body.removeChild(timerElement);
}

let timerIntervalId;
export function startTimer() {
  timerElement.style.display = "block";
  timerIntervalId = setInterval(() => {
    seconds++;
    if (seconds === 60) {
      seconds = 0;
      minutes++;
    }
    updateTimer();
  }, 1000);
}

export function pauseTimer() {
  clearInterval(timerIntervalId);
}

export { activeKeys };

export function loadWinMenu() {
  document.getElementById("winMenu").style.display = "block";
  document.getElementById("canvas").style.display = "none";
  pauseTimer();
  document.getElementById("winTime").innerText =
    "Your time:\n" + minutes + " : " + seconds;
  document.body.removeChild(timerElement);
}
