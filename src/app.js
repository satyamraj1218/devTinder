const express = require("express");

const app = express();

// Error Handling
// This is one way of error handling. other way is try-catch block
app.get("/getUserData", (req, res) => {
  throw new Error("Error Occurred");
});

app.get("/getUserDetails", (req, res) => {
  try {
    throw new Error("Error Occurred");
  } catch {
    //log your error
    res.status(500).send("Something went wrong...Contact support.");
  }
});

// sometimes people can miss try catch to handle error, so we can keep something like this to handle errors by default
// when there are 4 params in handler fn, 1st => err, 2nd => req, 3rd => res, 4th => next
//use will handle all type of http methods

app.use("/", (err, req, res, next) => {
  if (err) {
    //log your error
    res.status(500).send("Something went wrong. Contact support.");
  }
});

//Middlewares

/* const { adminAuth, userAuth } = require("./middlewares/auth");

app.use("/admin", adminAuth);

app.get("/user/data", userAuth, (req, res) => {
  res.send("User data sent");
});

app.get("/user/login", (req, res) => {
  res.send("User logged in successfully");
});

app.get("/admin/getAllData", (req, res) => {
  res.send("All data sent to admin");
});

app.get("/admin/deleteUser", (req, res) => {
  res.send("Deleted a user");
}); */

app.listen(7777, () => {
  console.log("App is listening on port 7777");
});
