import "./styles.css";

class Todo {
    constructor(title, description, dueDate, isComplete){
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.isComplete = isComplete;
    }
}

class Project {
    constructor(todo, name){
        this.todo = todo;
        this.name = name;
    }
}

const p1 = new Project("T", "Project 1");
const p2 = new Project("T", "Project 2");
const p3 = new Project("T", "Project 3");
let projects = [];
projects.push(p1);
projects.push(p2);
projects.push(p3);

function displayProjects(){
    const projectsContainer = document.getElementById("projects");
    projectsContainer.innerHTML = "";
    const title = document.createElement("h2");
    title.innerHTML = "Projects";
    title.classList.add("w3-bar-item");
    projectsContainer.appendChild(title);
    projects.forEach(project => {
        const ptag = document.createElement("a");
        ptag.innerHTML = project.name;
        ptag.classList.add("w3-bar-item");
        ptag.classList.add("w3-button");
        projectsContainer.appendChild(ptag);
    });
    const addBtn = document.createElement("button");
    addBtn.innerHTML = "Add Project";
    addBtn.addEventListener("click", addProject);
    projectsContainer.appendChild(addBtn);
    
}

function addProject(){
    let projectName = prompt("Enter Name For Project: ")
    if (projectName != null && projectName.trim() != ""){
        let newProject = new Project("T", projectName);
        projects.push(newProject);
        displayProjects();
    }
}


displayProjects();
