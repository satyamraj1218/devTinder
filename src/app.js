const express = require("express");

const app = express();

app.get("/a{b}cd", (req, res) => {
  res.send({ firstName: "satyam", lastName: "raj" });
});

app.get("/user/:userId/:name/:password", (req, res) => {
  console.log(req.params);
  // console.log(req.query);
  res.send({ firstName: "satyam", lastName: "raj" });
});

app.get("/user", (req, res) => {
  res.send("Hello from the user route");
});

app.post("/user", (req, res) => {
  res.send("Data successfully saved to the database");
});

app.delete("/user", (req, res) => {
  res.send("Data successfully deleted from the database");
});

app.use("/home", (req, res) => {
  res.send("Hello from the dashboard");
});

app.use("/test", (req, res) => {
  res.send("Hello from the test servers");
});

app.use("/", (req, res) => {
  res.send("Hello Satyam");
});

app.listen(7777, () => {
  console.log("App is listening on port 7777");
});
