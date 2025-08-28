document.addEventListener("DOMContentLoaded", () => {
  initCopyrightYear();
  initPomodoroTimer();
  initPopupMenu();
  initTodoList();
});

// COPYRIGHT TIME
const year = document.getElementById("year");
const thisYear = new Date().getFullYear();
year.setAttribute("datetime", thisYear);
year.textContent = thisYear;

// TIMER

const displays = {
  pomodoro: document.getElementById("pomodoro_timer"),
  short: document.getElementById("short_timer"),
  long: document.getElementById("long_timer"),
};

const durations = {
  pomodoro: 25 * 60 * 1000,
  short: 5 * 60 * 1000,
  long: 10 * 60 * 1000,
};

let currentMode = "pomodoro";
let timer = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;

// Hide all timers except the current mode display
function updateDisplayVisibility() {
  for (const mode in displays) {
    if (mode === currentMode) {
      displays[mode].style.display = "block";
    } else {
      displays[mode].style.display = "none";
    }
  }
}
updateDisplayVisibility();

function start() {
  if (!isRunning) {
    startTime = Date.now() - elapsedTime;
    timer = setInterval(update, 100);
    isRunning = true;
  }
}

function stop() {
  if (isRunning) {
    clearInterval(timer);
    elapsedTime = Date.now() - startTime;
    isRunning = false;
  }
}

function reset() {
  clearInterval(timer);
  elapsedTime = 0;
  isRunning = false;
  updateDisplayText(durations[currentMode]);
}

function update() {
  elapsedTime = Date.now() - startTime;
  let remainingTime = durations[currentMode] - elapsedTime;

  if (remainingTime <= 0) {
    clearInterval(timer);
    isRunning = false;
    updateDisplayText(0);
    return;
  }
  updateDisplayText(remainingTime);
}

function updateDisplayText(ms) {
  let minutes = Math.floor((ms / (1000 * 60)) % 60);
  let seconds = Math.floor((ms / 1000) % 60);

  minutes = String(minutes).padStart(2, "0");
  seconds = String(seconds).padStart(2, "0");

  displays[currentMode].textContent = `${minutes}:${seconds}`;
}

// Handle mode button clicks
document.getElementById("pomodoro_session").addEventListener("click", () => {
  if (currentMode !== "pomodoro") {
    switchMode("pomodoro");
  }
});

document.getElementById("short_break").addEventListener("click", () => {
  if (currentMode !== "short") {
    switchMode("short");
  }
});

document.getElementById("long_break").addEventListener("click", () => {
  if (currentMode !== "long") {
    switchMode("long");
  }
});

function switchMode(mode) {
  stop();
  elapsedTime = 0;
  currentMode = mode;
  updateDisplayVisibility();
  updateDisplayText(durations[currentMode]);
}

// POPUP SETTINGS

const popupDiv = document.getElementById("popup_bg");
function openPopupMenu() {
  popupDiv.classList.add("show");
}
function closePopupMenu() {
  popupDiv.classList.remove("show");
}

//

// DRAGGABLE SETTING Commented out just to test functionality before fixing

// dragElement(document.getElementById("popup_main_div"));

// function dragElement(elmnt) {
//   var pos1 = 0,
//     pos2 = 0,
//     pos3 = 0,
//     pos4 = 0;
//   if (document.getElementById(elmnt.id + "settings_div")) {
//     // if present, the header is where you move the DIV from:
//     document.getElementById(elmnt.id + "settings_div").onmousedown =
//       dragMouseDown;
//   } else {
//     // otherwise, move the DIV from anywhere inside the DIV:
//     elmnt.onmousedown = dragMouseDown;
//   }

//   function dragMouseDown(e) {
//     e = e || window.event;
//     e.preventDefault();
//     pos3 = e.clientX;
//     pos4 = e.clientY;
//     document.onmouseup = closeDragElement;
//     document.onmousemove = elementDrag;
//   }

//   function elementDrag(e) {
//     e = e || window.event;
//     e.preventDefault();
//     pos1 = pos3 - e.clientX;
//     pos2 = pos4 - e.clientY;
//     pos3 = e.clientX;
//     pos4 = e.clientY;
//     elmnt.style.top = elmnt.offsetTop - pos2 + "px";
//     elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
//   }

//   function closeDragElement() {
//     document.onmouseup = null;
//     document.onmousemove = null;
//   }
// }

const backgroundSelect = document.getElementById("background");

backgroundSelect.addEventListener("change", function () {
  // Remove existing background classes
  document.body.classList.remove(
    "background1",
    "background2",
    "background3",
    "background4"
  );

  // Add selected background class
  const selected = this.value;
  document.body.classList.add(selected);

  // Optional: Save preference to localStorage
  localStorage.setItem("selectedBackground", selected);
});

// Load previously selected background on page load
window.addEventListener("DOMContentLoaded", function () {
  const savedBackground = localStorage.getItem("selectedBackground");
  if (savedBackground) {
    document.body.classList.add(savedBackground);
    backgroundSelect.value = savedBackground;
  }
});

// TO-DO LIST

// POPUP TASKS
const popupTask = document.getElementById("todo_app");
function openPopupTask() {
  popupTask.classList.add("show");
}

function closePopupTask() {
  popupTask.classList.remove("show");
}

// POPUP TEXT

const inputBox = document.getElementById("input_box");
const listContainer = document.getElementById("list_container");

function addTask() {
  if (inputBox.value === "") {
    alert("Please add a task!");
  } else {
    let li = document.createElement("li");
    li.innerHTML = inputBox.value;
    listContainer.appendChild(li);
    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);
  }
  inputBox.value = "";
  saveData();
}

listContainer.addEventListener(
  "click",
  function (e) {
    if (e.target.tagName === "LI") {
      e.target.classList.toggle("checked");
      saveData();
    } else if (e.target.tagName === "SPAN") {
      e.target.parentElement.remove();
      saveData();
    }
  },
  false
);

function saveData() {
  localStorage.setItem("data", listContainer.innerHTML);
}

function showTask() {
  listContainer.innerHTML = localStorage.getItem("data");
}

showTask();

function clearTask() {
  if (listContainer.children.length === 0) {
    alert("You have no tasks left!");
  } else {
    listContainer.innerHTML = "";
  }
  saveData();
}

// DRAGGABLE TASK Commented out sjust to test functionality before fixing

// dragElement(document.getElementById("todo_app"));

// function dragElement(elmnt) {
//   var pos1 = 0,
//     pos2 = 0,
//     pos3 = 0,
//     pos4 = 0;
//   if (document.getElementById(elmnt.id + "popup_main_task")) {
//     // if present, the header is where you move the DIV from:
//     document.getElementById(elmnt.id + "popup_main_task").onmousedown =
//       dragMouseDown;
//   } else {
//     // otherwise, move the DIV from anywhere inside the DIV:
//     elmnt.onmousedown = dragMouseDown;
//   }

//   function dragMouseDown(e) {
//     e = e || window.event;
//     e.preventDefault();
//     pos3 = e.clientX;
//     pos4 = e.clientY;
//     document.onmouseup = closeDragElement;
//     document.onmousemove = elementDrag;
//   }

//   function elementDrag(e) {
//     e = e || window.event;
//     e.preventDefault();
//     pos1 = pos3 - e.clientX;
//     pos2 = pos4 - e.clientY;
//     pos3 = e.clientX;
//     pos4 = e.clientY;
//     elmnt.style.top = elmnt.offsetTop - pos2 + "px";
//     elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
//   }

//   function closeDragElement() {
//     document.onmouseup = null;
//     document.onmousemove = null;
//   }
// }
