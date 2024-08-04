const express = require("express");
const ApiSuccess = require("../../utils/ApiSuccess");
const httpStatus = require("http-status");
const router = express.Router();
const { authController } = require("../../controllers/index");

router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
