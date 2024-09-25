const express = require("express");
const app = express();
const env = require("dotenv");
env.config();
const cookieParser = require("cookie-parser");
const sanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const errorMiddleware = require("./middlewares/error");
const ErrorHandler = require("./utils/errorHandler");
const connectDatabase = require("./config/database");
const cors = require("cors");
const port = process.env.PORT;

connectDatabase();

app.use(cors());

const auth = require("./routes/auth");
const user = require("./routes/user");

//Setup scurity header
app.use(helmet());

app.use(express.json());
app.use(cookieParser());

//Sanitize Data
app.use(sanitize());

app.use("/auth", auth);
app.use("/user", user);

app.get("/test", (req, res) => {
  res.json({
    users: ["kha", "Thu", "Truc"],
  });
});
app.all("*", (req, res, next) => {
  next(new ErrorHandler(`${req.url} route not found`, 404));
});
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`LISTENNING IN PORT ${port}`);
});
