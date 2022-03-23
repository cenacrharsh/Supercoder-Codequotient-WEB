const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

const PORT = 3000;

//! fs.readFile func
function read(filePath, callback) {
  fs.readFile(`${filePath}`, "utf-8", function (error, data) {
    if (error) {
      console.log("There is some error in reading the file");
    } else {
      callback(data);
    }
  });
}

app.get("/", function (req, res) {
  read("./client/index.html", function (data) {
    res.end(data);
  });
});

app.get("/style.css", function (req, res) {
  read("./client/style.css", function (data) {
    res.end(data);
  });
});

app.get("/script.js", function (req, res) {
  read("./client/script.js", function (data) {
    res.end(data);
  });
});

app.get("/get-todos", function (req, res) {
  read("./db.txt", function (data) {
    res.json(data);
  });
});

app.post("/save-todo", function (req, res) {
  read("./db.txt", function (data) {
    let todos = [];

    if (data.length > 0) {
      todos = JSON.parse(data);
    }
    let newTodo = req.body;

    todos.push(newTodo);

    fs.writeFile("./db.txt", JSON.stringify(todos), function (error) {
      if (error) {
        res.end("Error Ocurred while saving todos");
      } else {
        console.log("Saved todos in db");
        res.end();
      }
    });
  });
});

app.post("/delete-todo", function (req, res) {
  read("./db.txt", function (data) {
    let todos = [];

    if (data.length > 0) {
      todos = JSON.parse(data);
    }

    let obj = req.body;
    let taskId = obj.id;

    //* removing to be deleted todo from array of todos
    todos = todos.filter(function (todo) {
      if (todo.id === taskId) {
        return false;
      } else {
        return true;
      }
    });

    fs.writeFile("./db.txt", JSON.stringify(todos), function (error) {
      if (error) {
        res.end("Error Ocurred while saving todos");
      } else {
        console.log("Saved todos in db");
        res.end();
      }
    });
  });
});

app.post("/update-todo", function (req, res) {
  read("./db.txt", function (data) {
    let todos = [];

    if (data.length > 0) {
      todos = JSON.parse(data);
    }

    let obj = req.body;
    let taskId = obj.id;
    let taskCompletedStatus = obj.status;

    //* updating task completed status of selected task object in server
    todos.forEach(function (todo) {
      if (todo.id === taskId) {
        todo.isCompleted = taskCompletedStatus;
      }
    });

    fs.writeFile("./db.txt", JSON.stringify(todos), function (error) {
      if (error) {
        res.end("Error Ocurred while saving todos");
      } else {
        console.log("Saved todos in db");
        res.end();
      }
    });
  });
});

app.listen(PORT, function () {
  console.log(`Server Running on PORT :: ${PORT}`);
});
