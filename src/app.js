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

//API: Delete a user by findById
app.delete("/user", async (req, res) => {
  try {
    const userId = req?.body?.userId;
    const users = await User.findByIdAndDelete(userId);
    if (!users) res.status(404).send("No users found");
    else res.send(`User ${userId} deleted successfully`);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//API: Update a user
app.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req?.params?.userId;
    const data = req?.body;
    const ALLOWED_UPDATES = ["lastName", "gender", "skills", "about"];
    const isUpdateAllowed = Object.keys(data).find((el) => {
      return ALLOWED_UPDATES.includes(el) === false;
    });
    if (isUpdateAllowed)
      throw new Error(`Update not allowed for ${isUpdateAllowed}`);

    if (data?.skills?.length > 10)
      throw new Error("There cannot be more than 10 skills");

    const users = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    if (!users) res.status(404).send("No users found to be updated");
    else res.send(`User ${userId} updated successfully`);
  } catch (err) {
    res.status(400).send("Something went wrong: " + err?.message);
  }
});

//API: Update a user by email
app.patch("/userupdatebyemail", async (req, res) => {
  try {
    const userEmail = req?.body?.emailId;
    const data = req?.body;
    const users = await User.findOneAndUpdate({ emailId: userEmail }, data);
    if (!users) res.status(404).send("No users found to be updated");
    else res.send(`User ${users?._id} updated successfully`);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.post("/signup", async (req, res) => {
  const user = new User(req?.body);

  try {
    if (user?.skills?.length > 10)
      throw new Error("There cannot be more than 10 skills");
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
