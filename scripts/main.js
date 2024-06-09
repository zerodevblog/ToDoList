document.addEventListener("DOMContentLoaded", loadTasks); // Загружаем задачи при загрузке страницы

function addTask(event) {
  event.preventDefault(); // предотвращаем стандартное поведение формы

  const input = document.querySelector(".input_icon");
  const taskText = input.value.trim(); // получаем текст из инпута

  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  // создаем новый элемент задачи
  const task = createTaskElement(taskText, false);

  // добавляем новый элемент задачи в контейнер
  const taskContainer = document.getElementById("taskContainer");
  const firstCompletedTask = Array.from(taskContainer.children).find((task) => {
    const taskContent = task.querySelector(".task-text");
    return taskContent.style.textDecoration === "line-through";
  });

  if (firstCompletedTask) {
    taskContainer.insertBefore(task, firstCompletedTask);
  } else {
    taskContainer.appendChild(task);
  }

  // очищаем инпут
  input.value = "";

  // обновляем и сохраняем задачи
  updateTaskCount();
  saveTasks();
}

function createTaskElement(taskText, isCompleted) {
  const task = document.createElement("div");
  task.className = "task";

  const taskContent = document.createElement("span");
  taskContent.className = "task-text";
  taskContent.textContent = taskText;

  if (isCompleted) {
    task.classList.add("completed");
    taskContent.style.textDecoration = "line-through";
    taskContent.style.color = "#777";
  }

  const taskActions = document.createElement("div");
  taskActions.className = "task-actions";

  const completeBtn = document.createElement("button");
  completeBtn.className = "complete";
  completeBtn.innerHTML = "✔";
  completeBtn.onclick = () => toggleCompleteTask(task, taskContent);

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete";
  deleteBtn.innerHTML = "🗑";
  deleteBtn.onclick = () => {
    deleteTask(task);
    saveTasks();
  };

  taskActions.appendChild(completeBtn);
  taskActions.appendChild(deleteBtn);

  task.appendChild(taskContent);
  task.appendChild(taskActions);

  return task;
}

function toggleCompleteTask(task, taskContent) {
  const taskContainer = document.getElementById("taskContainer");

  if (taskContent.style.textDecoration === "line-through") {
    taskContent.style.textDecoration = "none";
    taskContent.style.color = "#3e1671"; // вернем исходный цвет
    task.classList.remove("completed");
    const firstCompletedTask = Array.from(taskContainer.children).find((t) => {
      const tContent = t.querySelector(".task-text");
      return tContent.style.textDecoration === "line-through";
    });
    if (firstCompletedTask) {
      taskContainer.insertBefore(task, firstCompletedTask);
    } else {
      taskContainer.appendChild(task);
    }
  } else {
    taskContent.style.textDecoration = "line-through";
    taskContent.style.color = "#777";
    task.classList.add("completed");
    taskContainer.appendChild(task); // Перемещаем задачу в конец
  }
  saveTasks();
}

function deleteTask(task) {
  task.remove();
  updateTaskCount();
  saveTasks();
}

function deleteCompletedTasks() {
  const taskContainer = document.getElementById("taskContainer");
  const tasks = taskContainer.getElementsByClassName("completed");
  while (tasks.length > 0) {
    tasks[0].remove();
  }
  updateTaskCount();
  saveTasks();
}

function deleteAllTasks() {
  const taskContainer = document.getElementById("taskContainer");
  taskContainer.innerHTML = "";
  updateTaskCount();
  saveTasks();
}

function updateTaskCount() {
  const taskCount = document.getElementById("taskContainer").children.length;
  document.getElementById("taskCount").textContent = taskCount;
}

function saveTasks() {
  const tasks = [];
  const taskContainer = document.getElementById("taskContainer").children;

  for (let task of taskContainer) {
    const taskContent = task.querySelector(".task-text");
    const isCompleted = taskContent.style.textDecoration === "line-through";
    tasks.push({
      text: taskContent.textContent,
      isCompleted: isCompleted,
    });
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("taskCount", taskContainer.length);
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskContainer = document.getElementById("taskContainer");

  for (let taskData of tasks) {
    const task = createTaskElement(taskData.text, taskData.isCompleted);
    taskContainer.appendChild(task);
  }

  updateTaskCount();
}
