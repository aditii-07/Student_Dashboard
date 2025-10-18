// ===== Light/Dark Mode =====
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark")
    ? "☀️"
    : "🌙";
});

// ===== To-Do List =====
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const taskText = taskInput.value.trim();
  if (!taskText) return;

  const li = document.createElement("li");

  // Checkbox to complete task
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.addEventListener("change", () => li.classList.toggle("completed"));

  // Task text
  const span = document.createElement("span");
  span.textContent = taskText;

  // Delete button
  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.classList.add("delete-btn");
  delBtn.addEventListener("click", () => li.remove());

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(delBtn);
  taskList.appendChild(li);

  taskInput.value = "";
}

// ===== Image Upload =====
const imageInput = document.getElementById("imageInput");
const userImage = document.getElementById("userImage");
const changeImageBtn = document.getElementById("changeImageBtn");

imageInput.addEventListener("change", () => handleImage(imageInput.files[0]));
changeImageBtn.addEventListener("click", () => imageInput.click());

function handleImage(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    userImage.src = reader.result;
  };
  reader.readAsDataURL(file);

  // Toggle buttons
  imageInput.style.display = "none";
  changeImageBtn.style.display = "block";
}

// ===== Notes & Tags =====
const noteForm = document.getElementById("noteForm");
const notesContainer = document.getElementById("notes-container");
const tagsContainer = document.getElementById("tags-container");
const colorCircles = document.querySelectorAll(".color-circle");

let notes = [];
let currentFilter = null;
let selectedColor = "#5a67d8";

// Select color
colorCircles.forEach((circle) => {
  circle.addEventListener("click", () => {
    selectedColor = circle.dataset.color;
    colorCircles.forEach((c) => (c.style.border = "2px solid #fff"));
    circle.style.border = "2px solid #000";
  });
});

// Add Note
noteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("noteName").value.trim();
  const tag = document.getElementById("noteTag").value.trim();
  const date = document.getElementById("noteDate").value;
  const text = document.getElementById("noteText").value.trim();

  if (!name || !tag || !text) return;

  const note = { name, tag, date, text, color: selectedColor };
  notes.push(note);

  updateTags(tag, selectedColor);
  renderNotes();

  noteForm.reset();
});

// Render Notes
function renderNotes() {
  notesContainer.innerHTML = "";

  notes
    .filter((n) => !currentFilter || n.tag === currentFilter)
    .forEach((n) => {
      const div = document.createElement("div");
      div.classList.add("note-card");
      div.innerHTML = `
        <div><strong>${n.name}</strong> 
        <span class="note-tag" style="background:${n.color}">${n.tag}</span></div>
        <p>${n.text}</p>
        <small>${n.date}</small>
      `;
      notesContainer.appendChild(div);
    });
}

// Update Tags
function updateTags(tag, color) {
  // Already exists
  if ([...tagsContainer.children].some((t) => t.dataset.tag === tag)) return;

  const btn = document.createElement("button");
  btn.classList.add("tag");
  btn.dataset.tag = tag;
  btn.style.background = color;
  btn.textContent = tag;

  btn.addEventListener("click", () => {
    if (currentFilter === tag) {
      currentFilter = null;
      btn.classList.remove("selected");
    } else {
      currentFilter = tag;
      document
        .querySelectorAll(".tag")
        .forEach((t) => t.classList.remove("selected"));
      btn.classList.add("selected");
    }
    renderNotes();
  });

  tagsContainer.appendChild(btn);
}
