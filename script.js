const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const dayTabs = document.getElementById('dayTabs');
const message = document.getElementById('message');

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
let tasks = { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] };
let currentDay = "Mon";

// ---- Tabs ----
function renderTabs() {
  dayTabs.innerHTML = "";
  days.forEach(day => {
    const btn = document.createElement("button");
    btn.textContent = day;
    btn.classList.add("tab-btn");
    if (day === currentDay) btn.classList.add("active");
    btn.addEventListener("click", () => {
      currentDay = day;
      renderTabs();
      renderTasks();
      showMessage(""); // clear message when switching days
    });
    dayTabs.appendChild(btn);
  });
}

// ---- Render Tasks ----
function renderTasks() {
  taskList.innerHTML = '';
  tasks[currentDay].forEach((task, index) => {
    const li = document.createElement('li');
    li.draggable = true;
    li.dataset.index = index;

    li.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''} data-action="toggle" data-index="${index}">
      <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
      <button data-action="delete" data-index="${index}">❌</button>
    `;

    taskList.appendChild(li);
  });

  enableDragAndDrop();
}

// ---- Add Task ----
function addTask() {
  const text = taskInput.value.trim();
  if (!currentDay) {
    showMessage("⚠ Please select a day first.");
    return;
  }
  if (!text) {
    showMessage("⚠ Task cannot be empty.");
    return;
  }

  tasks[currentDay].push({ text, completed: false });
  taskInput.value = '';
  showMessage(""); // clear warning
  renderTasks();
}

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

// ---- Toggle/Delete ----
taskList.addEventListener('click', (e) => {
  const idx = e.target.dataset.index;
  if (e.target.dataset.action === "toggle") {
    tasks[currentDay][idx].completed = e.target.checked;
    renderTasks();
  }
  if (e.target.dataset.action === "delete") {
    tasks[currentDay].splice(idx, 1);
    renderTasks();
  }
});

// ---- Drag and Drop ----
function enableDragAndDrop() {
  const items = taskList.querySelectorAll("li");

  items.forEach(item => {
    item.addEventListener("dragstart", () => {
      item.classList.add("dragging");
    });
    item.addEventListener("dragend", () => {
      item.classList.remove("dragging");
      reorderTasks();
    });
  });

  taskList.addEventListener("dragover", e => {
    e.preventDefault();
    const dragging = document.querySelector(".dragging");
    const afterElement = getDragAfterElement(taskList, e.clientY);
    if (afterElement == null) {
      taskList.appendChild(dragging);
    } else {
      taskList.insertBefore(dragging, afterElement);
    }
  });
}

function getDragAfterElement(container, y) {
  const elements = [...container.querySelectorAll("li:not(.dragging)")];
  return elements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function reorderTasks() {
  const newOrder = [];
  taskList.querySelectorAll("li").forEach(li => {
    const idx = li.dataset.index;
    newOrder.push(tasks[currentDay][idx]);
  });
  tasks[currentDay] = newOrder;
}

// ---- Message display ----
function showMessage(text) {
  message.textContent = text;
}

// ---- Init ----
renderTabs();
renderTasks();