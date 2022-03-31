//! object containing id and text of selected todo
let selectedTodo = null;

//# Fetching HTML elements
const textArea = document.getElementById("textArea");
const taskContainer = document.getElementById("taskContainer");
const usernameNode = document.getElementById("username");
const signOutBtn = document.getElementById("sign-out-btn");

//! Fetch Name of User from URL
window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get("name");
  usernameNode.innerHTML = name;
};

//! Adding Click eventListener to SignOut Button
signOutBtn.addEventListener("click", handleSignOut);

function handleSignOut() {
  var request = new XMLHttpRequest();
  request.open("GET", "/sign-out");
  request.send();
  request.addEventListener("load", function (event) {
    let status = event.target.status;
    if (status === 200) {
      console.log("Successfully Logged Out!!!");
      window.location.replace("../signin.html");
    } else {
      console.log("Error Occured while Logging Out!!!");
    }
  });
}

//! Adding keyup eventListener to textArea
textArea.addEventListener("keyup", function eventHandler(event) {
  const keyCode = event.code;

  //* pulling out value from textArea
  let value = textArea.value;

  //> when Enter is clicked while creating new task
  if (keyCode === "Enter" && value !== "" && selectedTodo === null) {
    //* to stop cursor going to next line after hitting enter
    event.preventDefault();

    //* pulling out user id from url
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("id");

    //> creating a todo object and putting values inside it
    let todo = {
      id: generateUniqueId(),
      text: value,
      isCompleted: false,
      createdBy: userId,
    };

    //> saving todo object in server, and then adding todo to todo panel
    saveTodoInServer(todo, function () {
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

      //> clearing text area
      textArea.value = "";

      //! Delete Button Functionality
      taskDeleteBtn.addEventListener("click", deleteClickHandler);

      //! Edit Button Functionality
      taskEditBtn.addEventListener("click", editClickHandler);

      //! Task Completed Checkbox Functionality
      taskReadCheckbox.addEventListener("change", checkboxClickHandler);
    });
  }

  //> when Enter is clicked while editing existing task
  if (keyCode === "Enter" && value !== "" && selectedTodo !== null) {
    let newInputText = textArea.value;
    let taskId = selectedTodo.id;

    //> update todo in server
    let postObj = {
      id: taskId,
      text: newInputText,
    };

    updateTodoInServer(postObj, function () {
      selectedTodo.taskPara.innerHTML = newInputText;

      selectedTodo = null;

      textArea.value = "";
    });
  }
});

//! pulling out stored todos array from server & displaying it on screen
getAllTodosFromServer(function (todos) {
  //* pulling out user id from url
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("id");

  console.log("before", todos);

  //* filtering out only todos made by current user
  todos = todos.filter(function (todo) {
    if (todo.createdBy === userId) {
      return true;
    } else {
      return false;
    }
  });

  console.log("after", todos);

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

    //> if todo.isCompleted is true in server
    if (todo.isCompleted) {
      //* checking checkbox
      taskReadCheckbox.checked = todo.isCompleted;

      //* adding class .taskCompletedStatus to taskPara
      taskPara.classList.add("taskCompletedStatus");
    }

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

    //! Task Completed Checkbox Functionality
    taskReadCheckbox.addEventListener("change", checkboxClickHandler);
  });
});

//! Event Handler for Delete
function deleteClickHandler(event) {
  var deleteBtn = event.target;
  var todoDiv = deleteBtn.parentNode.parentNode;
  var todoContainer = todoDiv.parentNode;
  var taskId = todoDiv.children[0].id;

  //> delete todo from server
  deleteTodoFromServer(taskId, function () {
    //> remove task from DOM
    todoContainer.removeChild(todoDiv);
  });
}

//! Event Handler for Edit
function editClickHandler(event) {
  var editBtn = event.target;
  var todoDiv = editBtn.parentNode.parentNode;
  var taskText = todoDiv.children[0].innerHTML;
  var taskId = todoDiv.children[0].id;

  //* setting selected todo's id to selectedTodoId
  let selectedTodoId = taskId;

  let selectedTodoObj = {
    id: selectedTodoId,
    taskPara: todoDiv.children[0],
  };

  selectedTodo = selectedTodoObj;

  //> add selected task text in text area
  textArea.value = taskText;
}

//! Event Handler for Checkbox
function checkboxClickHandler(event) {
  var checkbox = event.target;
  var todoDiv = checkbox.parentNode.parentNode;
  var taskPara = todoDiv.children[0];
  var taskCompletedStatus = todoDiv.children[1].children[0].checked;
  var taskId = taskPara.id;

  //> updating todos in server
  let postObj = {
    id: taskId,
    status: taskCompletedStatus,
  };

  updateTodoInServer(postObj, function () {
    if (taskCompletedStatus) {
      taskPara.classList.add("taskCompletedStatus");
    } else {
      taskPara.classList.remove("taskCompletedStatus");
    }
  });
}

//! Function to Generate Unique ID
function generateUniqueId() {
  return JSON.stringify(Math.floor(Math.random() * Date.now()));
}

//# Fetching and Saving Data in Server

function getAllTodosFromServer(callback) {
  var request = new XMLHttpRequest();
  request.open("GET", "/get-todos");
  request.send();
  request.addEventListener("load", function (event) {
    let response = JSON.parse(event.target.responseText);
    let todos = [];
    if (response != "") {
      todos = JSON.parse(response);
    }
    console.log("Fetched All ToDos from Server");
    callback(todos);
  });
}

function saveTodoInServer(todo, callback) {
  var request = new XMLHttpRequest();
  request.open("POST", "/save-todo");
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send(JSON.stringify(todo));
  request.addEventListener("load", function () {
    console.log("Saved Updated ToDos in Server");
    callback();
  });
}

function deleteTodoFromServer(taskId, callback) {
  let postObj = {
    id: taskId,
  };

  let postData = JSON.stringify(postObj);

  var request = new XMLHttpRequest();
  request.open("POST", "/delete-todo");
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send(postData);
  request.addEventListener("load", function () {
    console.log("Deleted ToDo from Server");
    callback();
  });
}

function updateTodoInServer(postObj, callback) {
  let postData = JSON.stringify(postObj);

  var request = new XMLHttpRequest();
  request.open("POST", "/update-todo");
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send(postData);
  request.addEventListener("load", function () {
    callback();
    console.log("Updated ToDo in Server");
  });
}
