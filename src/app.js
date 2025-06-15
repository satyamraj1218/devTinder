const express = require("express");
const { connectDb } = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req?.body);

  try {
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error while adding data " + err?.message);
  }
});

connectDb()
  .then(() => {
    console.log("Database connection established!!!");
    app.listen(7777, () => {
      console.log("App is listening on port 7777");
    });
  })
  .catch((err) => {
    console.error("Database was not connected");
  });
