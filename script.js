const addBtn = document.getElementById("addBtn");
const popup = document.getElementById("popup");
const saveBtn = document.getElementById("saveBtn");
const closeBtn = document.getElementById("closeBtn");

const titleInput = document.getElementById("title");
const descInput = document.getElementById("desc");
const hoursInput = document.getElementById("hours");

const todoList = document.getElementById("todoList");
const progressList = document.getElementById("progressList");
const doneList = document.getElementById("doneList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  render();
}

function saveTask() {
  tasks.push({
    title: titleInput.value, 
    desc: descInput.value,
    hours: hoursInput.value,
    progress: 0,
    status: "todo"
  });
  popup.style.display = "none";
  titleInput.value = descInput.value = hoursInput.value = "";
  save();
}

function getProgressStyle(p) {
  if (p <= 50) return ["green", `${p}%`];
  if (p <= 75) return ["yellow", `${p}%`];
  if (p <= 100) return ["red", `${p}%`];
  return ["gray", "UNCOMPLETED"];
}

function render() {
  todoList.innerHTML = progressList.innerHTML = doneList.innerHTML = "";

  tasks.forEach((t, i) => {
    const div = document.createElement("div");
    div.className = "task";
    div.innerHTML = `<h3>${t.title}</h3><p>${t.desc}</p><p>Hours: ${t.hours}</p>`;

    if (t.status === "todo") {
      div.innerHTML += `
        <div class="btn-group">
          <button class="start">START</button>
          <button class="delete">DELETE</button>
        </div>`;
      div.querySelector(".start").onclick = () => {
        t.status = "inprogress";
        t.progress = 50;
        save();
      };
      div.querySelector(".delete").onclick = () => {
        tasks.splice(i, 1);
        save();
      };
      todoList.appendChild(div);
    }

    if (t.status === "inprogress") {
      const [color, text] = getProgressStyle(t.progress);
      div.innerHTML += `
        <div class="status ${color}">${text}</div>
        <div class="btn-group">
          <button class="complete">COMPLETED</button>
        </div>`;
      div.querySelector(".complete").onclick = () => {
        t.status = "done";
        t.progress = 100;
        save();
      };
      progressList.appendChild(div);
    }

    if (t.status === "done") {
      div.innerHTML += `
        <div class="status ${t.progress >= 100 ? "red" : "gray"}">
          ${t.progress >= 100 ? "DONE" : "UNCOMPLETED"}
        </div>
        <div class="btn-group">
          <button class="undo">UNDONE</button>
        </div>`;
      div.querySelector(".undo").onclick = () => {
        t.status = "inprogress";
        t.progress = 75;
        save();
      };
      doneList.appendChild(div);
    }
  });
}

addBtn.onclick = () => popup.style.display = "flex";
closeBtn.onclick = () => popup.style.display = "none";
saveBtn.onclick = saveTask;

document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.getElementById(btn.dataset.tab).classList.add("active");
  };
});

render();
