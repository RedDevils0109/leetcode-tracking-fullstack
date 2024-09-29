const jwt = require("jsonwebtoken");
const User = require("../models/users");
const catchAsync = require("./catchAsync");
const ErrorHandler = require("../utils/errorHandler");

exports.isAuthenticatedUser = catchAsync(async (req, res, next) => {
  // Extract Bearer Token from the Authorization header
  const authHeader = req.headers.authorization;
  

  if (authHeader && authHeader.startsWith("Bearer")) {
    accessToken = authHeader.split(" ")[1];
  }

  if (!accessToken) {
    return next(new ErrorHandler("Access token not found", 401));
  }
  // Verify the reset token if present
  try {
    const resetToken = req.cookies.resetToken;
  
    if (!resetToken) {
      return next(new ErrorHandler("Reset token not found", 401));
    }
 

    const resetTokenDecoded = jwt.verify(
      resetToken,
      process.env.JWT_RESET_SECRET
    );
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new ErrorHandler("Reset token expired", 401)); // Handle expired reset token
    }
    return next(new ErrorHandler("Invalid reset token", 401)); // Handle other reset token errors
  }

  // Verify the access token
  let decoded;
  try {
    decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    
    req.userId = decoded.id; // Attach decoded user info to the request object
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new ErrorHandler("Access token expired", 401)); // Handle expired access token
    }
    return next(new ErrorHandler("Invalid access token", 401)); // Handle other access token errors
  }

  next(); // Proceed to the next middleware if both tokens are valid
});
