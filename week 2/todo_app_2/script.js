//# Global Variables
let todos = [];
let selectedTodo = null;

//# Fetching HTML elements
const textArea = document.getElementById("textArea");
const taskContainer = document.getElementById("taskContainer");

//! Adding keyup eventListener to textArea
textArea.addEventListener("keyup", function eventHandler(event) {
  const keyCode = event.code;

  //* pulling out value from textArea
  let value = textArea.value;

  if (keyCode === "Enter" && value !== "" && selectedTodo === null) {
    //* to stop cursor going to next line after hitting enter
    event.preventDefault();

    //> creating a todo object and putting values inside it
    let todo = {
      id: generateUniqueId(),
      text: value,
      completed: false,
    };

    let taskDiv = document.createElement("div");
    let taskButtonDiv = document.createElement("div");
    let taskPara = document.createElement("p");
    let taskReadCheckbox = document.createElement("input");
    let taskEditBtn = document.createElement("button");
    let taskDeleteBtn = document.createElement("button");

    taskReadCheckbox.setAttribute("type", "checkbox");
    taskPara.setAttribute("id", `${todo.id}`);

    taskDiv.setAttribute("class", "taskDiv");
    taskButtonDiv.setAttribute("class", "taskButtonDiv");
    taskPara.setAttribute("class", "taskPara");
    taskReadCheckbox.setAttribute("class", "btn taskReadCheckbox");
    taskEditBtn.setAttribute("class", "btn taskEditBtn");
    taskDeleteBtn.setAttribute("class", "btn taskDeleteBtn");

    taskButtonDiv.appendChild(taskReadCheckbox);
    taskButtonDiv.appendChild(taskEditBtn);
    taskButtonDiv.appendChild(taskDeleteBtn);
    taskDiv.appendChild(taskPara);
    taskDiv.appendChild(taskButtonDiv);
    taskContainer.appendChild(taskDiv);

    taskPara.innerHTML = todo.text;
    taskDeleteBtn.innerHTML = "Delete";
    taskEditBtn.innerHTML = "Edit";

    //> storing tasks in local storage
    todos.push(todo); //* adding todo object to todos array
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
});

//! pulling out stored todos array from local storage & displaying it on screen
let storedTodos = localStorage.getItem("todos");
if (storedTodos !== null) {
  todos = JSON.parse(storedTodos);

  todos.forEach(function (todo) {
    let taskDiv = document.createElement("div");
    let taskButtonDiv = document.createElement("div");
    let taskPara = document.createElement("p");
    let taskReadCheckbox = document.createElement("input");
    let taskEditBtn = document.createElement("button");
    let taskDeleteBtn = document.createElement("button");

    taskReadCheckbox.setAttribute("type", "checkbox");
    taskPara.setAttribute("id", `${todo.id}`);

    taskDiv.setAttribute("class", "taskDiv");
    taskButtonDiv.setAttribute("class", "taskButtonDiv");
    taskPara.setAttribute("class", "taskPara");
    taskReadCheckbox.setAttribute("class", "btn taskReadCheckbox");
    taskEditBtn.setAttribute("class", "btn taskEditBtn");
    taskDeleteBtn.setAttribute("class", "btn taskDeleteBtn");

    taskButtonDiv.appendChild(taskReadCheckbox);
    taskButtonDiv.appendChild(taskEditBtn);
    taskButtonDiv.appendChild(taskDeleteBtn);
    taskDiv.appendChild(taskPara);
    taskDiv.appendChild(taskButtonDiv);
    taskContainer.appendChild(taskDiv);

    taskPara.innerHTML = todo.text;
    taskDeleteBtn.innerHTML = "Delete";
    taskEditBtn.innerHTML = "Edit";

    //! Delete Button Functionality
    taskDeleteBtn.addEventListener("click", deleteClickHandler);
    //! Edit Button Functionality
    taskEditBtn.addEventListener("click", editClickHandler);
  });
}

//! Event Handler for Delete
function deleteClickHandler(event) {
  var deleteBtn = event.target;
  console.log(deleteBtn);
  var todoDiv = deleteBtn.parentNode.parentNode;
  console.log(todoDiv);
  var todoContainer = todoDiv.parentNode;
  var taskId = todoDiv.children[0].id;
  console.log(typeof taskId);

  //> update in local storage
  var storedItemsInLocalStorage = localStorage.getItem("todos");

  if (storedItemsInLocalStorage !== null) {
    todos = JSON.parse(storedItemsInLocalStorage);

    //* remove task object from local storage
    todos = todos.filter(function (todo) {
      if (todo.id === taskId) {
        return false;
      } else {
        return true;
      }
    });

    localStorage.setItem("todos", JSON.stringify(todos));
  }

  //* remove task from DOM
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

function generateUniqueId() {
  return JSON.stringify(Math.floor(Math.random() * Date.now()));
}
