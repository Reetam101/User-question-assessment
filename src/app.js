const express = require("express");
const cors = require("cors");
const routes = require("./routes/v1");
const { errorConverter, errorHandler } = require("./middlewares/error");
const passport = require("passport");
const { jwtStrategy } = require("./config/passport");
const ApiError = require("./utils/ApiError");
const httpStatus = require("http-status");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.options("*", cors());

app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// routes
app.use("/api/v1", routes);

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

app.use(errorConverter);

app.use(errorHandler);

module.exports = app;
