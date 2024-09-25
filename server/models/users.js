const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
    },
    image: {
      type: String,
    },
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email address"],
      unique: true,
      validate: [validator.isEmail, "PLease enter valid email address"],
    },
    password: {
      type: String,
      required: [true, "Please enter password for your account"],
      minlenght: [8, "Your password must be at least 8 characters long"],
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.getResetToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_RESET_SECRET, {
    expiresIn: process.env.RESET_EXPIRE_TIME,
  });
  return token;
};
userSchema.methods.getAccessToken  = function() {
  const token = jwt.sign({ id: this._id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.ACCESS_EXPIRE_TIME,
  });
  return token;
}

userSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model('User', userSchema)
module.exports = User