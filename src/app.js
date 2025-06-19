const express = require('express');
const bcrypt = require('bcrypt');
const { connectDb } = require('./config/database');
const { isValidRequest } = require('./utils/validations');
const User = require('./models/user');
const app = express();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth');

app.use(express.json());
app.use(cookieParser());

//API: To get a user from DB based on emailId
app.get('/user', async (req, res) => {
  const userEmail = req?.body?.emailId;

  try {
    const userDetails = await User.findOne({ emailId: userEmail });
    if (userDetails) res.send(userDetails);
    else res.status(404).send('User not found');
  } catch (err) {
    res.status(400).send('Something went wrong');
  }
});

//Feed API : To get all the users from db based
app.get('/feed', async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length != 0) res.send(users);
    else res.status(404).send('No users found');
  } catch (err) {
    res.status(400).send('Something went wrong');
  }
});

//API: Delete a user by findById
app.delete('/user', async (req, res) => {
  try {
    const userId = req?.body?.userId;
    const users = await User.findByIdAndDelete(userId);
    if (!users) res.status(404).send('No users found');
    else res.send(`User ${userId} deleted successfully`);
  } catch (err) {
    res.status(400).send('Something went wrong');
  }
});

//API: Update a user
app.patch('/user/:userId', async (req, res) => {
  try {
    const userId = req?.params?.userId;
    const data = req?.body;
    const ALLOWED_UPDATES = ['lastName', 'gender', 'skills', 'about'];
    const isUpdateAllowed = Object.keys(data).find((el) => {
      return ALLOWED_UPDATES.includes(el) === false;
    });
    if (isUpdateAllowed)
      throw new Error(`Update not allowed for ${isUpdateAllowed}`);

    if (data?.skills?.length > 10)
      throw new Error('There cannot be more than 10 skills');

    const users = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    if (!users) res.status(404).send('No users found to be updated');
    else res.send(`User ${userId} updated successfully`);
  } catch (err) {
    res.status(400).send('Something went wrong: ' + err?.message);
  }
});

app.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req?.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error('Invalid Credentials');
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid Credentials');
    } else {
      //creating a jwt token
      const token = await jwt.sign({ _id: user?._id }, '@Satyam$Tinder', {
        expiresIn: '7d',
      });

      //Adding the token to cookie and send the response back to the server
      res.cookie('token', token, {
        expires: new Date(Date.now() + 56 * 3600000),
      });
      res.send('Login successful!!!');
    }
  } catch (err) {
    res.status(400).send('ERROR: ' + err?.message);
  }
});

app.get('/profile', userAuth, async (req, res) => {
  try {
    res.send(req?.user);
  } catch (err) {
    res.status(400).send('ERROR: ' + err?.message);
  }
});

app.post('/sendrequest', userAuth, async (req, res) => {
  try {
    res.send(
      `Connection Request sent by ${req?.user?.firstName} ${req?.user?.lastName}`
    );
  } catch (error) {
    res.status(400).send('ERROR: ' + err?.message);
  }
});

app.post('/signup', async (req, res) => {
  try {
    //validate the request
    isValidRequest(req?.body);

    const { firstName, lastName, emailId, password } = req?.body;

    //encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send('User added successfully');
  } catch (err) {
    res.status(400).send('ERROR: ' + err?.message);
  }
});

connectDb()
  .then(() => {
    console.log('Database connection established!!!');
    app.listen(7777, () => {
      console.log('App is listening on port 7777');
    });
  })
  .catch((err) => {
    console.error('Database was not connected');
  });
