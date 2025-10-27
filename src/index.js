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

function saveToLocalStorage() {
    const projectsData = projects.map(project => ({
        name: project.name,
        tasks: project.tasks.map(task => ({
            title: task.title,
            description: task.description,
            dueDate: task.dueDate.toISOString(),
            isComplete: task.isComplete
        }))
    }));
    localStorage.setItem('todoProjects', JSON.stringify(projectsData));
}

function loadFromLocalStorage() {
    const savedData = localStorage.getItem('todoProjects');
    if (savedData) {
        const projectsData = JSON.parse(savedData);
        projects = projectsData.map(projectData => {
            const tasks = projectData.tasks.map(taskData => 
                new Task(
                    taskData.title,
                    taskData.description,
                    new Date(taskData.dueDate),
                    taskData.isComplete
                )
            );
            return new Project(tasks, projectData.name);
        });
        currentProject = projects[0];
    }
}

let projects = [];
let currentProject = null; // Add this line
loadFromLocalStorage();

if (projects.length === 0) {
    const defaultProject = new Project([], "Default");
    projects.push(defaultProject);
    currentProject = defaultProject;
}

let editTaskIndex = null; // track if editing a task

function displayTasks() {
    const tasksContainer = document.getElementById("task-container");
    tasksContainer.innerHTML = "";

    currentProject.tasks.forEach((task, index) => {
        const newDiv = document.createElement("div");
        newDiv.classList.add("todo-item");

        const title = document.createElement("h3");
        title.textContent = task.title;

        // Apply completed state styling on load
        if (task.isComplete) {
            newDiv.style.opacity = "0.6";
            title.style.textDecoration = "line-through";
        }

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
        checkbox.checked = task.isComplete; // This line is correct, keep it

        checkbox.addEventListener("change", () => {
            task.isComplete = checkbox.checked;
            if (task.isComplete) {
                newDiv.style.opacity = "0.6";
                title.style.textDecoration = "line-through";
            } else {
                newDiv.style.opacity = "1";
                title.style.textDecoration = "none";
            }
            saveToLocalStorage(); // Add this line to save immediately when checkbox changes
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

    saveToLocalStorage();
}

function deleteTask(index) {
    const confirmDelete = confirm(`Are you sure you want to delete "${currentProject.tasks[index].title}"?`);
    if (!confirmDelete) return;
    currentProject.tasks.splice(index, 1);
    displayTasks();
    saveToLocalStorage();
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
    saveToLocalStorage();

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
    saveToLocalStorage();
}

function addProject() {
    let projectName = prompt("Enter Name For Project: ");
    if (projectName && projectName.trim() !== "") {
        let newProject = new Project([], projectName);
        projects.push(newProject);
        displayProjects();
        saveToLocalStorage();
    }
}

displayProjects();
displayTasks();
