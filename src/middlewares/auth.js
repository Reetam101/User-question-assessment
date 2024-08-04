const ApiError = require("../utils/ApiError");

// Middleware function to check if the user has the required role(s)
const auth =
  (...requiredRoles) =>
  (req, res, next) => {
    console.log(req.user);
    console.log(requiredRoles);
    if (req.user && requiredRoles.includes(req.user.role)) {
      return next();
    } else {
      throw new ApiError(403, "Access denied. Insufficient permissions");
    }
  };

module.exports = auth;
