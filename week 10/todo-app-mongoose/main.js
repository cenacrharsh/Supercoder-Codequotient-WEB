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
const dbName = "todoDataBase_mongoose";
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

//# CRUD IN DB FOR TODOS

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

//# CRUD IN DB FOR USERS

function findUserInDB(userDetails, callback) {
  const collection = dbInstance.collection("usersList");

  collection
    .find({ email: userDetails.email, password: userDetails.password })
    .toArray()
    .then(function (user) {
      callback(user);
    });
}

function createUserInDB(newUser, callback) {
  const collection = dbInstance.collection("usersList");

  collection.insertOne(newUser).then(function () {
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
  let userDetails = req.body;

  findUserInDB(userDetails, function (user) {
    if (user.length) {
      res.status(200);

      req.session.userId = user.id;
      req.session.username = user.name;
      req.session.isLoggedIn = true;

      console.log("User Signed In");

      res.json({ name: user.name, id: user.id });
    } else {
      res.status(404);
      res.end();
    }
  });
});

app.post("/sign-up", function (req, res) {
  let userDetails = req.body;

  findUserInDB(userDetails, function (user) {
    if (user.length) {
      res.status(400);
      res.end();
    }

    createUserInDB(userDetails, function () {
      res.status(200);

      req.session.userId = userDetails.id;
      req.session.username = userDetails.name;
      req.session.isLoggedIn = true;

      console.log("New User Signed Up");

      res.json({ name: userDetails.name, id: userDetails.id });
    });
  });
});

app.get("/sign-out", auth, function (req, res) {
  req.session.destroy();
  res.status(200);

  console.log("User Logged Out");

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
