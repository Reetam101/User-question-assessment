const httpStatus = require("http-status");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");
const ApiSuccess = require("../utils/ApiSuccess");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const register = async (req, res, next) => {
  //create the user in the db
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Email is already taken");
    }
    const user = await User.create(req.body);
    return new ApiSuccess(
      res,
      httpStatus.CREATED,
      "User registered successfully",
      user.toJSON()
    );
  } catch (error) {
    next(error);
  }
};

const generateToken = (
  userId,
  expires,
  type,
  secret = process.env.JWT_SECRET
) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(60, "minutes");
  const accessToken = generateToken(user.id, accessTokenExpires, "ACCESS");

  const refreshTokenExpires = moment().add(7, "days");
  const refreshToken = generateToken(user.id, refreshTokenExpires, "REFRESH");

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  if (!tokenDoc) {
    throw new Error("Token not found");
  }
  return true;
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user || !(await user.isPasswordMatch(password))) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Incorrect email or password"
      );
    }
    const tokens = await generateAuthTokens(user);
    return new ApiSuccess(
      res,
      httpStatus.OK,
      "Login successfull",
      user.toJSON(),
      tokens
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
