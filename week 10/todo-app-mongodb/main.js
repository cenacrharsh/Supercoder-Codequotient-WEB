const express = require("express");
const session = require("express-session");
const fs = require("fs");

const PORT = 3000;

const app = express();

//# Database

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const url =
  "mongodb+srv://harsh:harsh@cluster0.tobfw.mongodb.net/todoDB?retryWrites=true&w=majority";
const client = new MongoClient(url);
const dbName = "todoDataBase";
var dbInstance = null;
client.connect().then(function () {
  console.log("DB is Connected !");
  dbInstance = client.db(dbName);
});

//! Middleware
app.use(express.json());
app.use(
  session({
    secret: "secret key",
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

app.get("/todo.html", function (req, res) {
  if (req.session.isLoggedIn) {
    read("./client/todo.html", function (err, data) {
      if (err) {
        res.end("Error in Reading Data from DB");
      } else {
        res.send(data);
      }
    });
  } else {
    res.redirect("/");
  }
});

app.use(express.static("client"));

function auth(req, res, next) {
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.redirect("/");
  }
}

//! Authentication

app.get("/", function (req, res) {
  if (req.session.isLoggedIn) {
    res.status(200);
    let name = req.session.username;
    let id = req.session.id;
    res.json({ name: name, id: id });
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

          req.session.userId = user.id;
          req.session.username = user.name;
          req.session.isLoggedIn = true;

          res.json({ name: user.name, id: user.id });
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

          req.session.userId = newUser.id;
          req.session.username = newUser.name;
          req.session.isLoggedIn = true;

          res.json({ name: newUser.name, id: newUser.id });
        }
      });
    }
  });
});

app.get("/sign-out", auth, function (req, res) {
  console.log("logout");
  req.session.destroy();
  res.status(200);
  res.end();
});

//# CRUD IN DATABASE

//! Create
app.post("/save-todo", auth, function (req, res) {
  let newTodo = req.body;

  console.log(newTodo);

  fs.writeFile("./todo.txt", JSON.stringify(todos), function (error) {
    if (error) {
      res.end("Error Ocurred while saving todos");
    } else {
      console.log("Saved Updated ToDos in DB");
      res.end();
    }
  });
});

//! Read
app.get("/get-todos", auth, function (req, res) {
  read("./todo.txt", function (err, data) {
    if (err) {
      res.end("Error in Reading Data from DB");
    }
    res.json(data);
    console.log("Fetched All ToDos from DB");
  });
});

//! Update
app.post("/update-todo", auth, function (req, res) {
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

//! Delete
app.post("/delete-todo", auth, function (req, res) {
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

app.listen(PORT, function () {
  console.log(`Server Running on PORT :: ${PORT}`);
});
