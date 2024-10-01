const express = require("express");
const app = express();
const env = require("dotenv");
const cookieParser = require("cookie-parser");
const sanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const errorMiddleware = require("./middlewares/error");
const ErrorHandler = require("./utils/errorHandler");
const connectDatabase = require("./config/database");
const cors = require("cors");


env.config();
const port = process.env.PORT || 5000;


const passport = require("passport");
require("./config/passport-setup");

// Connect to database
connectDatabase();

// Middleware setup
app.use(
  helmet({
    contentSecurityPolicy: false, 
  })
);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, 
  })
);
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser()); // Ensure cookie parser is set before routes

// Sanitize data to prevent NoSQL injection
app.use(sanitize());

app.use(passport.initialize());

// Setup CORS to allow frontend requests


// Routes
const auth = require("./routes/auth");
const user = require("./routes/user");
const topic = require("./routes/topic")
const leetcode = require("./routes/leetcode")

app.use("/auth", auth);
app.use("/user", user);
app.use("/topic", topic)
app.use("/leetcode", leetcode)

// Test route
app.get("/test", (req, res) => {
  res.json({
    users: ["kha", "Thu", "Truc"],
  });
});

// Catch-all for undefined routes
app.all("*", (req, res, next) => {
  next(new ErrorHandler(`${req.url} route not found`, 404));
});

// Error handling middleware
app.use(errorMiddleware);

// Start server
app.listen(port, () => {
  console.log(`LISTENING ON PORT ${port}`);

});
