const express = require("express");

const app = express();

const { adminAuth, userAuth } = require("./middlewares/auth");

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
});

app.listen(7777, () => {
  console.log("App is listening on port 7777");
});
