const httpStatus = require("http-status");
const { Question, Category } = require("../models");
const ApiSuccess = require("../utils/ApiSuccess");
const ApiError = require("../utils/ApiError");
const csvParser = require("csv-parser");
const fs = require("fs");
const mongoose = require("mongoose");

const createAQuestion = async (req, res, next) => {
  try {
    const question = await Question.create(req.body);
    return new ApiSuccess(
      res,
      httpStatus.CREATED,
      "Question created successfully",
      question
    );
  } catch (error) {
    next(error);
  }
};

const createQuestions = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const questions = [];
  const fileBuffer = req.file.buffer;

  const stream = require("stream");
  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileBuffer);

  bufferStream
    .pipe(csvParser())
    .on("data", (row) => {
      const question = {
        text: row.text,
        option_1: {
          option_text: row.option_1_text,
        },
        option_2: {
          option_text: row.option_2_text,
        },
        option_3: {
          option_text: row.option_3_text,
        },
        option_4: {
          option_text: row.option_4_text,
        },
        answer: row.answer,
        category: row.category,
      };
      questions.push(question);
    })
    .on("end", async () => {
      try {
        await Question.insertMany(questions);
        return new ApiSuccess(
          res,
          httpStatus.CREATED,
          "Questions added successfully"
        );
      } catch (error) {
        next(error);
      } finally {
        fs.unlinkSync(filePath);
      }
    })
    .on("error", (error) => {
      next(error);
    });
};

const createCategory = async (req, res, next) => {
  try {
    const existingCategory = await Category.findOne({ name: req.body.name });
    if (existingCategory)
      throw new ApiError(httpStatus.CONFLICT, "Category already exists");
    const category = await Category.create(req.body);
    return new ApiSuccess(
      res,
      httpStatus.CREATED,
      "Category created successfully",
      category
    );
  } catch (error) {
    next(error);
  }
};

const getListOfCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    return new ApiSuccess(
      res,
      httpStatus.CREATED,
      "Category created successfully",
      categories
    );
  } catch (error) {
    next(error);
  }
};

const getQuestionsByCategory = async (req, res, next) => {
  const { categoryId } = req.query;

  try {
    const questions = await Question.aggregate([
      {
        $match: {
          category: new mongoose.Types.ObjectId(categoryId),
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $unwind: "$categoryDetails",
      },
      {
        $project: {
          text: 1,
          option_1: 1,
          option_2: 1,
          option_3: 1,
          option_4: 1,
          category: "$categoryDetails.name",
        },
      },
    ]);

    return new ApiSuccess(
      res,
      httpStatus.CREATED,
      "Questions by category",
      questions
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createQuestions,
  createCategory,
  getListOfCategories,
  getQuestionsByCategory,
  createAQuestion,
};
