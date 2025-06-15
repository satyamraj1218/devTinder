const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://satyamraj1218:kZbtuLdbmr0mmED6@satyamnode.vydk0a4.mongodb.net/devTinder"
  );
};

module.exports = { connectDb };
