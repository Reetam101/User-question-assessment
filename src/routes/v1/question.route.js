const express = require("express");
const router = express.Router();
const passport = require("passport");
const { questionController } = require("../../controllers");
const auth = require("../../middlewares/auth");

const multer = require("multer");

// Setup Multer storage to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

//categories
router.get("/all-categories", questionController.getListOfCategories);
router.post(
  "/create-category",
  passport.authenticate("jwt", { session: false }),
  auth("admin"),
  questionController.createCategory
);
// router.delete("/delete-category", questionController.deleteCategory);

//questions
router.post(
  "/create-questions",
  passport.authenticate("jwt", { session: false }),
  auth("admin"),
  upload.single("file"),
  questionController.createQuestions
);
router.get("/by-category", questionController.getQuestionsByCategory);
// router.get('/details', questionController.getQuestion)
// router.post('/create-question',  passport.authenticate("jwt", { session: false }),
// auth("admin"), questionController.createAQuestion)

module.exports = router;
