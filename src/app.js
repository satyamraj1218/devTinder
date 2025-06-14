const express = require("express");

const app = express();

// app.use("/router", rh1, rh2, rh3, rh4);
// We can also wrap any of the route handlers inside array, same result

app.get("/user", [
  (req, res, next) => {
    console.log("Route Handler 1");
    // res.send("Response from the RH1");
    next();
  },
  (req, res, next) => {
    console.log("Route Handler 2");
    // res.send("Response from the RH2");
    next();
  },
  ,
  (req, res, next) => {
    console.log("Route Handler 3");
    res.send("Response from the RH3");
    // next();
  },
]);

app.listen(7777, () => {
  console.log("App is listening on port 7777");
});
