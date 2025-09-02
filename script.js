const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    li.innerHTML = `
      <span>${task.text}</span>
      <div>
        <button onclick="toggleTask(${index})">✔</button>
        <button class="deleteBtn" onclick="deleteTask(${index})">✖</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

// Add task
addBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({ text, completed: false });
    taskInput.value = "";
    saveTasks();
  }
});

// Toggle complete
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
}

// Delete task
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
}

// Save to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// Initial render
renderTasks();