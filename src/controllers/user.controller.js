const httpStatus = require("http-status");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");
const ApiSuccess = require("../utils/ApiSuccess");

const getProfile = async (req, res, next) => {
  try {
    console.log(req.user);
    const user = await User.findById(req.query.id);
    if (!user)
      throw new ApiError(httpStatus.NOT_FOUND, "User does not exist in the db");
    return new ApiSuccess(res, httpStatus.OK, "User profile", user.toJSON());
  } catch (error) {
    next(error);
  }
};

const editProfile = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate({ _id: req.user._id }, req.body, {
      new: true,
    });
    if (!user)
      throw new ApiError(httpStatus.BAD_REQUEST, "User profile update failed");
    return new ApiSuccess(
      res,
      httpStatus.OK,
      "User updated successfully",
      user.toJSON()
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  editProfile,
};
