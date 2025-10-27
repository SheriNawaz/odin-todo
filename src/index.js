import { Project } from "./Project";
import "./styles.css";

class Task {
    constructor(title, description, dueDate, isComplete) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.isComplete = isComplete;
    }
}

const defaultProject = new Project([], "Default");
let projects = [];
projects.push(defaultProject);

let currentProject = defaultProject;
let editTaskIndex = null; // track if editing a task

function displayTasks() {
    const tasksContainer = document.getElementById("task-container");
    tasksContainer.innerHTML = "";

    currentProject.tasks.forEach((task, index) => {
        const newDiv = document.createElement("div");
        newDiv.classList.add("todo-item");

        const title = document.createElement("h3");
        title.textContent = task.title;

        const description = document.createElement("p");
        description.innerHTML = `<strong>Description:</strong> ${task.description}`;

        const dueDate = document.createElement("p");
        const formattedDate = task.dueDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
        dueDate.innerHTML = `<strong>Due Date:</strong> ${formattedDate}`;

        // ✅ Status container (checkbox)
        const statusContainer = document.createElement("div");
        statusContainer.classList.add("status-container");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "status";
        checkbox.checked = task.isComplete;

        checkbox.addEventListener("change", () => {
            task.isComplete = checkbox.checked;
            console.log(`Task "${task.title}" marked as ${task.isComplete ? "complete" : "incomplete"}.`);
            if (task.isComplete) {
                newDiv.style.opacity = "0.6";
                title.style.textDecoration = "line-through";
            } else {
                newDiv.style.opacity = "1";
                title.style.textDecoration = "none";
            }
        });

        const label = document.createElement("label");
        label.textContent = "Complete";

        statusContainer.appendChild(checkbox);
        statusContainer.appendChild(label);

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.textContent = "Delete Task";
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            deleteTask(index);
        });

        // Edit button
        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-btn");
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            openEditForm(index);
        });

        newDiv.appendChild(title);
        newDiv.appendChild(description);
        newDiv.appendChild(dueDate);
        newDiv.appendChild(statusContainer);
        newDiv.appendChild(deleteBtn);
        newDiv.appendChild(editBtn);

  

        tasksContainer.appendChild(newDiv);
    });

    // Add Task button
    let addBtn = document.createElement("button");
    addBtn.classList.add("add-button");
    addBtn.innerHTML = "Add Task";
    addBtn.onclick = openAddForm;
    tasksContainer.appendChild(addBtn);
}

function deleteTask(index) {
    const confirmDelete = confirm(`Are you sure you want to delete "${currentProject.tasks[index].title}"?`);
    if (!confirmDelete) return;
    currentProject.tasks.splice(index, 1);
    displayTasks();
}

// ----- FORM HANDLING -----

document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();

    const taskName = document.getElementById('taskName').value;
    const taskDesc = document.getElementById('taskDesc').value;
    const dueDate = document.getElementById('dueDate').value;

    if (editTaskIndex === null) {
        // Add new task
        const newTask = new Task(taskName, taskDesc, new Date(dueDate), false);
        currentProject.tasks.push(newTask);
    } else {
        // Edit existing task
        const task = currentProject.tasks[editTaskIndex];
        task.title = taskName;
        task.description = taskDesc;
        task.dueDate = new Date(dueDate);
        editTaskIndex = null;
    }

    displayTasks();
    closeForm();

    // Reset form
    document.getElementById('taskName').value = '';
    document.getElementById('taskDesc').value = '';
    document.getElementById('dueDate').value = '';
});

function openAddForm() {
    editTaskIndex = null;
    document.querySelector('#overlay h2').textContent = "Add New Task";
    document.querySelector('.submit-btn').textContent = "Add Task";
    document.getElementById("overlay").style.display = "block";
}

function openEditForm(index) {
    editTaskIndex = index;
    const task = currentProject.tasks[index];

    document.querySelector('#overlay h2').textContent = "Edit Task";
    document.querySelector('.submit-btn').textContent = "Save Changes";

    document.getElementById('taskName').value = task.title;
    document.getElementById('taskDesc').value = task.description;
    document.getElementById('dueDate').value = task.dueDate.toISOString().split('T')[0];

    document.getElementById("overlay").style.display = "block";
}

function closeForm() {
    document.getElementById("overlay").style.display = "none";
    editTaskIndex = null;
}

// ----- PROJECT HANDLING -----

function displayProjects() {
    const projectsContainer = document.getElementById("projects");
    projectsContainer.innerHTML = "";

    const title = document.createElement("h2");
    title.innerHTML = "Projects";
    title.classList.add("w3-bar-item");
    projectsContainer.appendChild(title);

    projects.forEach((project, index) => {
        const projectContainer = document.createElement("div");
        projectContainer.classList.add("w3-bar-item", "project-item");

        const projectBtn = document.createElement("a");
        projectBtn.innerHTML = project.name;
        projectBtn.classList.add("w3-button");
        if (project === currentProject) projectBtn.classList.add("w3-teal");

        projectBtn.addEventListener("click", () => {
            currentProject = project;
            displayProjects();
            displayTasks();
        });

        projectContainer.appendChild(projectBtn);

        if (index !== 0) {
            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("delete-project-btn");
            deleteBtn.innerHTML = "🗑️";
            deleteBtn.title = "Delete Project";
            deleteBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                deleteProject(index);
            });
            projectContainer.appendChild(deleteBtn);
        }

        projectsContainer.appendChild(projectContainer);
    });

    const addBtn = document.createElement("button");
    addBtn.classList.add("add-button");
    addBtn.innerHTML = "Add Project";
    addBtn.addEventListener("click", addProject);
    projectsContainer.appendChild(addBtn);
}

function deleteProject(index) {
    const projectToDelete = projects[index];
    const confirmDelete = confirm(`Are you sure you want to delete "${projectToDelete.name}"?`);
    if (!confirmDelete) return;

    projects.splice(index, 1);

    if (currentProject === projectToDelete) {
        currentProject = projects[0];
    }

    displayProjects();
    displayTasks();
}

function addProject() {
    let projectName = prompt("Enter Name For Project: ");
    if (projectName && projectName.trim() !== "") {
        let newProject = new Project([], projectName);
        projects.push(newProject);
        displayProjects();
    }
}

displayProjects();
displayTasks();
document.getElementById("cancelBtn").addEventListener("click", closeForm);
