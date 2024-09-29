const jwt = require("jsonwebtoken");
const User = require("../models/users");
const catchAsync = require("../middlewares/catchAsync");
const ErrorHandler = require("../utils/errorHandler");

// Register user
exports.registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  console.log(email)
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & Password", 401));
  }
  const existedUser = await User.find({email: email})
  console.log(existedUser)
  if (existedUser.length > 0 ) {
    return next(new ErrorHandler("Email already exised", 401));
  }

  // Create new user
  const user = await User.create({
    googleId: null,
    name,
    email,
    password,
    image:
      "https://w7.pngwing.com/pngs/304/275/png-transparent-user-profile-computer-icons-profile-miscellaneous-logo-monochrome-thumbnail.png",
  });

  

  // Respond with status and user data
  res.status(200).json({
    success: true,
    
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
  

  const cookieOptions = {
    httpOnly: true, // Corrected naming convention
    secure: false,
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


exports.resetToken = catchAsync(async (req, res, next) => {
  const resetToken = req.cookies.resetToken;
  if (!resetToken) {
    return next(new ErrorHandler("Reset token not found", 401));
  }
  try {
    const resetTokenDecoded = jwt.verify(
      resetToken,
      process.env.JWT_RESET_SECRET
    );
    const userId = resetTokenDecoded.id;
    const accessToken = jwt.sign(
      { id: userId }, 
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: process.env.ACCESS_EXPIRE_TIME,
      }
    );

    res.status(200).json({
      success: true,
      token: accessToken,
    });
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      return next(new ErrorHandler("Reset token expired", 401));
    }
    return next(new ErrorHandler("Invalid reset token", 401));
  }
});
