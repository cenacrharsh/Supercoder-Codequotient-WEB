const express = require("express");
const session = require("express-session");
const fs = require("fs");

const PORT = 3000;

const app = express();

//# Database

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const url =
  "mongodb+srv://harsh:harsh@cluster0.tobfw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
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

function readTodosFromDB(callback) {
  const collection = dbInstance.collection("todoList");

  collection
    .find({})
    .toArray()
    .then(function (data) {
      callback(data);
    });
}

function saveTodosInDB(data, callback) {
  const collection = dbInstance.collection("todoList");
  collection.insertOne(data).then(function () {
    callback();
  });
}

function updateTodosInDB(obj, taskId, callback) {
  const collection = dbInstance.collection("todoList");

  if (obj.hasOwnProperty("status")) {
    collection
      .updateOne(
        { id: taskId },
        {
          $set: {
            isCompleted: obj.status,
          },
        }
      )
      .then(function () {
        console.log("Updated ToDo Completed Status in DB");
        callback();
      });
  }

  if (obj.hasOwnProperty("text")) {
    collection
      .updateOne(
        { id: taskId },
        {
          $set: {
            text: obj.text,
          },
        }
      )
      .then(function () {
        console.log("Updated ToDo Text in DB");
        callback();
      });
  }
}

function deleteTodosInDB(obj, taskId, callback) {
  const collection = dbInstance.collection("todoList");
  collection.deleteOne({ id: taskId }).then(function () {
    callback();
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
  req.session.destroy();
  res.status(200);
  res.end();
});

//# Database

//! Read
app.get("/get-todos", auth, function (req, res) {
  readTodosFromDB(function (data) {
    res.send(data);
  });
});

//! Create
app.post("/save-todo", auth, function (req, res) {
  let newTodo = req.body;

  saveTodosInDB(newTodo, function () {
    res.end();
  });
});

//! Delete
app.post("/delete-todo", auth, function (req, res) {
  let obj = req.body;
  let taskId = obj.id;

  deleteTodosInDB(obj, taskId, function () {
    console.log("Deleted ToDos in DB");
    res.end();
  });
});

//! Update
app.post("/update-todo", auth, function (req, res) {
  let obj = req.body;
  let taskId = obj.id;

  updateTodosInDB(obj, taskId, function () {
    res.end();
  });
});

app.listen(PORT, function () {
  console.log(`Server Running on PORT :: ${PORT}`);
});
