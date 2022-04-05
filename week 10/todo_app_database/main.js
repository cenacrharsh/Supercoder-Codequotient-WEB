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
    // todo: handle error here
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
    console.log("Fetched All ToDos from DB");
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
        console.log("Saved Updated ToDos in DB");
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
        console.log("Deleted ToDo from DB");
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

    //* updating task completed status of selected task object in server
    todos.forEach(function (todo) {
      if (todo.id === taskId) {
        if (obj.hasOwnProperty("status")) {
          todo.isCompleted = obj.status;
        }

        if (obj.hasOwnProperty("text")) {
          todo.text = obj.text;
        }
      }
    });

    fs.writeFile("./db.txt", JSON.stringify(todos), function (error) {
      if (error) {
        res.end("Error Ocurred while saving todos");
      } else {
        console.log("Updated ToDo in DB");
        res.end();
      }
    });
  });
});

app.listen(PORT, function () {
  console.log(`Server Running on PORT :: ${PORT}`);
});
