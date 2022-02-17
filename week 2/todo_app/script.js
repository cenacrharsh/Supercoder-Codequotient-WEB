let todos = [];

function init() {
  let container = document.createElement("div");
  document.body.appendChild(container);

  let leftPaneDiv = document.createElement("div");
  let rightPaneDiv = document.createElement("div");

  container.appendChild(leftPaneDiv);
  container.appendChild(rightPaneDiv);

  container.setAttribute("id", "container");
  leftPaneDiv.setAttribute("id", "leftPaneDiv");
  rightPaneDiv.setAttribute("id", "rightPaneDiv");

  //! leftPaneDiv
  let heading = document.createElement("h1");
  heading.innerHTML = "TASK LIST";
  leftPaneDiv.appendChild(heading);

  let subHeading = document.createElement("h3");
  subHeading.innerHTML =
    "Add Tasks to your list by typing to your right and pressing enter. You may then view pending tasks below.";
  leftPaneDiv.appendChild(subHeading);

  let taskContainer = document.createElement("div");
  taskContainer.setAttribute("id", "taskContainer");
  leftPaneDiv.appendChild(taskContainer);

  //! rightPaneDiv
  let textArea = document.createElement("textarea");
  textArea.setAttribute("id", "textArea");
  textArea.setAttribute("placeholder", "I need to...");
  textArea.setAttribute("cols", "30");
  textArea.setAttribute("rows", "10");

  rightPaneDiv.appendChild(textArea);

  textArea.addEventListener("keyup", eventHandler);
}

//! Event Handler for TextArea
function eventHandler(event) {
  let textArea = document.getElementById("textArea");
  let taskContainer = document.getElementById("taskContainer");

  const keyCode = event.code;

  let value = textArea.value;

  if (keyCode === "Enter" && value !== "" && value !== "\n") {
    event.preventDefault(); //* to stop cursor going to next line after hitting enter

    let taskDiv = document.createElement("div");
    let taskPara = document.createElement("p");
    let taskReadBtn = document.createElement("button");
    let taskDeleteBtn = document.createElement("button");

    taskDiv.setAttribute("class", "taskDiv");
    taskPara.setAttribute("class", "taskPara");
    taskReadBtn.setAttribute("class", "btn taskReadBtn");
    taskDeleteBtn.setAttribute("class", "btn taskDeleteBtn");

    taskDiv.appendChild(taskPara);
    taskDiv.appendChild(taskReadBtn);
    taskDiv.appendChild(taskDeleteBtn);

    taskContainer.appendChild(taskDiv);

    taskPara.innerHTML = value;
    taskReadBtn.innerHTML = "Read";
    taskDeleteBtn.innerHTML = "Delete";

    //> storing tasks in local storage
    todos.push(value); //* adding tasks to todos array
    localStorage.setItem("todos", JSON.stringify(todos)); //* storing todos array in local storage
    textArea.value = "";

    //! Delete Button Functionality
    taskDeleteBtn.addEventListener("click", deleteClickHandler);
  }
}

//! Event Handler for Delete
function deleteClickHandler(event) {
  console.log(event.target);
}

init();

//! pulling out stored todos array from local storage & displaying it on screen
let storedTodos = localStorage.getItem("todos");

if (storedTodos !== null) {
  todos = JSON.parse(storedTodos);
}

todos.forEach(function (todo) {
  let taskDiv = document.createElement("div");
  let taskPara = document.createElement("p");
  let taskReadBtn = document.createElement("button");
  let taskDeleteBtn = document.createElement("button");

  taskDiv.setAttribute("class", "taskDiv");
  taskPara.setAttribute("class", "taskPara");
  taskReadBtn.setAttribute("class", "btn taskReadBtn");
  taskDeleteBtn.setAttribute("class", "btn taskDeleteBtn");

  taskDiv.appendChild(taskPara);
  taskDiv.appendChild(taskReadBtn);
  taskDiv.appendChild(taskDeleteBtn);

  let taskContainer = document.getElementById("taskContainer");
  taskContainer.appendChild(taskDiv);

  taskPara.innerHTML = todo;
  taskReadBtn.innerHTML = "Read";
  taskDeleteBtn.innerHTML = "Delete";

  //! Delete Button Functionality
  taskDeleteBtn.addEventListener("click", deleteClickHandler);
});
