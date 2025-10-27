import { Project } from "./Project";
import "./styles.css";

class Task {
    constructor(title, description, dueDate, isComplete){
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


function displayTasks() {
    const tasksContainer = document.getElementById("task-container");
    tasksContainer.innerHTML = "";

    currentProject.tasks.forEach(task => {
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

        const statusContainer = document.createElement("div");
        statusContainer.classList.add("status-container");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "status";
        checkbox.checked = task.completed; 

        const label = document.createElement("label");
        label.textContent = "Complete";

        statusContainer.appendChild(checkbox);
        statusContainer.appendChild(label);

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.textContent = "Delete Task";

        newDiv.appendChild(title);
        newDiv.appendChild(description);
        newDiv.appendChild(dueDate);
        newDiv.appendChild(statusContainer);
        newDiv.appendChild(deleteBtn);

        tasksContainer.appendChild(newDiv);
    });
    let addBtn = document.createElement("button");
    addBtn.classList.add("add-button");
    addBtn.innerHTML = "Add Task";
    addBtn.onclick = openForm;
    tasksContainer.appendChild(addBtn);
}

displayTasks();

document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    const taskName = document.getElementById('taskName').value;
    const taskDesc = document.getElementById('taskDesc').value;
    const dueDate = document.getElementById('dueDate').value;
    
    const newTask = new Task(taskName, taskDesc, new Date(dueDate), false);
    currentProject.tasks.push(newTask);
    console.log(currentProject);
    displayTasks();
    
    document.getElementById('taskName').value = '';
    document.getElementById('taskDesc').value = '';
    document.getElementById('dueDate').value = '';
    
    // Close the form overlay
    closeForm();
});

function openForm() {
    document.getElementById("overlay").style.display = "block";
}

function closeForm() {
    document.getElementById("overlay").style.display = "none";
}

function displayProjects() {
    const projectsContainer = document.getElementById("projects");
    projectsContainer.innerHTML = "";

    const title = document.createElement("h2");
    title.innerHTML = "Projects";
    title.classList.add("w3-bar-item");
    projectsContainer.appendChild(title);

    projects.forEach((project) => {
        const ptag = document.createElement("a");
        ptag.innerHTML = project.name;
        ptag.classList.add("w3-bar-item", "w3-button");

        if (project === currentProject) {
            ptag.classList.add("w3-teal");
        }

        ptag.addEventListener("click", () => {
            currentProject = project;
            displayProjects();
            displayTasks(); 
            console.log(currentProject);
        });

        projectsContainer.appendChild(ptag);
    });

    const addBtn = document.createElement("button");
    addBtn.classList.add("add-button");
    addBtn.innerHTML = "Add Project";
    addBtn.addEventListener("click", addProject);
    projectsContainer.appendChild(addBtn);
}


function addProject(){
    let projectName = prompt("Enter Name For Project: ")
    if (projectName != null && projectName.trim() != ""){
        let newProject = new Project([], projectName);
        projects.push(newProject);
        displayProjects();
    }
}



displayProjects();
