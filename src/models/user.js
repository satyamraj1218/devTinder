const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 40,
    },
    lastName: {
      type: String,
      trim: true,
      minLength: 2,
      maxLength: 40,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      minLength: 2,
      maxLength: 256,
      validate(value) {
        if (!(value.includes("@") && value.includes("."))) {
          throw new Error("Invalid Email");
        }
      },
    },
    password: {
      type: String,
      requried: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error(`Invalid gender: ${value}`);
        }
      },
    },
    imageUrl: {
      type: String,
      default: "https://www.inforwaves.com/home-2/dummy-profile-pic-300x300-1/",
    },
    about: {
      type: String,
      default: "This is a default about of the user",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);
