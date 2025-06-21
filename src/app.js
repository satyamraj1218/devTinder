const express = require('express');
const app = express();

const { connectDb } = require('./config/database');
const { authRouter, profileRouter, requestRouter } = require('./routers');

const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);

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
