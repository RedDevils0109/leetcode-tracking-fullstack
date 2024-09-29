const User = require("../models/users");
const catchAsync = require("../middlewares/catchAsync");

exports.getUserProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.userId);
 
  const userData = {
    name: user.name,
    email: user.email,
    image: user.image,
  };
  res.status(200).json({
    success: true,
    data: {
      user: userData,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const formData = {
    ...req.body
  }
  const user = await User.findByIdAndUpdate(req.userId, formData, {
    new: true,
    runValidators: true,
  });
  newUserData = {
    name: user.name,
    email: user.email,
    image: user.image
  }
  res.status(200).json({
    success: true,
    data: {
      user: newUserData,
    },
  });
});
