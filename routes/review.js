const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listings");
// const Review = require("../models/reviews.js");
const reviewsController = require("../controllers/reviews.js");
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../ExpressError.js");

const Review = require("../models/reviews");
const isloggedin = require("../middleware.js");
// const { createReview } = require("../controllers/reviews.js")

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};    //not working validation 

const reviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author._id.equals(res.locals.curUser._id)) {
    req.flash("success", "You don't have permission to delete this review.");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

router.post("/", isloggedin, validateReview, reviewsController.createReview);

router.delete(
  "/:reviewId",
  isloggedin,
  reviewAuthor,
  reviewsController.delReview
);

module.exports = router;
