const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const reviewSchema = new mongoose.Schema({
  comment: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;

// "Validation for review " lecture practice is remaining So complete it also
