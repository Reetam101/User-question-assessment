const mongoose = require("mongoose");

const optionSchema = mongoose.Schema({
  option_text: {
    type: String,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
});

const questionSchema = mongoose.Schema({
  text: {
    type: String,
  },
  option_1: {
    type: optionSchema,
  },
  option_2: {
    type: optionSchema,
  },
  option_3: {
    type: optionSchema,
  },
  option_4: {
    type: optionSchema,
  },
  answer: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
