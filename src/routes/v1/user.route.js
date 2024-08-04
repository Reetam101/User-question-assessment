const express = require("express");
const { userController } = require("../../controllers");
const router = express.Router();
const auth = require("../../middlewares/auth");
const passport = require("passport");

router.get(
  "/view-profile",
  passport.authenticate("jwt", { session: false }),
  auth("user", "admin"),
  userController.getProfile
);
router.patch(
  "/edit-profile",
  passport.authenticate("jwt", { session: false }),
  auth("user"),
  userController.editProfile
);

module.exports = router;
