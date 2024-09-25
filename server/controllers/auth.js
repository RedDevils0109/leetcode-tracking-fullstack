const jwt = require("jsonwebtoken");
const User = require("../models/users");
const catchAsync = require("../middlewares/catchAsync");
const ErrorHandler = require("../utils/errorHandler");


// Register user
exports.registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Create new user
  const user = await User.create({
    googleId: null,
    name,
    email,
    password,
    image:
      "https://w7.pngwing.com/pngs/304/275/png-transparent-user-profile-computer-icons-profile-miscellaneous-logo-monochrome-thumbnail.png",
  });

  // Generate reset token
  const resetToken = user.getResetToken();
  console.log(resetToken); // Log resetToken instead of 'token'

  // Set cookie options
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(
      Date.now() + Number(process.env.COOKIE_EXPIRE_TIME) * 24 * 60 * 60 * 1000
    ),
  };

  // Set reset token in cookie (or access token, depending on the use case)
  res.cookie("resetToken", resetToken, cookieOptions);

  // Generate access token
  const accessToken = user.getAccessToken(); // Call the function

  // Prepare user data
  const userData = {
    name: user.name,
    email: user.email,
    image: user.image,
  };

  // Respond with status and user data
  res.status(200).json({
    success: true,
    token: accessToken,
    data: { user: userData },
  });
});


exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Checks if email or password is entered by user
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & Password"), 401);
  }

  // Finding user in database
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password.", 401));
  }

  // Check if password is correct
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  const resetToken = user.getResetToken();
  console.log(resetToken);

  const cookieOptions = {
    httpOnly: true, // Corrected naming convention
    expires: new Date(
      Date.now() + Number(process.env.COOKIE_EXPIRE_TIME) * 24 * 60 * 60 * 1000
    ),
  };
  
  res.cookie("resetToken", resetToken, cookieOptions);
  const userData = {
    name: user.name,
    image: user.image,
    email: user.email,
  };

  const accessToken = user.getAccessToken(); 
  res.status(200).json({
    success: true,
    token: accessToken,
    data: { user: userData },
  });
});



exports.logout = catchAsync(async (req, res, next) => {
  res.cookie("resetToken", "none", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
});