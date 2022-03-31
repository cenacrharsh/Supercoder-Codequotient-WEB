const express = require("express");
const session = require("express-session");
const fs = require("fs");

const PORT = 3000;

const app = express();

//! Middleware
app.use(express.json());
app.use(express.static("client"));
app.use(
  session({
    secret: "secrey key",
  })
);

function read(filePath, callback) {
  fs.readFile(`${filePath}`, "utf-8", function (err, data) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
}

//! Authentication

app.get("/", function (req, res) {
  if (req.session.isLoggedIn) {
    res.status(200);
    let name = req.session.username;
    res.json({ name: name });
  } else {
    read("./client/signin.html", function (err, data) {
      if (err) {
        res.end("Error Occured");
      } else {
        res.end(data);
      }
    });
  }
});

app.post("/sign-in", function (req, res) {
  read("./user.txt", function (err, data) {
    if (err) {
      res.end("Error in Reading Data from DB");
    } else {
      let users = [];

      if (data.length > 0) {
        users = JSON.parse(data);
      }

      let userDetails = req.body;
      let wrongCredentials;

      users.forEach(function (user) {
        if (
          user.email === userDetails.email &&
          user.password === userDetails.password
        ) {
          res.status(200);
          req.session.isLoggedIn = true;
          req.session.username = user.name;
          req.session.userId = user.id;
          res.json({ name: user.name });
        } else {
          wrongCredentials = true;
        }
      });

      if (wrongCredentials === true) {
        res.status(400);
        res.end();
      } else {
        res.status(404);
        res.end();
      }
    }
  });
});

app.post("/sign-up", function (req, res) {
  read("./user.txt", function (err, data) {
    if (err) {
      res.end("Error in Reading Data from DB");
    } else {
      let users = [];

      if (data.length > 0) {
        users = JSON.parse(data);
      }

      let newUser = req.body;

      users.forEach(function (user) {
        if (user.email === newUser.email) {
          res.status(400);
          res.end();
        }
      });

      users.push(newUser);

      fs.writeFile("./user.txt", JSON.stringify(users), function (err) {
        if (err) {
          res.status(500);
          res.end();
        } else {
          res.status(200);
          req.session.isLoggedIn = true;
          req.session.username = newUser.name;
          req.session.userId = newUser.id;
          res.json({ name: newUser.name });
        }
      });
    }
  });
});

app.get("/get-todos", function (req, res) {
  read("./todo.txt", function (err, data) {
    if (err) {
      res.end("Error in Reading Data from DB");
    }
    res.json(data);
    console.log("Fetched All ToDos from DB");
  });
});

app.post("/save-todo", function (req, res) {
  read("./todo.txt", function (err, data) {
    if (err) {
      res.end("Error in Reading Data from DB");
    }

    let todos = [];

    if (data.length > 0) {
      todos = JSON.parse(data);
    }
    let newTodo = req.body;

    todos.push(newTodo);

    fs.writeFile("./todo.txt", JSON.stringify(todos), function (error) {
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
  read("./todo.txt", function (err, data) {
    if (err) {
      res.end("Error in Reading Data from DB");
    }

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

    fs.writeFile("./todo.txt", JSON.stringify(todos), function (error) {
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
  read("./todo.txt", function (err, data) {
    if (err) {
      res.end("Error in Reading Data from DB");
    }

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

    fs.writeFile("./todo.txt", JSON.stringify(todos), function (error) {
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
