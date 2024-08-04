const passport = require("passport");
const passportJWT = require("passport-jwt");
const User = require("../models/user.model"); // Replace with your user model import
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../.env") });
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const jwtOptions = {
  secretOrKey: process.env.JWT_SECRET, // Replace with a secret key
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (jwtPayload, done) => {
  console.log(jwtPayload);
  try {
    const user = await User.findById(jwtPayload.sub);
    if (!user) return done(null, false);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
passport.use(jwtStrategy);
module.exports = {
  jwtStrategy,
};
