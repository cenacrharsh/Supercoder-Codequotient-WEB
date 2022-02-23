let todos = [];
let selectedTodo = null;

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

  if (keyCode === "Enter" && value !== "" && selectedTodo === null) {
    event.preventDefault(); //* to stop cursor going to next line after hitting enter

    let taskDiv = document.createElement("div");
    let taskPara = document.createElement("p");
    let taskReadCheckbox = document.createElement("input");
    let taskDeleteBtn = document.createElement("button");
    let taskEditBtn = document.createElement("button");

    taskReadCheckbox.setAttribute("type", "checkbox");

    taskDiv.setAttribute("class", "taskDiv");
    taskPara.setAttribute("class", "taskPara");
    taskReadCheckbox.setAttribute("class", "btn taskReadCheckbox");
    taskDeleteBtn.setAttribute("class", "btn taskDeleteBtn");
    taskEditBtn.setAttribute("class", "btn taskEditBtn");

    taskDiv.appendChild(taskPara);
    taskDiv.appendChild(taskReadCheckbox);
    taskDiv.appendChild(taskEditBtn);
    taskDiv.appendChild(taskDeleteBtn);

    taskContainer.appendChild(taskDiv);

    taskPara.innerHTML = value;
    taskDeleteBtn.innerHTML = "Delete";
    taskEditBtn.innerHTML = "Edit";

    //> storing tasks in local storage
    todos.push(value); //* adding tasks to todos array
    localStorage.setItem("todos", JSON.stringify(todos)); //* storing todos array in local storage
    textArea.value = "";

    //! Delete Button Functionality
    taskDeleteBtn.addEventListener("click", deleteClickHandler);

    //! Edit Button Functionality
    taskEditBtn.addEventListener("click", editClickHandler);
  }

  if (keyCode === "Enter" && value !== "" && selectedTodo !== null) {
    let inputText = textArea.value;
    let taskText = selectedTodo.innerHTML;

    selectedTodo.innerHTML = inputText;

    selectedTodo = null;

    textArea.value = "";

    //> update in local storage
    var storedItemsInLocalStorage = localStorage.getItem("todos");

    if (storedItemsInLocalStorage !== null) {
      todos = JSON.parse(storedItemsInLocalStorage);
    }
    var index = todos.indexOf(taskText);

    todos[index] = inputText;
    localStorage.setItem("todos", JSON.stringify(todos));
  }
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
  let taskReadCheckbox = document.createElement("input");
  let taskDeleteBtn = document.createElement("button");
  let taskEditBtn = document.createElement("button");

  taskReadCheckbox.setAttribute("type", "checkbox");

  taskDiv.setAttribute("class", "taskDiv");
  taskPara.setAttribute("class", "taskPara");
  taskReadCheckbox.setAttribute("class", "btn taskReadBtn");
  taskDeleteBtn.setAttribute("class", "btn taskDeleteBtn");
  taskEditBtn.setAttribute("class", "btn taskEditBtn");

  taskDiv.appendChild(taskPara);
  taskDiv.appendChild(taskReadCheckbox);
  taskDiv.appendChild(taskDeleteBtn);
  taskDiv.appendChild(taskEditBtn);

  let taskContainer = document.getElementById("taskContainer");
  taskContainer.appendChild(taskDiv);

  taskPara.innerHTML = todo;
  taskDeleteBtn.innerHTML = "Delete";
  taskEditBtn.innerHTML = "Edit";

  //! Delete Button Functionality
  taskDeleteBtn.addEventListener("click", deleteClickHandler);

  //! Edit Button Functionality
  taskEditBtn.addEventListener("click", editClickHandler);
});

//! Event Handler for Delete
function deleteClickHandler(event) {
  var deleteBtn = event.target;
  var todoDiv = deleteBtn.parentNode;
  var todoContainer = todoDiv.parentNode;
  var taskText = todoDiv.children[0].innerHTML;

  //> update in local storage
  var storedItemsInLocalStorage = localStorage.getItem("todos");

  if (storedItemsInLocalStorage !== null) {
    todos = JSON.parse(storedItemsInLocalStorage);
  }
  var index = todos.indexOf(taskText);

  todos.splice(index, 1);
  localStorage.setItem("todos", JSON.stringify(todos));

  todoContainer.removeChild(todoDiv);
}

//! Event Handler for Edit
function editClickHandler(event) {
  var editBtn = event.target;
  var todoDiv = editBtn.parentNode;
  var taskText = todoDiv.children[0].innerHTML;

  selectedTodo = todoDiv.children[0];

  //> add task text in text area
  textArea.value = taskText;
}
