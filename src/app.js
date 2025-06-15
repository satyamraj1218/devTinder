const express = require("express");
const { connectDb } = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());

//API: To get a user from DB based on emailId
app.get("/user", async (req, res) => {
  const userEmail = req?.body?.emailId;

  try {
    const userDetails = await User.findOne({ emailId: userEmail });
    if (userDetails) res.send(userDetails);
    else res.status(404).send("User not found");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//Feed API : To get all the users from db based
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length != 0) res.send(users);
    else res.status(404).send("No users found");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

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
