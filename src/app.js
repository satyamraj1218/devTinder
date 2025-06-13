const express = require("express");

const app = express();

// app.use("/", (req, res) => {
//   res.send("Hello Satyam");
// });

app.use("/home", (req, res) => {
  res.send("Hello from the dashboard");
});

app.use("/test", (req, res) => {
  res.send("Hello from the test servers");
});

app.listen(7777, () => {
  console.log("App is listening on port 7777");
});
